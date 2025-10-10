# ⏰ Vercel Cron Job Setup

## What is this?

This cron job automatically checks for new fitness activities every hour by:
1. Running at the top of every hour (e.g., 1:00 PM, 2:00 PM, 3:00 PM)
2. Calling the `/api/webhook` endpoint
3. Fetching data from all 4 GitHub Gists
4. Updating the Supabase database
5. Sending WhatsApp notifications

## Schedule

**Current Schedule:** `0 * * * *`
- Runs **every hour** at minute 0
- Examples: 1:00 PM, 2:00 PM, 3:00 PM, etc.

### Other Schedule Options (if you want to change):

```
0 * * * *       - Every hour at minute 0
*/15 * * * *    - Every 15 minutes (requires paid Vercel plan)
0 */2 * * *     - Every 2 hours
0 9-17 * * *    - Every hour from 9 AM to 5 PM
0 8,12,18 * * * - At 8 AM, 12 PM, and 6 PM only
```

## How to Test

Test the cron endpoint manually:
```bash
curl https://fitness-tracker-flame-kappa.vercel.app/api/cron
```

## Files

- `/api/cron.js` - The cron job handler
- `vercel.json` - Contains the cron schedule configuration

## Monitoring

Check Vercel dashboard:
1. Go to https://vercel.com/pushpulllegs-projects/fitness-tracker
2. Click "Cron Jobs" tab
3. See execution history and logs

## How It Works

```
Vercel Scheduler (every hour)
    ↓
Calls /api/cron
    ↓
/api/cron calls /api/webhook
    ↓
/api/webhook calls pollAllGists()
    ↓
Fetches from 4 GitHub Gists
    ↓
Updates Supabase Database
    ↓
Sends WhatsApp Notifications
    ↓
Dashboard shows new data
```

## Backup: Manual Refresh Button

The refresh button on the dashboard still works! Use it if you want instant updates instead of waiting for the next hourly cron run.
