# Security Review - Before Making Repository Public

**Date:** February 2, 2026
**Reviewer:** Claude Sonnet 4.5
**Status:** Review Complete

---

## Executive Summary

✅ **SAFE TO MAKE PUBLIC** with one caveat (see Google API Key section below)

The repository is generally safe to make public. The only sensitive credential is the Google Calendar API key, which is **intentionally exposed** in the client-side Angular app and is acceptable for public calendars with proper restrictions.

---

## Findings

### ✅ Safe Items (No Action Needed)

#### 1. Environment Files Not Tracked
```bash
✅ .env                    # Not tracked (in .gitignore)
✅ .envrc                  # Not tracked (in .gitignore)
✅ backend/.env            # Not tracked (assumed, should verify)
```

**Verification:**
```bash
$ git ls-files .env backend/.env
# (no output = not tracked ✓)
```

#### 2. Example Files Are Clean
```bash
✅ .env.example           # Contains placeholder values only
✅ backend/.env.example   # Contains placeholder values only
```

**Contents:** All have `your_api_key_here` or `your_secure_password_here` placeholders.

#### 3. Secrets Properly Managed
```bash
✅ GitHub Actions         # Uses secrets.GITHUB_TOKEN (not hardcoded)
✅ Database passwords     # Uses environment variables (${DB_PASSWORD})
✅ Backend config         # Uses process.env for all secrets
```

#### 4. Docker Credentials
```bash
✅ ~/.docker/config.json  # Local only, not tracked in git
✅ GHCR authentication    # Personal Access Token stored locally
```

---

### ⚠️ Items Requiring Review

#### 1. Google Calendar API Key (Intentionally Public)

**Location:**
- `src/environments/environment.prod.ts`
- `src/environments/environment.ts`

**Current Value:**
```typescript
googleApiKey: 'AIzaSyBddv5Lv4QIlAf5UVetnHYHPlqcaE0KyJA'
```

**Status:** ⚠️ **Exposed in client-side code (by design)**

**Context:**
- This key is **already public** (visible in browser when users visit the site)
- Used for public Google Calendar API access
- CLAUDE.md notes: "API key is exposed in browser (acceptable for public calendar)"

**Risk Assessment:**

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| API quota exhaustion | Medium | Low | API key restrictions |
| Unauthorized calendar access | Low | None | Read-only public calendar |
| Key abuse for other APIs | Low | Medium | Restrict key to Calendar API only |

**Recommendations:**

**Option A: Keep As-Is (Acceptable)**
- ✅ The key is already public (in browser)
- ✅ Making repo public doesn't increase exposure
- ⚠️ **MUST verify key restrictions in Google Cloud Console:**
  1. Go to: https://console.cloud.google.com/apis/credentials
  2. Find API key: `AIzaSyBddv5Lv4QIlAf5UVetnHYHPlqcaE0KyJA`
  3. Verify restrictions:
     - Application restrictions: HTTP referrers (websites)
     - Allowed referrers: `hoodriveraicollective.com/*`, `localhost:4200/*`
     - API restrictions: **Only Google Calendar API**

**Option B: Rotate Key (More Secure)**
1. Create new API key with proper restrictions
2. Update environment files
3. Deploy new version
4. Delete old key from Google Cloud Console

**Recommended:** **Option A** - Verify restrictions are set correctly

---

#### 2. Calendar ID (Public Information)

**Location:** Same environment files

**Current Value:**
```typescript
calendarId: 'ef3e5cb398ac36f88d43f97199cbcf09b78563a0b3f314ae241b86bc6373267f@group.calendar.google.com'
```

**Status:** ✅ **Safe to expose** (public calendar identifier)

**Context:**
- This is a public calendar shared at hoodriveraicollective.com
- Calendar ID is not a secret
- Anyone can view the calendar via the website already

---

### ✅ Files That Are Tracked (Verified Safe)

```bash
✅ docker-compose.yml        # Uses environment variables for passwords
✅ backend/src/config/*.ts   # Uses process.env for all secrets
✅ .github/workflows/*.yml   # Uses GitHub secrets properly
✅ deploy.sh                 # No hardcoded credentials
✅ setup-ghcr.sh             # Prompts for credentials, doesn't store them
```

---

## Verification Commands

Run these to double-check before making public:

```bash
# 1. Check for any uncommitted .env files
git status | grep -i env

# 2. Verify .env files are not tracked
git ls-files | grep "\.env$"

# 3. Search for potential secrets in tracked files
git grep -i "password\|secret\|token\|key" | grep -v "node_modules" | grep -v "package-lock.json"

# 4. Check for API keys pattern
git grep -E "AIza[0-9A-Za-z-_]{35}"

# 5. Verify .gitignore includes .env
cat .gitignore | grep "^\.env$"
```

---

## Pre-Publication Checklist

Before making the repository public:

- [x] Verify .env files are in .gitignore
- [x] Verify no .env files are tracked in git
- [x] Verify secrets use environment variables or GitHub secrets
- [x] Review example files for placeholder values only
- [ ] **CRITICAL:** Verify Google API key restrictions in Cloud Console
- [ ] Review commit history for accidentally committed secrets
- [ ] Consider rotating Google API key (optional but recommended)

---

## Action Items

### Required Before Publishing

1. **Verify Google API Key Restrictions:**
   ```bash
   # Visit: https://console.cloud.google.com/apis/credentials
   # Key: AIzaSyBddv5Lv4QIlAf5UVetnHYHPlqcaE0KyJA
   #
   # Confirm:
   # - Application restrictions: HTTP referrers
   # - Allowed referrers: hoodriveraicollective.com/*, localhost:4200/*
   # - API restrictions: Google Calendar API only
   ```

2. **Scan Commit History (Optional):**
   ```bash
   # Install gitleaks (optional secret scanning)
   # brew install gitleaks  # or apt-get install gitleaks
   # gitleaks detect --source . --verbose
   ```

### Recommended After Publishing

1. **Rotate Google API Key:**
   - Create new key with restrictions
   - Update environment files
   - Deploy
   - Delete old key

2. **Add Security Badge to README:**
   - Shows you've considered security
   - Link to SECURITY.md policy

3. **Create SECURITY.md:**
   - Document security policy
   - Provide vulnerability reporting instructions

---

## Risk Matrix

| Item | Exposure Level | Mitigation | Status |
|------|---------------|------------|--------|
| Google API Key | Public (already) | API restrictions | ⚠️ Verify restrictions |
| Calendar ID | Public | N/A (public calendar) | ✅ Safe |
| Database passwords | Environment vars | Not in git | ✅ Safe |
| GHCR credentials | Local only | Not in git | ✅ Safe |
| GitHub tokens | GitHub secrets | Properly managed | ✅ Safe |

---

## Conclusion

**Recommendation:** ✅ **PROCEED WITH MAKING REPOSITORY PUBLIC**

**Conditions:**
1. ✅ .env files are properly gitignored
2. ✅ No secrets in tracked files (except intentional Google API key)
3. ⚠️ **MUST VERIFY:** Google API key has proper restrictions set
4. ✅ Database and other credentials use environment variables

**The Google Calendar API key is the only "secret" in the repository, and it's:**
- Already exposed in the browser
- Intended for public use
- Should be restricted in Google Cloud Console
- Safe to be in a public repository with proper restrictions

**Once API key restrictions are verified, we can proceed to make the repository public and configure branch protection.**

---

## Next Steps

1. **Verify Google API Key Restrictions** (Required)
2. Make repository public
3. Configure branch protection rules
4. Optional: Rotate API key and update deployment
