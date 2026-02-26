# Test Plan — MIGRATION.md Adversarial Audit

## Audit Findings

### Blocking

- **[MIGRATION.md §Pre-stage] No verification that Docker config.json was copied correctly.**
  The plan runs `scp m4tt@100.106.99.73:~/.docker/config.json ~/.docker/config.json` but never
  confirms the file arrived, is valid JSON, or contains credentials for GHCR. If it fails silently
  (e.g., SSH key not accepted, wrong path on BigGirl), `docker compose pull` will fail with opaque
  auth errors. There is no test for `docker login ghcr.io` success after the copy.

- **[MIGRATION.md §Pre-stage] `docker compose pull` is not verified.**
  The plan pulls images but does not confirm all three tagged images (proxy `nginx:alpine`,
  `app`, `backend`) are locally cached. If a pull fails partway through (rate limit, registry
  outage, wrong IMAGE env var), the stack will silently run whatever old image is cached — or
  fail at `docker compose up -d` during the cutover window when it's too late.

- **[MIGRATION.md §Export DB] No integrity check on the backup file.**
  `pg_dump` writes to `/tmp/hrai_backup.sql` but the plan does not verify: (a) the file is
  non-empty, (b) the file is valid SQL (ends with expected trailer), (c) the `scp` transfer
  completed without corruption. A truncated backup silently imported will produce a partially
  restored database with no error raised by `psql` (psql exits 0 on partial success if it hits
  no syntax error before truncation).

- **[MIGRATION.md §Cutover] `sleep 10` is an arbitrary, unverified readiness gate.**
  The plan does `docker compose up -d && sleep 10` then immediately restores the DB. If the
  `db` container's healthcheck has not passed within 10 seconds (cold image pull on Anvil,
  slower disk, first-time volume init), `psql` restore will fail with "connection refused" or
  "database does not exist". The compose healthcheck is `pg_isready` with 5s interval and 5
  retries (25s worst case), so 10s is provably insufficient on a cold start.

- **[MIGRATION.md §Cutover] DB restore runs against an already-initialized database.**
  The schema migration at `backend/migrations/001_create_schema.sql` runs via
  `docker-entrypoint-initdb.d` when the postgres volume is first created. The `pg_dump` backup
  will also contain `CREATE TABLE IF NOT EXISTS` and `CREATE INDEX IF NOT EXISTS` — but it will
  also contain `CREATE TRIGGER` and `CREATE OR REPLACE FUNCTION` statements. If the dump uses
  `pg_dump` defaults (no `--clean`, no `--if-exists`), restoring into an already-initialized
  schema will produce duplicate object errors that do not abort the restore but do spam stderr.
  The plan provides no flags to `pg_dump` or `psql` to handle this cleanly.

- **[MIGRATION.md §Cutover] cloudflared config edit is manual with no validation step.**
  The plan says "Edit /etc/cloudflared/config.yml" with a comment showing what to change, then
  immediately restarts cloudflared. There is no `cloudflared tunnel ingress validate` call, no
  check that the file was actually saved, and no rollback procedure if cloudflared fails to
  restart (the `sudo systemctl restart cloudflared` call will exit 0 even if the service
  crashes after reload if using some systemd versions — you need `systemctl is-active`).

- **[MIGRATION.md §Cutover] Order of operations creates a race condition.**
  The plan stops BigGirl's stack, then edits cloudflared config, then restarts cloudflared,
  then starts Anvil's stack. But cloudflared begins forwarding traffic to Anvil:8080 the moment
  it restarts — before `docker compose up -d` has been run on Anvil. Any request arriving
  between `systemctl restart cloudflared` and the moment nginx-proxy is listening on Anvil:8080
  will get a connection refused, which Cloudflare will surface as a 502. The stated "~2 min
  downtime" does not account for this gap; the correct order is to start Anvil first.

- **[MIGRATION.md §Cutback] No DB sync before cutback.**
  The cutback procedure stops Anvil and restarts BigGirl's old stack. It does not export and
  reimport any data written to Anvil's DB during the migration window. Any newsletter signups,
  event data edits, or other writes made while running on Anvil are silently discarded. The
  plan has no mention of this data loss risk.

- **[MIGRATION.md §Cutback] BigGirl's schema may be stale.**
  After maintenance, BigGirl's postgres volume is whatever state it was in when `docker compose
  down` was run. If any schema migrations were applied to Anvil during the migration window
  (possible — Watchtower is enabled on `backend` and will deploy new backend images), BigGirl
  restarts with an old schema against a new backend image. This is not addressed.

### Should-fix

- **[MIGRATION.md §Pre-stage] Tailscale connectivity to BigGirl is assumed, never verified.**
  The `scp` command assumes `100.106.99.73` is reachable from Anvil via Tailscale. If Tailscale
  is not running on Anvil, or if BigGirl's node is expired/offline, the scp silently hangs or
  fails. No `ping 100.106.99.73` or `tailscale status` check is specified.

- **[MIGRATION.md §Cutover] Watchtower is running on Anvil during restore.**
  `docker compose up -d` starts Watchtower (enabled in docker-compose.yml, polls every 180s).
  If a new image is pushed during the restore window, Watchtower will restart `backend` mid-
  restore, potentially corrupting the DB restore in progress. The plan does not pause Watchtower
  (CLAUDE.md §Common Pitfalls item 5 explicitly warns about this).

- **[MIGRATION.md §Verify] Verification only tests the Angular SPA, not the backend API.**
  `curl -H "Host: hoodriveraicollective.com" http://100.91.37.20:8080/` fetches the static
  Angular app. It does not verify: (a) `/health` on nginx-proxy returns 200, (b) backend
  `/health` is reachable via proxy, (c) `/api/events/:id` returns data (proving DB restore
  worked), (d) DB tables contain the expected row counts from the source dump.

- **[MIGRATION.md §Pre-stage] No check that Anvil has sufficient disk space.**
  Pulling three Docker images plus the postgres data volume requires substantial disk. No
  `df -h` check is specified. A failed pull due to full disk during the cutover window is
  unrecoverable without rolling back immediately.

- **[MIGRATION.md §Export DB] `/tmp` is used for backup with no size check.**
  If the postgres data is large, `/tmp` on BigGirl may fill up, causing `pg_dump` to write a
  truncated file with exit code 1 — but the plan does not check `$?` after pg_dump or scp.

- **[MIGRATION.md §Cutover] `docker compose exec -T db psql ... < /tmp/hrai_backup.sql` exit
  code is not checked.** If psql exits non-zero, the plan proceeds with a broken database and
  a live site serving errors. No `|| { echo "RESTORE FAILED"; docker compose down; exit 1; }`
  guard exists.

- **[MIGRATION.md general] No mention of `.env` file.**
  `docker-compose.yml` uses `${DB_PASSWORD}`, `${IMAGE}`, and `${BACKEND_IMAGE}` env vars.
  If `/home/m4tt/hrmeetup-website/.env` does not exist on Anvil, containers start with default
  `DB_PASSWORD=postgres`. The plan does not copy `.env` from BigGirl to Anvil. This is also
  a GHCR auth concern — the `IMAGE` var may not be needed but `DB_PASSWORD` in production
  should not be the default.

- **[MIGRATION.md general] `~/hrmeetup-website` path used on Anvil, but repo is at
  `~/AI_Collective` locally.** The migration plan uses `~/hrmeetup-website` throughout. This
  is inconsistent with the local working directory (`/home/m4tt/AI_Collective`). If Anvil
  clones to `~/AI_Collective` by default (the repo name), all `cd ~/hrmeetup-website` commands
  in the cutback/cutover steps will fail. The git clone command in the plan specifies
  `~/hrmeetup-website` explicitly — but this must be documented and must match what's actually
  used.

### Minor

- **[MIGRATION.md §Cutover] `docker compose up -d` does not specify `--remove-orphans`.**
  If the compose file on Anvil differs from what was running on BigGirl (different branch,
  different service set), orphan containers may persist. Not critical but leaves the host dirty.

- **[MIGRATION.md general] No timeout specified for cloudflared config propagation.**
  After `sudo systemctl restart cloudflared`, the plan goes straight to testing. Cloudflare
  tunnels may take 5-30 seconds to re-establish the connection. The verify step could fail
  transiently and be misread as a misconfiguration failure.

- **[MIGRATION.md general] No mention of Watchtower on BigGirl during pre-stage.**
  While Anvil is being pre-staged (possibly hours before cutover), Watchtower on BigGirl is
  still running. If a bad image is deployed to BigGirl during this window, it makes the
  pre-stage more urgent. Minor, but the plan implies a clean BigGirl state.

---

## Test Coverage Map

| Phase | Script | Machine | Tests | Blocking Issues Covered |
|-------|--------|---------|-------|------------------------|
| Pre-stage | `scripts-local/test-01-prestage.sh` | Anvil | 21 | .env not copied; docker pull not verified; Tailscale not checked; disk space; port 8080 conflict |
| DB Export | `scripts-local/test-02-db-export.sh` | BigGirl | 20 | pg_dump exit code; backup integrity (header+trailer+tables); --clean flag; scp transfer verification; /tmp space; row count snapshot |
| Cutover | `scripts-local/test-03-cutover.sh` | Anvil (stack) + BigGirl (cloudflared) | 18 | Race condition (Anvil up before cloudflared flips); sleep 10 replaced by poll loop; DB restore exit code; --clean schema conflict; Watchtower during restore; cloudflared config validation; systemctl is-active |
| Verify | `scripts-local/test-04-verify.sh` | Anvil or any | 22 | SPA content vs default nginx; backend /health; /api/events route; newsletter POST; row count integrity; schema objects (triggers, indexes); public domain + TLS |
| Cutback | `scripts-local/test-05-cutback.sh` | Anvil (export) + BigGirl (import + cloudflared + verify) | 28 | Anvil DB export before shutdown; data preservation; schema version check; race condition in reverse; cloudflared revert validation; Watchtower re-enabled |
| Syntax | `scripts-local/migration-tests-run.sh --phase syntax` | Local | 7 files | All scripts pass `bash -n` |

**Total tests: ~89 across 5 suites + shared harness**

## Test Strategy

- Framework: bash (no external dependencies required on target machines)
- Runner: `scripts-local/migration-tests-run.sh --phase <phase>`
- Harness: `scripts-local/test-harness.sh` (sourced by all test files, provides assert helpers + summary)

### Execution Order (production use)

```bash
# [On Anvil, hours/days before cutover]
bash scripts-local/migration-tests-run.sh --phase prestage

# [On BigGirl, immediately before docker compose down]
bash scripts-local/migration-tests-run.sh --phase export

# [On Anvil — FIRST step of cutover window]
SECTION=stack bash scripts-local/migration-tests-run.sh --phase cutover

# [On BigGirl — SECOND, only after Anvil stack passes above]
SECTION=cloudflared bash scripts-local/migration-tests-run.sh --phase cutover

# [On Anvil, after cloudflared flip]
bash scripts-local/migration-tests-run.sh --phase verify

# [Cutback — On Anvil first, before docker compose down]
SECTION=anvil_export bash scripts-local/migration-tests-run.sh --phase cutback

# [Cutback — On BigGirl]
SECTION=biggirl_import bash scripts-local/migration-tests-run.sh --phase cutback
SECTION=cloudflared    bash scripts-local/migration-tests-run.sh --phase cutback

# [Cutback — Final check, from anywhere]
SECTION=final_verify bash scripts-local/migration-tests-run.sh --phase cutback
```

### Environment Variable Overrides

```bash
REPO_DIR=/path/to/repo    # default: ~/hrmeetup-website
ANVIL_IP=100.91.37.20     # default: hardcoded Tailscale IP
BIGGIRL_IP=100.106.99.73  # default: hardcoded Tailscale IP
DB_USER=postgres           # default: postgres
DB_NAME=hrai_collective    # default: hrai_collective
SECTION=stack              # dispatch for test-03 and test-05
```

### Red/Green Status (tests RED against current MIGRATION.md plan)

These will fail (red) until MIGRATION.md is corrected:

| Test | Why Red Against Current Plan |
|------|------------------------------|
| `.env file exists in repo directory on Anvil` | Plan copies .docker/config.json but not .env |
| `DB_PASSWORD is not the insecure default 'postgres'` | Without .env, docker-compose.yml defaults apply |
| `pg_dump exits 0` | Plan does not capture or check pg_dump exit code |
| `Backup file ends with pg_dump complete trailer` | Plan has no integrity check on the output file |
| `Dump contains DROP TABLE statements (--clean was used)` | Plan uses bare pg_dump with no flags |
| `scp exits 0 + remote size matches local` | Plan has no scp verification step |
| `Watchtower is NOT running during DB restore` | Plan starts full stack with `up -d`, Watchtower included |
| `DB is pg_isready within 60s (not just 10s sleep)` | Plan uses unconditional `sleep 10` |
| `psql restore exits 0` | Plan does not check psql exit code |
| `No ERROR lines in psql restore stderr` | Plan does not use -v ON_ERROR_STOP=1 |
| `cloudflared is 'active' after restart (not crashed)` | Plan does not call systemctl is-active |
| `Anvil is already serving HTTP 200 BEFORE cloudflared is restarted` | Race condition: plan restarts cloudflared before starting Anvil |
| `Cutback: pg_dump on Anvil before stack shutdown` | Plan does not export Anvil DB at all before stopping |
| `BigGirl serving HTTP 200 before cloudflared revert` | Same race condition in reverse direction |

### Untestable Items

- **DNS/Cloudflare tunnel propagation timing**: Cannot be tested deterministically. The verify script retries 6 times at 10s intervals, but Cloudflare tunnel re-establishment after a restart can exceed 60s. Manual patience required.
- **Watchtower image push race during restore window**: The timing race between a Watchtower poll (180s interval) and the ~30s restore window cannot be reliably reproduced in a test without mocking the registry. The test asserts Watchtower is stopped as a required precondition — which is the correct mitigation.
- **BigGirl maintenance completion trigger**: Operational knowledge, not a testable condition.
