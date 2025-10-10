# 🚀 Fittober Fitness Tracker - Deployment Guide

## Current Setup Status

### ✅ What's Working Locally:
- Backend server on `http://localhost:3001`
- Database (Supabase PostgreSQL)
- GitHub Gists polling
- API endpoints
- Frontend (when opened locally)

### ❌ What's NOT Working on GitHub Pages:
Your frontend on GitHub Pages **cannot** connect to `localhost:3001` because:
1. GitHub Pages hosts static files only (HTML/CSS/JS)
2. `localhost` refers to the visitor's computer, not your server
3. Your backend needs to be deployed to a public URL

## 🔧 Why Frontend Fails on GitHub Pages

When someone visits your GitHub Pages site:
```
https://pushpullleg.github.io/fitness-tracker/
```

The JavaScript tries to fetch from:
```
http://localhost:3001/aggregates.json
```

But `localhost:3001` doesn't exist on their computer - it only exists on YOUR computer!

## 🌐 Solution: Deploy Backend to Cloud

You need to deploy your backend to a cloud service so it has a public URL. Here are your options:

### Option 1: Render.com (Recommended - Free Tier)

1. **Sign up**: https://render.com/
2. **Create New Web Service**
3. **Connect GitHub repo**: `pushpullleg/fitness-tracker`
4. **Configuration**:
   - **Build Command**: `cd backend && npm install`
   - **Start Command**: `cd backend && node index.js`
   - **Environment Variables**: Add all from `.env` file:
     - `DATABASE_URL`
     - `TWILIO_SID`
     - `TWILIO_TOKEN`
     - `TWILIO_FROM`
     - `TWILIO_TO`
     - `PORT` = `3001`
     - `NODE_ENV` = `production`

5. **Deploy** - You'll get a URL like:
   ```
   https://fitness-tracker-xyz.onrender.com
   ```

6. **Update Frontend**: Edit `frontend/index.html` line 208:
   ```javascript
   const API_BASE_URL = window.location.origin.includes('github.io') 
       ? 'https://fitness-tracker-xyz.onrender.com'  // Your Render URL
       : 'http://localhost:3001';
   ```

### Option 2: Railway.app (Free Tier)

1. **Sign up**: https://railway.app/
2. **New Project** → **Deploy from GitHub repo**
3. **Select**: `pushpullleg/fitness-tracker`
4. **Add variables** from `.env`
5. **Deploy** - Get public URL
6. **Update frontend** with the URL

### Option 3: Heroku (Paid, but reliable)

1. **Sign up**: https://heroku.com/
2. **Create new app**
3. **Connect GitHub repo**
4. **Add buildpack**: Node.js
5. **Set environment variables**
6. **Deploy** - Get app URL like `https://your-app.herokuapp.com`
7. **Update frontend**

## 📝 After Deploying Backend

1. **Update `frontend/index.html`**:
   ```javascript
   const API_BASE_URL = window.location.origin.includes('github.io') 
       ? 'https://YOUR-BACKEND-URL.com'  // Replace with actual URL
       : 'http://localhost:3001';
   ```

2. **Test backend URL**:
   ```bash
   curl https://YOUR-BACKEND-URL.com/health
   curl https://YOUR-BACKEND-URL.com/aggregates.json
   ```

3. **Commit and push changes**:
   ```bash
   git add frontend/index.html
   git commit -m "Update API URL for production"
   git push origin main
   ```

4. **Visit GitHub Pages**:
   ```
   https://pushpullleg.github.io/fitness-tracker/frontend/
   ```

## 🐛 Common Issues

### Issue 1: Supabase Database Pauses
**Symptom**: Server crashes with "db_termination" error  
**Solution**: 
- Go to Supabase Dashboard
- Resume/Restore your project
- Consider upgrading to Pro plan ($25/month) for always-on database

### Issue 2: CORS Errors
**Symptom**: Frontend shows "blocked by CORS policy"  
**Solution**: Backend already has CORS enabled in `index.js` (line 196)

### Issue 3: Port 3001 Already in Use
**Symptom**: "Error: listen EADDRINUSE: address already in use"  
**Solution**:
```bash
# Find process using port 3001
lsof -i :3001
# Kill it
kill -9 <PID>
```

## 🏃 Running Locally

### Start Backend:
```bash
cd backend
node index.js
```

### Open Frontend:
```bash
open frontend/index.html
```

Or visit: `http://localhost:3001` (if backend serves static files)

## 📊 Current Data

Your fitness tracker is tracking 26 activities from 4 team members:
- Mukesh Ravichandran: 375 minutes
- Tejaswini Damodara Kannan: 285 minutes
- Jaahnavi Garikipati: 285 minutes
- Trisha Harjono: 210 minutes

**Total: 1,155 minutes of fitness activities! 🎉**

## 🔒 Security Note

**DO NOT** commit your `.env` file to GitHub! It contains:
- Database passwords
- Twilio authentication tokens

Always use environment variables in your deployment platform.

## 📞 Next Steps

1. Choose a deployment platform (Render recommended)
2. Deploy your backend
3. Get the public URL
4. Update `frontend/index.html` with the URL
5. Push changes to GitHub
6. Visit GitHub Pages - it should work!

Good luck! 🚀
