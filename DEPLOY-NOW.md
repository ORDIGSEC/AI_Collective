# Quick Deployment Guide

## Changes Ready to Deploy ✅

The following features have been implemented and are ready for production:

1. **Meetup RSVP Integration** - Event cards now display "RSVP on Meetup" buttons
2. **Footer Email Update** - Changed to matt@hoodriveraicollective.com
3. **Automatic URL Parsing** - Extracts Meetup URLs from Google Calendar descriptions

---

## Deploy Now (2 commands)

```bash
cd ~/hrmeetup-website
npm run build:prod && ./deploy.sh pull
```

**What this does:**
1. Builds optimized production bundle
2. Deploys to production server via Docker

**Estimated time:** ~2-3 minutes

---

## Verify Deployment

After deployment completes:

1. **Visit your website:**
   ```
   https://hoodriveraicollective.com
   ```

2. **Check footer:**
   - Email link should be `matt@hoodriveraicollective.com`

3. **Test Meetup integration:**
   - For next event, add Meetup URL to Google Calendar description
   - Wait 5-10 minutes
   - Verify "RSVP on Meetup" button appears on event card

---

## Example: Adding Meetup URL to Calendar Event

When creating/editing a Google Calendar event, add the Meetup URL anywhere in the description:

```
Join us for an exciting discussion about AI in the Columbia River Gorge!

Meetup: https://www.meetup.com/hood-river-ai-meetup/events/123456789

## Speakers
- John Doe - AI Researcher
...
```

The website will automatically detect the URL and display an RSVP button.

---

## Next Steps After Deployment

See `~/TODO.md` for complete checklist, but key next steps are:

### 1. Set Up Email (Critical - Do First!)
- Option A: Porkbun Email Forwarding (free)
- Option B: Porkbun Email Hosting ($24/year)
- See `~/TODO.md` Phase 0 for detailed instructions

### 2. Add to Google Maps (High Priority)
- Add Forge venue listing
- Add Hood River AI Collective listing
- See `~/TODO.md` Phase 1

### 3. Update Meetup.com Page
- Add website link
- Update venue details
- See `~/TODO.md` Phase 2

---

## Rollback (If Needed)

If something goes wrong after deployment:

```bash
cd ~/hrmeetup-website
git log --oneline -10  # Find previous commit hash
git checkout <previous-commit-hash>
npm run build:prod && ./deploy.sh pull
```

Then investigate the issue locally before re-deploying.

---

## Questions?

- Review `IMPLEMENTATION-SUMMARY.md` for technical details
- Check `~/TODO.md` for complete action items
- Test locally first: `npm run start` then visit http://localhost:4200

---

**Ready when you are!** 🚀
