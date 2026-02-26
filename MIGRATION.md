# Migrate hoodriveraicollective.com to Anvil

Temporary migration while BigGirl is down for maintenance. Cloudflared stays on BigGirl and proxies to Anvil over Tailscale.

Traffic path: `Internet -> Cloudflare -> BigGirl cloudflared -> Tailscale -> Anvil:8080`

**Test suite:** `scripts-local/migration-tests-run.sh --phase <phase>` (~89 tests total)

## Pre-stage (while BigGirl is still serving)

Run tests: `bash scripts-local/migration-tests-run.sh --phase prestage` (on Anvil)

```bash
# On Anvil (100.91.37.20)

# 1. Verify Tailscale connectivity to BigGirl
tailscale status
ping -c 2 -W 3 100.106.99.73

# 2. Check disk space (need >= 5GB free)
df -h $HOME
df -h /tmp

# 3. Clone repo
git clone git@github.com:ORDIGSEC/AI_Collective.git ~/hrmeetup-website
cd ~/hrmeetup-website

# 4. Copy Docker config AND .env from BigGirl
scp m4tt@100.106.99.73:~/.docker/config.json ~/.docker/config.json
scp m4tt@100.106.99.73:~/AI_Collective/.env ~/hrmeetup-website/.env

# 5. Verify .env has correct DB_PASSWORD (not 'postgres')
grep DB_PASSWORD .env

# 6. Pull images and verify each one landed
docker compose pull
docker images | grep -E 'nginx|ai_collective|postgres'

# 7. Verify port 8080 is free
ss -tlnp | grep :8080 || echo "Port 8080 is free"
```

## Export DB

Run tests: `bash scripts-local/migration-tests-run.sh --phase export` (on BigGirl)

```bash
# On BigGirl
cd ~/hrmeetup-website

# 1. Check /tmp space
df -h /tmp

# 2. Verify source DB is healthy and has data
docker compose exec -T db pg_isready -U postgres
docker compose exec -T db psql -U postgres -d hrai_collective \
  -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema='public';"

# 3. Dump with --clean --if-exists (idempotent restore)
docker compose exec -T db pg_dump -U postgres --clean --if-exists hrai_collective \
  > /tmp/hrai_backup.sql
echo "pg_dump exit code: $?"

# 4. Verify backup integrity
head -1 /tmp/hrai_backup.sql  # Should show "-- PostgreSQL database dump"
tail -5 /tmp/hrai_backup.sql  # Should show "-- PostgreSQL database dump complete"
wc -c /tmp/hrai_backup.sql    # Should be > 1KB
grep -c 'DROP TABLE' /tmp/hrai_backup.sql  # Should be > 0 (--clean was used)

# 5. Capture source row counts for post-restore comparison
for table in events speakers agenda_items resources newsletter_subscribers; do
  echo -n "$table: "
  docker compose exec -T db psql -U postgres -d hrai_collective -t \
    -c "SELECT COUNT(*) FROM $table;"
done

# 6. Transfer to Anvil and verify
scp /tmp/hrai_backup.sql anvil@100.91.37.20:/tmp/
LOCAL_SIZE=$(wc -c < /tmp/hrai_backup.sql)
REMOTE_SIZE=$(ssh anvil@100.91.37.20 "wc -c < /tmp/hrai_backup.sql")
echo "Local: ${LOCAL_SIZE}B  Remote: ${REMOTE_SIZE}B"
[ "$LOCAL_SIZE" = "$REMOTE_SIZE" ] && echo "Transfer OK" || echo "MISMATCH — retransfer!"
```

## Cutover (~2 min downtime)

Run tests: `SECTION=stack bash scripts-local/migration-tests-run.sh --phase cutover` (on Anvil, then BigGirl)

**IMPORTANT: Order matters. Start Anvil FIRST, then flip cloudflared.**

```bash
# === Step 1: BigGirl — stop website stack ===
cd ~/hrmeetup-website && docker compose down

# === Step 2: Anvil — start stack (WITHOUT Watchtower initially) ===
cd ~/hrmeetup-website
docker compose up -d --remove-orphans
docker compose stop watchtower  # Pause Watchtower during DB restore

# === Step 3: Anvil — wait for DB readiness (NOT just sleep 10) ===
echo "Waiting for DB..."
until docker compose exec -T db pg_isready -U postgres; do
  sleep 2
done
echo "DB is ready"

# Also verify Docker healthcheck
docker inspect $(docker compose ps -q db) --format '{{.State.Health.Status}}'

# === Step 4: Anvil — restore DB with error checking ===
docker compose exec -T db psql -U postgres -d hrai_collective \
  -v ON_ERROR_STOP=1 < /tmp/hrai_backup.sql 2>/tmp/restore_stderr.txt
echo "Restore exit code: $?"
grep -c '^ERROR:' /tmp/restore_stderr.txt && echo "ERRORS found — check stderr!" || echo "Clean restore"

# === Step 5: Anvil — verify stack is serving before flipping cloudflared ===
curl -sf -H "Host: hoodriveraicollective.com" http://100.91.37.20:8080/
curl -sf -H "Host: hoodriveraicollective.com" http://100.91.37.20:8080/api/health

# === Step 6: Anvil — re-enable Watchtower now that restore is done ===
docker compose start watchtower

# === Step 7: Flip cloudflared to Anvil ===
# NOTE: The hr-ai-sites tunnel uses REMOTE CONFIG from Cloudflare Zero Trust dashboard.
# The local /etc/cloudflared/config.yml is IGNORED when remote management is enabled.
# Go to: Cloudflare Zero Trust → Networks → Tunnels → hr-ai-sites → Configure
# Change BOTH hoodriveraicollective.com public hostname entries:
#   service: http://localhost:8080 → http://100.91.37.20:8080
# Leave chat.hoodriveraicollective.com and all other entries unchanged.
# Changes take effect within seconds — no systemctl restart needed.

# Verify the change took effect:
curl -sf -o /dev/null -w "%{http_code}" https://hoodriveraicollective.com/
journalctl -u cloudflared -n 10 --no-pager | grep -E 'fatal|failed' && echo "PROBLEM" || echo "OK"
```

## Verify

Run tests: `bash scripts-local/migration-tests-run.sh --phase verify` (on Anvil or any machine)

```bash
# 1. Nginx proxy responds
curl -sf -H "Host: hoodriveraicollective.com" http://100.91.37.20:8080/

# 2. Angular SPA content (not default nginx page)
curl -sf -H "Host: hoodriveraicollective.com" http://100.91.37.20:8080/ | grep "Hood River"

# 3. Backend health
curl -sf -H "Host: hoodriveraicollective.com" http://100.91.37.20:8080/api/health

# 4. Events API route
curl -sf -o /dev/null -w "%{http_code}" \
  -H "Host: hoodriveraicollective.com" http://100.91.37.20:8080/api/events/test

# 5. DB row counts match export
for table in events speakers agenda_items resources newsletter_subscribers; do
  echo -n "$table: "
  docker compose exec -T db psql -U postgres -d hrai_collective -t \
    -c "SELECT COUNT(*) FROM $table;"
done

# 6. Schema objects survived restore
docker compose exec -T db psql -U postgres -d hrai_collective -c \
  "SELECT COUNT(*) FROM pg_proc WHERE proname='update_updated_at_column';"

# 7. Public domain via Cloudflare tunnel
curl -sf https://hoodriveraicollective.com/ | grep "Hood River"
curl -sf https://hoodriveraicollective.com/api/health
```

## Cutback after maintenance

Run tests: `SECTION=anvil_export bash scripts-local/migration-tests-run.sh --phase cutback` (ordered across both machines)

**IMPORTANT: Export Anvil's DB before stopping it, or data written during migration is lost.**

```bash
# === Step 1: Anvil — export DB BEFORE stopping (preserve any writes) ===
cd ~/hrmeetup-website
docker compose exec -T db pg_dump -U postgres --clean --if-exists hrai_collective \
  > /tmp/hrai_cutback_backup.sql
echo "pg_dump exit code: $?"
tail -5 /tmp/hrai_cutback_backup.sql  # Verify trailer is intact
scp /tmp/hrai_cutback_backup.sql m4tt@100.106.99.73:/tmp/  # BigGirl user is m4tt

# Verify transfer
LOCAL_SIZE=$(wc -c < /tmp/hrai_cutback_backup.sql)
REMOTE_SIZE=$(ssh m4tt@100.106.99.73 "wc -c < /tmp/hrai_cutback_backup.sql")  # BigGirl user is m4tt
[ "$LOCAL_SIZE" = "$REMOTE_SIZE" ] && echo "Transfer OK" || echo "MISMATCH!"

# === Step 2: Anvil — stop stack ===
docker compose down

# === Step 3: BigGirl — start stack (WITHOUT Watchtower) ===
cd ~/hrmeetup-website
git pull --ff-only
docker compose up -d --remove-orphans
docker compose stop watchtower  # Pause during restore

# === Step 4: BigGirl — wait for DB readiness ===
until docker compose exec -T db pg_isready -U postgres; do
  sleep 2
done

# === Step 5: BigGirl — import Anvil's DB ===
docker compose exec -T db psql -U postgres -d hrai_collective \
  -v ON_ERROR_STOP=1 < /tmp/hrai_cutback_backup.sql 2>/tmp/cutback_stderr.txt
echo "Restore exit code: $?"
grep -c '^ERROR:' /tmp/cutback_stderr.txt && echo "ERRORS!" || echo "Clean"

# === Step 6: BigGirl — verify stack is serving BEFORE flipping cloudflared ===
curl -sf -H "Host: hoodriveraicollective.com" http://localhost:8080/
curl -sf -H "Host: hoodriveraicollective.com" http://localhost:8080/api/health

# === Step 7: BigGirl — re-enable Watchtower ===
docker compose start watchtower

# === Step 8: Revert cloudflared to BigGirl ===
# NOTE: The hr-ai-sites tunnel uses REMOTE CONFIG from Cloudflare Zero Trust dashboard.
# The local /etc/cloudflared/config.yml is IGNORED when remote management is enabled.
# Go to: Cloudflare Zero Trust → Networks → Tunnels → hr-ai-sites → Configure
# Change BOTH hoodriveraicollective.com public hostname entries:
#   service: http://100.91.37.20:8080 → http://localhost:8080
# Leave chat.hoodriveraicollective.com and all other entries unchanged.

# Verify the change took effect:
curl -sf -o /dev/null -w "%{http_code}" https://hoodriveraicollective.com/
journalctl -u cloudflared -n 10 --no-pager | grep -E 'fatal|failed' && echo "PROBLEM" || echo "OK"

# === Step 9: Final verification ===
curl -sf https://hoodriveraicollective.com/ | grep "Hood River"
curl -sf https://hoodriveraicollective.com/api/health
```
