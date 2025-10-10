# 🤖 GitHub Actions Auto-Refresh

## What Is This?

A GitHub Action that **automatically** fetches new fitness data every hour without any manual intervention!

## ✅ What It Does

Every hour (at minute 0), this action:
1. 🔄 Calls your `/api/refresh` endpoint
2. 📊 Fetches data from all 4 GitHub Gists
3. 💾 Updates Supabase database
4. 📱 Sends WhatsApp notifications via Twilio
5. ✨ Dashboard shows updated data

## ⏱️ Schedule

**Current:** Runs every hour at minute 0
- Examples: 1:00 PM, 2:00 PM, 3:00 PM, etc.
- **24 runs per day**
- **Completely FREE** (uses ~24 minutes/month of your 2,000 free minutes)

## 🎯 How to Monitor

### View Action Runs:
1. Go to: https://github.com/pushpullleg/fitness-tracker/actions
2. Click on "Auto Refresh Fitness Data"
3. See all runs and their logs

### Manual Trigger (Test It Now!):
1. Go to: https://github.com/pushpullleg/fitness-tracker/actions
2. Click "Auto Refresh Fitness Data" workflow
3. Click "Run workflow" button
4. Click green "Run workflow" button
5. Watch it run in real-time!

## 📋 Change Schedule

Edit `.github/workflows/auto-refresh.yml` and change the cron line:

```yaml
# Every 15 minutes (most frequent)
- cron: '*/15 * * * *'

# Every hour (current setting - recommended)
- cron: '0 * * * *'

# Every 2 hours
- cron: '0 */2 * * *'

# Every 6 hours
- cron: '0 */6 * * *'

# Only during work hours (9 AM - 5 PM)
- cron: '0 9-17 * * *'

# Three times per day (8 AM, 2 PM, 8 PM)
- cron: '0 8,14,20 * * *'
```

## 🔍 Understanding Cron Syntax

```
* * * * *
│ │ │ │ │
│ │ │ │ └─── Day of week (0-6, Sunday=0)
│ │ │ └───── Month (1-12)
│ │ └─────── Day of month (1-31)
│ └───────── Hour (0-23)
└─────────── Minute (0-59)
```

## 🎉 Benefits

✅ **Fully Automatic** - No button clicking needed  
✅ **Free Forever** - GitHub gives 2,000 minutes/month free  
✅ **Reliable** - GitHub's infrastructure runs it  
✅ **Visible Logs** - See every run in GitHub Actions  
✅ **Manual Override** - Still have refresh button on dashboard  

## 🔧 Troubleshooting

### Action isn't running?
- Check: https://github.com/pushpullleg/fitness-tracker/actions
- GitHub Actions can have 5-10 minute delays on scheduled runs

### Want to test immediately?
- Use the "Manual Trigger" instructions above
- Or click the refresh button on your dashboard

### Need faster updates?
- Change cron to `*/15 * * * *` for every 15 minutes
- Or keep the refresh button for instant updates

## 📊 Current Status

Once you push this to GitHub, you'll see:
- ✅ Automatic updates every hour
- ✅ WhatsApp notifications sent automatically
- ✅ Dashboard always shows latest data (within 1 hour)
- ✅ Manual refresh button still works for instant updates

**Your fitness tracker is now FULLY AUTOMATED!** 🚀
