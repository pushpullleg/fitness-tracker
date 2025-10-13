# 🚀 Fittober Fitness Tracker - Complete Setup Guide

This guide covers everything you need to deploy and run the Fittober Fitness Tracker from scratch.

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Database Setup (Supabase)](#database-setup)
3. [Backend Deployment (Vercel)](#backend-deployment)
4. [Frontend Deployment (GitHub Pages)](#frontend-deployment)
5. [Email Notifications (SendGrid)](#email-notifications)
6. [Automated Daily Emails (GitHub Actions)](#automated-daily-emails)
7. [Testing](#testing)
8. [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before starting, you'll need:
- GitHub account
- Vercel account (free tier)
- Supabase account (free tier)
- SendGrid account (free tier - 100 emails/day)
- 4 GitHub Gists with fitness data

---

## Database Setup

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com/) and sign up
2. Create a new project
3. Wait for database to provision (~2 minutes)
4. Go to **Settings** → **Database**
5. Copy the **Connection String** (Session Mode, port 5432)
6. Save it as `DATABASE_URL` for later

### 2. Create Database Schema

1. Go to **SQL Editor** in Supabase
2. Run the schema from `backend/database.sql`:

```sql
CREATE TABLE IF NOT EXISTS activities (
  uid UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  log_id TEXT NOT NULL,
  member TEXT NOT NULL,
  activity TEXT NOT NULL,
  duration_min INTEGER NOT NULL,
  ts TIMESTAMPTZ NOT NULL,
  device_team TEXT NOT NULL DEFAULT 'Fittober',
  source_gist TEXT NOT NULL,
  raw_json JSONB NOT NULL,
  inserted_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (log_id, source_gist)
);

CREATE INDEX IF NOT EXISTS idx_activities_member ON activities(member);
CREATE INDEX IF NOT EXISTS idx_activities_ts ON activities(ts);
```

3. Verify table was created in **Table Editor**

---

## Backend Deployment

### 1. Prepare Repository

Your project structure should look like:
```
fitness-tracker/
├── api/
│   └── index.js          # Vercel serverless entry point
├── backend/
│   ├── index.js          # Main Express application
│   ├── package.json      # Backend dependencies
│   └── database.sql      # Database schema
├── package.json          # Root package.json (for Vercel)
└── vercel.json          # Vercel configuration
```

### 2. Deploy to Vercel

1. Go to [vercel.com](https://vercel.com/) and sign in with GitHub
2. Click **Add New** → **Project**
3. Import your `fitness-tracker` repository
4. Configure:
   - **Framework Preset:** Other
   - **Root Directory:** `./` (leave as root)
   - **Build Command:** (leave empty)
   - **Output Directory:** (leave empty)

### 3. Add Environment Variables

In Vercel project settings, add:

| Variable | Value | Description |
|----------|-------|-------------|
| `DATABASE_URL` | `postgresql://...` | From Supabase (Session Mode) |
| `NODE_ENV` | `production` | Environment |

4. Click **Deploy**
5. Wait for deployment to complete
6. Note your Vercel URL (e.g., `https://fitness-tracker-xyz.vercel.app`)

### 4. Test Backend

```bash
curl https://your-vercel-url.vercel.app/api/aggregates.json
```

You should see JSON with team members and totals.

---

## Frontend Deployment

### 1. Update API URL

Edit `index.html` and update the API URL:

```javascript
const API_BASE_URL = 'https://your-vercel-url.vercel.app';
```

### 2. Deploy to GitHub Pages

1. Go to your repo **Settings** → **Pages**
2. Set source to **Deploy from a branch**
3. Select **main** branch and **/ (root)** folder
4. Click **Save**
5. Wait 1-2 minutes
6. Visit `https://your-username.github.io/fitness-tracker/`

---

## Email Notifications

### 1. Create SendGrid Account

1. Sign up at [SendGrid.com](https://signup.sendgrid.com/) (FREE - 100 emails/day)
2. Verify your email address

### 2. Get API Key

1. Go to **Settings** → **API Keys**
2. Click **Create API Key**
3. Name: `Fittober Tracker`
4. Permission: **Full Access**
5. Copy the API key (you won't see it again!)

### 3. Verify Sender Email

1. Go to **Settings** → **Sender Authentication**
2. Click **Verify a Single Sender**
3. Fill in your email details
4. Verify via email link

### 4. Add Environment Variables to Vercel

Add these 3 variables in Vercel project settings:

| Variable | Value |
|----------|-------|
| `SENDGRID_API_KEY` | `SG.xxxxx...` |
| `SENDGRID_FROM_EMAIL` | Your verified email |
| `EMAIL_RECIPIENTS` | `email1@domain.com,email2@domain.com,email3@domain.com,email4@domain.com` |

5. **Redeploy** the project for changes to take effect

### 5. Test Email

```bash
curl https://your-vercel-url.vercel.app/api/test-digest
```

Check your inbox for the test email!

---

## Automated Daily Emails

### 1. GitHub Actions Setup

The workflow is already configured in `.github/workflows/email-digest.yml`.

It runs daily at **9:00 PM CST** (02:00 UTC).

### 2. Manual Trigger

To test the automated email:
1. Go to **Actions** tab in your GitHub repo
2. Click **Send Daily Email Digest**
3. Click **Run workflow** → **Run workflow**
4. All team members should receive the email

### 3. Schedule Details

- **Frequency:** Once per day
- **Time:** 9:00 PM CST (Texas time)
- **Recipients:** All 4 team members
- **Content:** Today's activities + team standings + embedded chart

---

## Testing

### Test Backend Health
```bash
curl https://your-vercel-url.vercel.app/health
```

### Test Aggregates API
```bash
curl https://your-vercel-url.vercel.app/api/aggregates.json
```

### Test Email Digest (Only to You)
```bash
curl https://your-vercel-url.vercel.app/api/test-digest
```

### Test Email Digest (All Team Members)
```bash
curl https://your-vercel-url.vercel.app/api/send-digest
```

---

## Troubleshooting

### Frontend Shows "Loading..." Forever
- **Check:** Is the API URL correct in `index.html`?
- **Check:** Open browser console (F12) for errors
- **Test:** Visit API URL directly in browser

### Backend Returns 500 Error
- **Check:** Vercel logs (go to deployment → Runtime Logs)
- **Check:** Database connection string is correct
- **Check:** All environment variables are set

### Email Not Sending
- **Check:** SendGrid API key is valid
- **Check:** Sender email is verified in SendGrid
- **Check:** All 3 email variables are set in Vercel
- **Check:** Vercel deployment was redeployed after adding variables

### GitHub Actions Not Running
- **Check:** Workflow file is in `.github/workflows/email-digest.yml`
- **Check:** Workflow is enabled (Actions → Select workflow → Enable)
- **Check:** UTC time conversion (9 PM CST = 02:00 UTC next day)

### Database Connection Pool Errors
- **Check:** Using Session Mode connection string (port 5432)
- **Check:** `max: 1` in pool configuration
- **Check:** `allowExitOnIdle: true` is set

---

## Architecture Overview

```
GitHub Gists (4 sources)
    ↓
Backend (Vercel Serverless)
    ↓
PostgreSQL (Supabase)
    ↓
Frontend (GitHub Pages) ← Users view here
    ↓
SendGrid → Email to team (daily at 9 PM CST)
```

---

## Support

- **GitHub Issues:** Report bugs or feature requests
- **Documentation:** Check `README.md` for project overview
- **Email Setup:** See `EMAIL_SETUP.md` for detailed email guide

---

## Next Steps

After setup is complete:
1. ✅ Verify dashboard shows data
2. ✅ Test email digest
3. ✅ Wait for first automated email at 9 PM CST
4. ✅ Monitor GitHub Actions logs
5. ✅ Add README with project details
