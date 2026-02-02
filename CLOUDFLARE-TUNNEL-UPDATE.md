# Cloudflare Tunnel Configuration Update

## Required After Migration

After running `./migrate-to-unified.sh`, you need to update the Cloudflare Tunnel configuration to route the `chat` subdomain.

## Step 1: Backup Current Config

```bash
sudo cp /etc/cloudflared/config.yml /etc/cloudflared/config.yml.backup
```

## Step 2: Update /etc/cloudflared/config.yml

Edit the file with sudo:

```bash
sudo nano /etc/cloudflared/config.yml
```

Replace the ingress section with:

```yaml
tunnel: hr-ai-sites
credentials-file: /home/m4tt/.cloudflared/e3848467-6bf1-42e6-a94f-3c856b179897.json

ingress:
  # NEW: Open WebUI subdomain
  - hostname: chat.hoodriveraicollective.com
    service: http://localhost:8080
    originRequest:
      httpHostHeader: chat.hoodriveraicollective.com

  # EXISTING: Hood River main site
  - hostname: www.hoodriveraicollective.com
    service: http://localhost:8080
    originRequest:
      httpHostHeader: www.hoodriveraicollective.com

  - hostname: hoodriveraicollective.com
    service: http://localhost:8080
    originRequest:
      httpHostHeader: hoodriveraicollective.com

  # EXISTING: Other sites (unchanged)
  - hostname: ai.gorgehacker.space
    service: http://localhost:3000
  - hostname: www.gorgehacker.space
    service: http://localhost:8081
  - hostname: gorgehacker.space
    service: http://localhost:8081

  # Catch-all
  - service: http_status:404
```

## Step 3: Restart Cloudflared

```bash
sudo systemctl restart cloudflared
sudo systemctl status cloudflared
```

## Step 4: Add DNS Record in Cloudflare Dashboard

1. Go to Cloudflare Dashboard
2. Select domain: hoodriveraicollective.com
3. Navigate to DNS settings
4. Click "Add record"
5. Configure:
   - **Type:** CNAME
   - **Name:** chat
   - **Target:** hr-ai-sites.cfargotunnel.com
   - **Proxy status:** Proxied (orange cloud icon - enabled)
   - **TTL:** Auto
6. Click "Save"

## Step 5: Verify

Wait 1-2 minutes for DNS propagation, then test:

```bash
# Test Hood River site (should still work)
curl -I https://hoodriveraicollective.com

# Test Open WebUI (new subdomain)
curl -I https://chat.hoodriveraicollective.com
```

Both should return `HTTP/2 200` or similar success status.

## Rollback

If you need to rollback the Cloudflare configuration:

```bash
sudo cp /etc/cloudflared/config.yml.backup /etc/cloudflared/config.yml
sudo systemctl restart cloudflared
```

The DNS record for `chat` subdomain can be deleted from the Cloudflare Dashboard if needed.
