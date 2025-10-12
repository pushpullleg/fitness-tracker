# 📧 Email Digest Setup Guide

## Overview
Your Fittober Tracker now sends a daily email digest at **9:00 PM CST** with:
- All activities logged that day
- Team standings with embedded chart
- Days remaining in the challenge
- Link to live dashboard

---

## 🚀 Quick Setup (5 minutes)

### Step 1: Create SendGrid Account

1. Go to [SendGrid.com](https://signup.sendgrid.com/)
2. Sign up for **FREE** account (100 emails/day forever)
3. Verify your email address

### Step 2: Get API Key

1. Log in to [SendGrid Console](https://app.sendgrid.com/)
2. Go to **Settings** → **API Keys**
3. Click **Create API Key**
4. Name it: `Fittober Tracker`
5. Select **Full Access**
6. Click **Create & View**
7. **COPY the API key** (you won't see it again!)

### Step 3: Verify Sender Email

1. Go to **Settings** → **Sender Authentication**
2. Click **Verify a Single Sender**
3. Fill in:
   - **From Name:** `Fittober Tracker`
   - **From Email:** Your email (e.g., `mukesh@example.com`)
   - **Reply To:** Same as From Email
   - **Company:** `The Excel-erators`
   - **Address:** Your address
4. Click **Create**
5. Check your email and click verification link

### Step 4: Update Environment Variables

#### Local Testing (backend/.env):
```properties
SENDGRID_API_KEY=SG.xxxxxxxxxxxxxxxxxxxxx
SENDGRID_FROM_EMAIL=mukesh@example.com
EMAIL_RECIPIENTS=email1@example.com,email2@example.com,email3@example.com,email4@example.com
```

#### Vercel (Production):
1. Go to [Vercel Dashboard](https://vercel.com/pushpullleg/fitness-tracker/settings/environment-variables)
2. Add these 3 variables:

| Variable | Value |
|----------|-------|
| `SENDGRID_API_KEY` | `SG.xxxxx...` (from Step 2) |
| `SENDGRID_FROM_EMAIL` | `mukesh@example.com` (from Step 3) |
| `EMAIL_RECIPIENTS` | `email1@example.com,email2@example.com,email3@example.com,email4@example.com` |

3. Click **Save**
4. Redeploy your app

### Step 5: Install Dependencies

```bash
cd /Users/mukeshravichandran/fitness-tracker/backend
npm install
```

---

## 🧪 Test the Email

### Option 1: Manual Test (Immediate)
```bash
curl https://fitness-tracker-flame-kappa.vercel.app/api/send-digest
```

### Option 2: GitHub Actions Manual Trigger
1. Go to [GitHub Actions](https://github.com/pushpullleg/fitness-tracker/actions)
2. Click **Send Daily Email Digest** workflow
3. Click **Run workflow** → **Run workflow**
4. Check your email inbox!

---

## 📅 Schedule

The email automatically sends:
- **Time:** 9:00 PM CST (Central Time - Texas)
- **Frequency:** Once daily
- **Recipients:** All 4 team members (same email)

---

## 📊 What's Included in Each Email

1. **Header:**
   - Team name
   - Days remaining in challenge

2. **Embedded Dashboard Chart:**
   - Beautiful doughnut chart
   - Shows current team distribution
   - Clickable link to live dashboard

3. **Today's Activities:**
   - Grouped by team member
   - Shows activity type, duration, time
   - Total minutes per member

4. **Overall Standings:**
   - Full team leaderboard
   - Total minutes per member
   - Percentage of team total
   - Medals (🥇🥈🥉📊)

---

## 💰 Cost

**$0.00** - SendGrid Free Tier:
- 100 emails/day FREE forever
- You need: 4 recipients × 1 email/day = 4 emails/day
- **Well within free tier!** ✅

---

## 🐛 Troubleshooting

### Email Not Received?

1. **Check Spam Folder** - First emails often go to spam
2. **Verify Sender** - Make sure you completed Step 3
3. **Check Vercel Logs:**
   ```bash
   # Check if email was sent
   curl https://fitness-tracker-flame-kappa.vercel.app/api/send-digest
   ```
4. **Check SendGrid Activity:**
   - Go to SendGrid → Activity
   - See if email was sent/delivered/bounced

### Email Looks Wrong?

The email is responsive and should look great on all devices. If not:
- Open in Gmail/Outlook (best rendering)
- Check that all activities were logged in database
- Verify dashboard data is correct

---

## 🎨 Customization

Want to change the email? Edit `generateDigestEmail()` function in `backend/index.js`:

- **Change colors:** Search for `#00386C`, `#FFC333`, etc.
- **Add sections:** Add HTML to the template
- **Change schedule:** Edit `.github/workflows/email-digest.yml` cron

---

## ✅ Next Steps

1. Complete Setup Steps 1-4 above
2. Install dependencies (`npm install`)
3. Test the email manually
4. Commit and push changes:
   ```bash
   git add .
   git commit -m "Add daily email digest feature"
   git push origin main
   ```
5. Redeploy on Vercel
6. Wait for 9 PM CST to receive your first digest! 🎉

---

## 📧 Need Help?

If you run into issues:
1. Check Vercel deployment logs
2. Check SendGrid activity feed
3. Verify all environment variables are set
4. Make sure sender email is verified

Good luck with the challenge! 💪
