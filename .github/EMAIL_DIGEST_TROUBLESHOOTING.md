# GitHub Actions Email Digest - Troubleshooting Guide

**Last Updated:** October 13, 2025  
**Issue Resolved:** Incorrect timezone causing 1-hour delay

## ✅ Fix Applied

### Problem
- Workflow was scheduled for `20:00 UTC` (3:00 PM CDT)
- User expected trigger at 2:00 PM CDT
- **Root cause:** Daylight Saving Time not accounted for

### Solution
- Changed cron from `0 20 * * *` to `0 19 * * *`
- Added detailed logging with timestamps
- Added error handling and status verification

## 🕐 Timezone Reference

**Central Time in 2025:**

| Period | Timezone | UTC Offset | 2 PM Local Time = |
|--------|----------|------------|-------------------|
| **March 9 - Nov 2** | CDT (Daylight) | UTC-5 | 19:00 UTC |
| **Nov 2 - March 8** | CST (Standard) | UTC-6 | 20:00 UTC |

**Current Schedule:**
- **Cron:** `0 19 * * *`
- **Triggers at:** 7:00 PM UTC
- **Local time:** 2:00 PM CDT (March-November)

> [!NOTE]
> When daylight saving ends (November 2, 2025), you'll need to change back to `0 20 * * *`

## 📋 Pre-Deployment Checklist

Before committing workflow changes, verify:

- [ ] Workflow file is in `.github/workflows/` directory
- [ ] File has `.yml` or `.yaml` extension
- [ ] Cron syntax is correct (use [crontab.guru](https://crontab.guru))
- [ ] Branch is the default branch (usually `main`)
- [ ] Repository has had commits in the last 60 days
- [ ] `workflow_dispatch` is enabled for manual testing

## 🔍 How to Verify Tomorrow (October 14, 2025)

### Option 1: Check GitHub Actions Dashboard

1. Go to your repository on GitHub
2. Click **Actions** tab
3. Look for "Send Daily Email Digest" workflow
4. Check if it ran automatically at **2:00-2:15 PM CDT**

### Option 2: Check Email

1. Wait until **2:15 PM CDT** (allow 15 min delay)
2. Check your inbox for the daily digest email
3. Verify it contains "Last 24 Hours" activity data

### Option 3: Check Workflow Logs

1. Go to **Actions** > **Send Daily Email Digest**
2. Click on the latest run
3. Check the logs show:
   - ✅ "Triggered at (CDT): [time around 2:00 PM]"
   - ✅ "HTTP Status Code: 200"
   - ✅ "Email digest sent successfully!"

## 🐛 Troubleshooting

### Workflow Didn't Run at Expected Time

**Possible Causes:**

1. **GitHub Actions Delay**
   - **Normal:** 5-15 minutes late during high load
   - **Solution:** Wait up to 15 minutes past scheduled time

2. **Wrong Timezone**
   - **Check:** Verify cron matches your current timezone offset
   - **Tool:** Use `date -u` vs `TZ='America/Chicago' date`

3. **Workflow Disabled**
   - **Check:** Repository Settings > Actions > Workflow permissions
   - **Fix:** Enable "Allow all actions and reusable workflows"

4. **No Recent Activity**
   - **Issue:** GitHub pauses workflows after 60 days of inactivity
   - **Fix:** Make any commit to re-enable

5. **Branch Issue**
   - **Check:** Workflow must be on default branch (`main`)
   - **Fix:** Merge changes to main branch

### Workflow Ran But No Email Received

1. **Check API Response**
   - Go to Actions logs
   - Look for "HTTP Status Code: 200"
   - If not 200, check error message

2. **Check SendGrid**
   - Verify API key is set in Vercel
   - Check SendGrid dashboard for email activity
   - Ensure sender email is verified

3. **Check Email Spam Folder**
   - Digest emails might be filtered
   - Add sender to contacts

4. **Check SendGrid Limit**
   - Free tier: 100 emails/day
   - Verify you haven't exceeded limit

## 🧪 Manual Testing

Test the workflow right now:

### Method 1: GitHub UI
1. Go to **Actions** > **Send Daily Email Digest**
2. Click **Run workflow** button
3. Select `main` branch
4. Click green **Run workflow** button

### Method 2: Command Line
```bash
# Trigger workflow via GitHub CLI
gh workflow run email-digest.yml

# Check status
gh run list --workflow=email-digest.yml
```

### Method 3: Direct API Call
```bash
# Test the endpoint directly
curl -X POST "https://fitness-tracker-flame-kappa.vercel.app/api/send-digest"
```

## 📊 Monitoring Schedule

| Day | Date | Expected Time (CDT) | UTC Time | Status |
|-----|------|---------------------|----------|--------|
| Mon | Oct 13 | ❌ 3:00 PM (wrong) | 20:00 | Manual trigger |
| Tue | Oct 14 | ✅ 2:00 PM (fixed) | 19:00 | To be verified |
| Wed | Oct 15 | 2:00 PM | 19:00 | |
| Thu | Oct 16 | 2:00 PM | 19:00 | |

## 🔧 Quick Fixes

### If it fails tomorrow, immediately check:

```bash
# 1. Verify the cron schedule
cat .github/workflows/email-digest.yml | grep cron

# 2. Check if workflow is enabled
gh api repos/:owner/:repo/actions/workflows

# 3. View recent runs
gh run list --workflow=email-digest.yml --limit 5

# 4. View logs of last run
gh run view --log
```

### Emergency fallback:

If automation fails, manually trigger at 2 PM:
1. Go to Actions tab
2. Click "Send Daily Email Digest"
3. Click "Run workflow"

## 📝 Important Notes

> [!WARNING]
> **Daylight Saving Time Change**
> - On **November 2, 2025** at 2 AM, clocks fall back
> - Change cron to `0 20 * * *` after this date
> - Otherwise, emails will send at 1:00 PM CST

> [!TIP]
> **Best Practice**
> - Set a calendar reminder for November 1, 2025
> - Update cron schedule before DST ends
> - Test with manual trigger after updating

## 🎯 Success Criteria for Tomorrow

✅ **Workflow should:**
1. Trigger between 2:00-2:15 PM CDT
2. Show "HTTP Status Code: 200" in logs
3. Display "Email digest sent successfully!"
4. Send email to all 4 team members

✅ **You should verify:**
1. Check GitHub Actions at 2:20 PM CDT
2. Check email inbox by 2:20 PM CDT
3. Review workflow logs for any errors

## 📞 Support

If issues persist after following this guide:

1. **Check GitHub Status**: [status.github.com](https://status.github.com)
2. **Review Logs**: Actions > Workflow run > View logs
3. **Test API Directly**: `curl` the send-digest endpoint
4. **Check Vercel Logs**: Vercel dashboard > Functions > Logs

---

**Next verification:** October 14, 2025 at 2:00 PM CDT
