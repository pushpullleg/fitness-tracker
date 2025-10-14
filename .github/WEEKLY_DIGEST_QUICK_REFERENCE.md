# ⏰ Weekly Digest Quick Reference Card

## 🎯 Most Common Schedules

### Every Sunday at 9:00 AM CDT
```yaml
- cron: '0 14 * * 0'
```

### Every Monday at 8:00 AM CDT  
```yaml
- cron: '0 13 * * 1'
```

### Every Friday at 5:00 PM CDT
```yaml
- cron: '0 22 * * 5'
```

---

## 📐 Conversion Formulas

### CDT (March - November)
```
Your Time - 5 hours = UTC
Example: 9 AM - 5 = 4 AM UTC → 0 4 * * *
Example: 2 PM - 5 = 9 AM UTC → 0 9 * * *
Example: 5 PM - 5 = 10 PM UTC → 0 22 * * *
```

### CST (November - March)
```
Your Time - 6 hours = UTC
Example: 9 AM - 6 = 3 AM UTC → 0 3 * * *
Example: 2 PM - 6 = 8 AM UTC → 0 8 * * *
Example: 5 PM - 6 = 11 AM UTC → 0 11 * * *
```

---

## 📅 Day Numbers

| Day | Number |
|-----|--------|
| Sunday | 0 or 7 |
| Monday | 1 |
| Tuesday | 2 |
| Wednesday | 3 |
| Thursday | 4 |
| Friday | 5 |
| Saturday | 6 |

---

## 🔧 Cron Syntax

```
 ┌─ minute (0-59)
 │  ┌─ hour (0-23)
 │  │  ┌─ day of month (1-31)
 │  │  │  ┌─ month (1-12)
 │  │  │  │  ┌─ day of week (0-7)
 │  │  │  │  │
 *  *  *  *  *
```

### Examples:
- `0 14 * * 0` = Every Sunday at 2 PM UTC (9 AM CDT)
- `0 13 * * 1` = Every Monday at 1 PM UTC (8 AM CDT)
- `0 22 * * 5` = Every Friday at 10 PM UTC (5 PM CDT)
- `0 14 * * 1,5` = Every Monday & Friday at 9 AM CDT
- `0 13 * * 1-5` = Weekdays (Mon-Fri) at 8 AM CDT

---

## 🚀 Quick Setup Steps

1. **Edit the file:**
   ```bash
   code .github/workflows/weekly-digest.yml
   ```

2. **Change the cron line:**
   ```yaml
   - cron: '0 14 * * 0'  # ← Change this!
   ```

3. **Commit and push:**
   ```bash
   git add .github/workflows/weekly-digest.yml
   git commit -m "Configure weekly digest schedule"
   git push
   ```

4. **Test manually:**
   - Go to GitHub → Actions → "Send Weekly Email Digest"
   - Click "Run workflow"

---

## 🧮 Time Calculator

**Want weekly digest at YOUR specific time?**

1. Choose day: _____ (0=Sun, 1=Mon, ..., 6=Sat)
2. Choose time: ___:___ AM/PM CDT
3. Convert to 24-hour: _____ (e.g., 2 PM = 14)
4. Subtract 5 (CDT): _____ (this is your UTC hour)
5. Your cron: `0 [step4] * * [step1]`

**Example:**
- Friday at 6:00 PM CDT
- 6:00 PM = 18 in 24-hour
- 18 - 5 = 13 UTC
- Friday = 5
- **Cron:** `0 13 * * 5`

---

## ⚠️ Important Reminders

✅ GitHub Actions runs in **UTC timezone**  
✅ Always test with manual trigger first  
✅ Can be delayed 5-15 minutes  
✅ Must be on `main` branch  
⚠️ Update cron when DST ends (Nov 2, 2025)

---

## 🔗 Useful Links

- [crontab.guru](https://crontab.guru) - Test cron expressions
- [Time Converter](https://www.timeanddate.com/worldclock/converter.html)
- [Full Guide](./WEEKLY_DIGEST_GUIDE.md) - Complete documentation

---

**Print this and keep handy!** 📋
