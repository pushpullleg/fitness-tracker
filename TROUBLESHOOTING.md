# Troubleshooting Guide

## Current Status (October 20, 2025)

### ✅ What's Working:
1. **API Endpoints**:
   - `/api/health` → Returns 200 ✅
   - `/api/refresh` → Returns 200 ✅
   - `/api/aggregates.json` → Returns 200 ✅
   - Root `/` → Serves frontend ✅

2. **Backend**:
   - Deployed successfully on Vercel ✅
   - Database connection working ✅
   - All 4 GitHub Gists accessible ✅

### 🔍 Testing Commands

To verify everything is working, run these commands:

```bash
# Test API health
curl -s https://fitness-tracker-flame-kappa.vercel.app/api/health

# Expected output:
# {"status":"healthy","timestamp":"2025-10-20T09:34:02.521Z","gists":4}

# Test refresh endpoint
curl -s https://fitness-tracker-flame-kappa.vercel.app/api/refresh

# Expected output:
# {"success":true,"message":"Data refreshed successfully","timestamp":"..."}

# Test aggregates
curl -s https://fitness-tracker-flame-kappa.vercel.app/api/aggregates.json

# Expected output:
# {"members":[...],"total_min":"4215","last_updated":"..."}
```

### 📊 Check GitHub Actions Workflow

1. Go to: https://github.com/pushpullleg/fitness-tracker/actions
2. Click on "Auto Refresh Fitness Data"
3. Look at the most recent run

**Common issues:**

#### Issue 1: Workflow says "failing" but API works
- **Cause**: The workflow step might be failing on the `jq` command or health check
- **Solution**: Fixed in commit `4f6f835` - removed `jq` dependency

#### Issue 2: Deployment says "failed"
- **Cause**: Vercel might be caching old code
- **Solution**: 
  ```bash
  # Force redeploy by making a small change
  cd /Users/mukeshravichandran/fitness-tracker
  git commit --allow-empty -m "Trigger Vercel redeploy"
  git push origin main
  ```

#### Issue 3: GitHub Actions not running every 15 minutes
- **Cause**: Cron schedule might be disabled
- **Solution**: Manually trigger it once from GitHub Actions UI, then it should auto-run

### 🔧 Manual Workflow Test

Run this in your terminal to simulate what GitHub Actions does:

```bash
cd /Users/mukeshravichandran/fitness-tracker

echo "⏰ Starting automatic data refresh at $(TZ='America/Chicago' date '+%Y-%m-%d %I:%M:%S %p %Z')"

# Call the refresh endpoint
response=$(curl -s -w "\n%{http_code}" https://fitness-tracker-flame-kappa.vercel.app/api/refresh)

# Extract HTTP status code (last line)
http_code=$(echo "$response" | tail -n1)

# Extract response body (everything except last line)
body=$(echo "$response" | sed '$d')

echo "📡 Response Code: $http_code"
echo "📄 Response Body: $body"

# Check if successful
if [ "$http_code" -eq 200 ]; then
  echo "✅ Successfully refreshed fitness data!"
else
  echo "⚠️  Refresh endpoint returned HTTP $http_code"
fi

echo "🔍 Checking API health..."
curl -s https://fitness-tracker-flame-kappa.vercel.app/api/health
echo ""
echo "✅ Health check complete"
```

### 📝 What to Check If Still Failing

1. **Check Vercel Deployment Status**:
   - Go to: https://vercel.com/dashboard
   - Find your `fitness-tracker` project
   - Check the "Deployments" tab
   - Look for any failed deployments

2. **Check Vercel Environment Variables**:
   - Make sure these are set:
     - `DATABASE_URL` (Supabase connection string)
     - `SENDGRID_API_KEY` (for email)
     - `NODE_ENV` (optional)

3. **Check Vercel Function Logs**:
   - Go to Vercel Dashboard → fitness-tracker → Logs
   - Filter by "Functions"
   - Look for any errors in `/api/refresh`

4. **Check GitHub Actions Permissions**:
   - Go to: https://github.com/pushpullleg/fitness-tracker/settings/actions
   - Make sure "Allow all actions and reusable workflows" is enabled

### 🎯 Next Steps

**If you see specific errors**, please share:
1. The exact error message from GitHub Actions
2. The exact error message from Vercel deployment
3. Screenshot of the failing step

Then I can provide a targeted fix!

### 📞 Quick Health Check

Run this one-liner to check everything:

```bash
echo "API Health:" && curl -s https://fitness-tracker-flame-kappa.vercel.app/api/health && echo -e "\n\nRefresh Test:" && curl -s https://fitness-tracker-flame-kappa.vercel.app/api/refresh && echo -e "\n\nData Check:" && curl -s https://fitness-tracker-flame-kappa.vercel.app/api/aggregates.json | grep -o '"total_min":"[0-9]*"'
```

Expected output should show:
- ✅ Healthy status
- ✅ Successful refresh
- ✅ Total minutes count

---

**Last Updated**: October 20, 2025  
**Status**: All API endpoints functional, workflows fixed
