# Weekly Digest Setup Guide

## 📚 Table of Contents
- [Understanding Cron Syntax](#understanding-cron-syntax)
- [Timezone Considerations](#timezone-considerations)
- [Weekly Digest Examples](#weekly-digest-examples)
- [Creating Your Weekly Workflow](#creating-your-weekly-workflow)
- [Testing & Troubleshooting](#testing--troubleshooting)

---

## 🕐 Understanding Cron Syntax

Cron uses 5 fields to define when a job runs:

```
┌───────────── minute (0 - 59)
│ ┌───────────── hour (0 - 23)
│ │ ┌───────────── day of month (1 - 31)
│ │ │ ┌───────────── month (1 - 12)
│ │ │ │ ┌───────────── day of week (0 - 6) (Sunday to Saturday)
│ │ │ │ │
* * * * *
```

### Special Characters

| Character | Meaning | Example |
|-----------|---------|---------|
| `*` | Any value | `* * * * *` = every minute |
| `,` | List of values | `0 9,12,15 * * *` = 9 AM, 12 PM, 3 PM |
| `-` | Range of values | `0 9-17 * * *` = every hour from 9 AM to 5 PM |
| `/` | Step values | `*/15 * * * *` = every 15 minutes |

### Days of Week

| Number | Day |
|--------|-----|
| 0 or 7 | Sunday |
| 1 | Monday |
| 2 | Tuesday |
| 3 | Wednesday |
| 4 | Thursday |
| 5 | Friday |
| 6 | Saturday |

---

## 🌍 Timezone Considerations

**IMPORTANT:** GitHub Actions cron runs in **UTC** timezone!

### Your Timezone: Central Time (America/Chicago)

| Period | Timezone | UTC Offset | Conversion |
|--------|----------|------------|------------|
| **March 9 - Nov 2** | CDT (Daylight) | UTC-5 | Local - 5 = UTC |
| **Nov 2 - March 8** | CST (Standard) | UTC-6 | Local - 6 = UTC |

### Quick Conversion Formula

**During CDT (Summer - March to November):**
```
Your local time - 5 hours = UTC time for cron
Example: 2:00 PM CDT - 5 = 19:00 UTC → cron: '0 19 * * *'
```

**During CST (Winter - November to March):**
```
Your local time - 6 hours = UTC time for cron
Example: 2:00 PM CST - 6 = 20:00 UTC → cron: '0 20 * * *'
```

### Online Tools
- **Cron Expression Generator:** [crontab.guru](https://crontab.guru)
- **Timezone Converter:** [timeanddate.com](https://www.timeanddate.com/worldclock/converter.html)

---

## 📅 Weekly Digest Examples

### Example 1: Every Sunday at 9:00 AM CDT

**Goal:** Send weekly summary every Sunday morning

```yaml
# Current time: CDT (Summer)
- cron: '0 14 * * 0'  # 9:00 AM CDT = 14:00 UTC, Sunday (0)

# After DST ends (November 2):
- cron: '0 15 * * 0'  # 9:00 AM CST = 15:00 UTC, Sunday (0)
```

**Explanation:**
- `0` = minute 0 (on the hour)
- `14` = 14:00 UTC (2:00 PM UTC = 9:00 AM CDT)
- `*` = any day of month
- `*` = any month
- `0` = Sunday

---

### Example 2: Every Monday at 8:00 AM CDT

**Goal:** Start-of-week motivational digest

```yaml
# Current time: CDT (Summer)
- cron: '0 13 * * 1'  # 8:00 AM CDT = 13:00 UTC, Monday (1)

# After DST ends:
- cron: '0 14 * * 1'  # 8:00 AM CST = 14:00 UTC, Monday (1)
```

---

### Example 3: Every Friday at 5:00 PM CDT

**Goal:** End-of-week summary

```yaml
# Current time: CDT (Summer)
- cron: '0 22 * * 5'  # 5:00 PM CDT = 22:00 UTC, Friday (5)

# After DST ends:
- cron: '0 23 * * 5'  # 5:00 PM CST = 23:00 UTC, Friday (5)
```

---

### Example 4: Bi-Weekly (Every Other Sunday)

**Goal:** Send digest every 2 weeks

```yaml
# Option 1: Manual tracking (simpler)
# Run every Sunday, but filter in your API
- cron: '0 14 * * 0'

# Option 2: Use multiple cron schedules for specific dates
- cron: '0 14 1,15 * 0'  # 1st and 15th of month if Sunday
```

> [!NOTE]
> GitHub Actions doesn't natively support "every 2 weeks" in cron. You'll need to handle the logic in your backend API by checking the date.

---

### Example 5: Multiple Days (Mon, Wed, Fri)

**Goal:** Send digest 3 times per week

```yaml
# Multiple specific days
- cron: '0 14 * * 1,3,5'  # Monday, Wednesday, Friday at 9 AM CDT
```

---

## 🚀 Creating Your Weekly Workflow

### Step 1: Create the Workflow File

Create a new file: `.github/workflows/weekly-digest.yml`

```yaml
name: Send Weekly Email Digest

on:
  schedule:
    # Every Sunday at 9:00 AM CDT (14:00 UTC)
    - cron: '0 14 * * 0'
  workflow_dispatch:  # Allow manual trigger for testing

jobs:
  send-weekly-digest:
    runs-on: ubuntu-latest
    
    steps:
      - name: Display Trigger Time
        run: |
          echo "============================================"
          echo "📅 Weekly Email Digest Workflow Started"
          echo "============================================"
          echo "Triggered at (UTC): $(date -u)"
          echo "Triggered at (CDT): $(TZ='America/Chicago' date)"
          echo "Day of week: $(date +%A)"
          echo "============================================"
      
      - name: Send Weekly Email Digest
        run: |
          echo "📤 Calling weekly-digest API endpoint..."
          RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "https://fitness-tracker-flame-kappa.vercel.app/api/send-weekly-digest")
          HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
          BODY=$(echo "$RESPONSE" | head -n-1)
          
          echo "HTTP Status Code: $HTTP_CODE"
          echo "Response: $BODY"
          
          if [ "$HTTP_CODE" -eq 200 ]; then
            echo "✅ Weekly email digest sent successfully!"
          else
            echo "❌ Failed to send weekly digest. HTTP $HTTP_CODE"
            exit 1
          fi
      
      - name: Verify Completion
        run: |
          echo "============================================"
          echo "✅ Weekly Email Digest Workflow Completed"
          echo "Completed at (UTC): $(date -u)"
          echo "Completed at (CDT): $(TZ='America/Chicago' date)"
          echo "Next run: Next Sunday at 9:00 AM CDT"
          echo "============================================"
```

### Step 2: Backend API Endpoint (Optional)

You'll need to create a new endpoint in your backend: `/api/send-weekly-digest`

**Example for `backend/index.js`:**

```javascript
/**
 * Send Weekly Digest Email
 * Aggregates last 7 days of activities
 */
app.post('/api/send-weekly-digest', async (req, res) => {
  try {
    console.log('📅 Generating weekly digest...');
    
    // Get activities from last 7 days
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - 7);
    
    const result = await pool.query(
      `SELECT * FROM activities 
       WHERE activity_date >= $1 
       ORDER BY activity_date DESC`,
      [weekStart]
    );
    
    // Calculate weekly totals per member
    const memberTotals = {};
    result.rows.forEach(activity => {
      if (!memberTotals[activity.member_name]) {
        memberTotals[activity.member_name] = 0;
      }
      memberTotals[activity.member_name] += activity.duration_minutes;
    });
    
    // Generate and send email (similar to daily digest)
    const emailContent = generateWeeklyEmailTemplate(memberTotals);
    
    await sgMail.send({
      to: ['member1@email.com', 'member2@email.com'],
      from: 'your-verified-sender@email.com',
      subject: '📅 Weekly Fitness Digest - Your 7-Day Summary',
      html: emailContent
    });
    
    res.json({ 
      message: 'Weekly digest sent successfully',
      period: 'last 7 days',
      emailsSent: 4
    });
  } catch (error) {
    console.error('Error sending weekly digest:', error);
    res.status(500).json({ error: 'Failed to send weekly digest' });
  }
});
```

---

## 🧪 Testing & Troubleshooting

### Manual Testing

**Method 1: GitHub UI**
1. Go to **Actions** tab in your repository
2. Click **"Send Weekly Email Digest"**
3. Click **"Run workflow"** button
4. Select `main` branch
5. Click green **"Run workflow"**

**Method 2: Command Line**
```bash
# Using GitHub CLI
gh workflow run weekly-digest.yml

# Check status
gh run list --workflow=weekly-digest.yml --limit 5
```

**Method 3: Direct API Call**
```bash
# Test your endpoint directly
curl -X POST "https://fitness-tracker-flame-kappa.vercel.app/api/send-weekly-digest"
```

---

### Common Schedule Patterns Cheat Sheet

| Goal | Cron (CDT Summer) | Cron (CST Winter) | Days |
|------|------------------|-------------------|------|
| **Sunday 9 AM** | `0 14 * * 0` | `0 15 * * 0` | Sun |
| **Monday 8 AM** | `0 13 * * 1` | `0 14 * * 1` | Mon |
| **Friday 5 PM** | `0 22 * * 5` | `0 23 * * 5` | Fri |
| **Saturday 10 AM** | `0 15 * * 6` | `0 16 * * 6` | Sat |
| **Mon/Fri 9 AM** | `0 14 * * 1,5` | `0 15 * * 1,5` | Mon, Fri |
| **Weekdays 8 AM** | `0 13 * * 1-5` | `0 14 * * 1-5` | Mon-Fri |
| **Weekend 10 AM** | `0 15 * * 0,6` | `0 16 * * 0,6` | Sat, Sun |

---

## 📊 Popular Weekly Digest Schedules

### For Fitness Tracking (Recommended)

**1. End of Week Review (Sunday Evening)**
```yaml
- cron: '0 0 * * 1'  # Sunday 7 PM CDT = Monday 00:00 UTC
```
- **Why:** Review the past week's accomplishments
- **Contains:** 7-day summary, top performers, weekly goals

**2. Start of Week Motivation (Monday Morning)**
```yaml
- cron: '0 13 * * 1'  # Monday 8 AM CDT
```
- **Why:** Set goals for the upcoming week
- **Contains:** Last week's stats, weekly challenges

**3. Mid-Week Check-in (Wednesday)**
```yaml
- cron: '0 13 * * 3'  # Wednesday 8 AM CDT
```
- **Why:** Keep momentum going
- **Contains:** Current week progress, motivation

---

## ⚙️ Step-by-Step Setup Process

### Complete Setup in 5 Steps

**Step 1:** Choose your schedule
- Decide: What day and time?
- Convert to UTC using the formulas above

**Step 2:** Create the workflow file
```bash
cd /Users/mukeshravichandran/fitness-tracker
touch .github/workflows/weekly-digest.yml
```

**Step 3:** Copy the template above and customize:
- Change the cron schedule
- Update the API endpoint URL
- Adjust the workflow name

**Step 4:** Commit and push
```bash
git add .github/workflows/weekly-digest.yml
git commit -m "feat: Add weekly email digest workflow"
git push origin main
```

**Step 5:** Test manually
- Go to GitHub Actions
- Run the workflow manually
- Check the logs and your email

---

## 🎯 Quick Start Template

**Want weekly digest every Sunday at 9 AM CDT?**

Copy this entire file to `.github/workflows/weekly-digest.yml`:

```yaml
name: Send Weekly Email Digest

on:
  schedule:
    # Every Sunday at 9:00 AM CDT (14:00 UTC)
    - cron: '0 14 * * 0'
  workflow_dispatch:

jobs:
  send-weekly-digest:
    runs-on: ubuntu-latest
    steps:
      - name: Display Trigger Time
        run: |
          echo "📅 Weekly Digest triggered"
          echo "Time (CDT): $(TZ='America/Chicago' date)"
      
      - name: Send Weekly Digest
        run: |
          curl -X POST "https://fitness-tracker-flame-kappa.vercel.app/api/send-weekly-digest"
          echo "✅ Weekly digest sent!"
```

**Then run:**
```bash
git add .github/workflows/weekly-digest.yml
git commit -m "Add weekly digest workflow"
git push
```

**Done!** 🎉

---

## 📝 Important Reminders

> [!WARNING]
> **Daylight Saving Time**
> - On November 2, 2025, update all cron schedules
> - CDT → CST means add 1 hour to UTC time
> - Set calendar reminder for November 1!

> [!TIP]
> **Best Practices**
> - Always add `workflow_dispatch` for manual testing
> - Test with manual trigger before relying on schedule
> - Add detailed logging to debug timing issues
> - Document your schedule in comments

> [!NOTE]
> **GitHub Actions Limitations**
> - Cron jobs can be delayed 5-15 minutes
> - Must be on default branch (usually `main`)
> - Requires repository activity within 60 days
> - Free tier: 2,000 minutes/month (plenty for this!)

---

## 📞 Need Help?

**Tools to verify your cron:**
- [crontab.guru](https://crontab.guru) - Cron expression tester
- [crontab-generator.org](https://crontab-generator.org/) - Visual cron builder

**Questions to consider:**
1. What day of the week? (Sunday = 0, Monday = 1, etc.)
2. What time in your local timezone?
3. Are you in CDT or CST currently?
4. What should the email contain?

**Example calculation:**
```
Goal: Every Friday at 6:00 PM CDT
Step 1: Friday = 5
Step 2: 6:00 PM = 18:00 in 24-hour format
Step 3: CDT = UTC-5, so 18:00 - 5 = 23:00 UTC
Step 4: Cron = '0 23 * * 5'
```

---

**Happy scheduling!** 📅✉️
