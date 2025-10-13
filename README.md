# ‍♂️ Fittober Fitness Tracker

A real-time fitness tracking dashboard for **The Excel-erators** team challenge (October 1-31, 2025). Track activities, visualize progress, and stay motivated with automated daily email digests!

[![Live Dashboard](https://img.shields.io/badge/Live-Dashboard-blue?style=for-the-badge)](https://pushpullleg.github.io/fitness-tracker/)
[![API Status](https://img.shields.io/badge/API-Online-success?style=for-the-badge)](https://fitness-tracker-flame-kappa.vercel.app/)

---

## 📚 Documentation

- **[Setup Guide](./SETUP.md)** - Complete installation and deployment instructions
- **[Email Setup](./EMAIL_SETUP.md)** - SendGrid configuration for daily digests
- **[Project Journey](./PROJECT_JOURNEY.md)** - What we tried, what worked, and lessons learned
- **[Contributing](./CONTRIBUTING.md)** - How to add screenshots, diagrams, and improvements

---

## 🌟 Overview

Fittober is a comprehensive fitness tracking system that:

---- **Polls 4 GitHub Gists** every 60 seconds for new fitness activities

- **Stores data** in PostgreSQL with smart deduplication

## 📊 Features- **Sends WhatsApp notifications** to team group for each new activity

- **Provides a beautiful dashboard** showing team progress with interactive charts

- **📈 Real-Time Dashboard**: Interactive doughnut chart showing team progress- **Handles real-time updates** with automatic refresh every minute

- **📧 Daily Email Digests**: Automated emails at 9 PM CST with embedded dashboard

- **🔄 Automatic Updates**: Polls GitHub Gists every 15 minutes for new activities## 🏗️ Architecture

- **📱 Mobile Responsive**: Beautiful UI on all devices

- **☁️ Serverless Architecture**: Zero-cost infrastructure on free tiers```

┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐

---│   GitHub Gists  │───▶│  Node.js Backend│───▶│  PostgreSQL DB  │

│   (4 sources)   │    │  (Express API)  │    │  (Activities)   │

## 🚀 Live Demo└─────────────────┘    └─────────────────┘    └─────────────────┘

                                │

**Dashboard:** https://pushpullleg.github.io/fitness-tracker/                                  ▼

**API:** https://fitness-tracker-flame-kappa.vercel.app/api/aggregates.json                       ┌─────────────────┐    ┌─────────────────┐

                       │  WhatsApp API   │    │  Frontend       │

---                       │  (Twilio)       │    │  (Chart.js)     │

                       └─────────────────┘    └─────────────────┘

## 👥 Team Members```



| Member | Total Minutes | Badge |## 📁 Project Structure

|--------|--------------|-------|

| Mukesh Ravichandran | 735 min | 🥇 |```

| Tejaswini Damodara Kannan | 345 min | 🥈 |fitness-tracker/

| Jaahnavi Garikipati | 285 min | 🥉 |├── backend/

| Trisha Harjono | 255 min | 📊 |│   ├── index.js              # Main server application

│   ├── package.json          # Node.js dependencies

**Team Total:** 1,620 minutes 💪│   ├── database.sql          # PostgreSQL schema

│   ├── env.example           # Environment variables template

---│   └── README.md             # Backend setup guide

├── frontend/

## 🏗️ Architecture│   ├── index.html            # Dashboard web page

│   └── README.md             # Frontend deployment guide

```└── README.md                 # This file

┌─────────────────┐```

│  GitHub Gists   │  (4 data sources - team members log activities)

│  (Raw Data)     │## 🚀 Quick Start

└────────┬────────┘

         │### Prerequisites

         ▼- Node.js 18+

┌─────────────────────────────────────────┐- PostgreSQL 12+

│  GitHub Actions (every 15 min)         │- Twilio Account

│  - Polls Gists                          │- GitHub account (for hosting frontend)

│  - Stores in Database                   │

│  - Triggers Email (9 PM CST)           │### 1. Backend Setup

└────────┬────────────────────────────────┘

         │```bash

         ▼cd backend

┌─────────────────┐     ┌──────────────────┐npm install

│  Backend API    │────▶│  Supabase        │cp env.example .env

│  (Vercel)       │     │  (PostgreSQL)    │# Edit .env with your database and Twilio credentials

│  Node.js/Express│     │  Session Mode    │npm start

└────────┬────────┘     └──────────────────┘```

         │

         ├──────────────────────┬─────────────────────┐### 2. Database Setup

         ▼                      ▼                     ▼

┌─────────────────┐   ┌──────────────────┐  ┌──────────────────┐```bash

│  Frontend       │   │  Email Digest    │  │  REST API        │# Create database and run schema

│  (GitHub Pages) │   │  (SendGrid)      │  │  /aggregates.json│psql -d your_database -f database.sql

│  Chart.js UI    │   │  Daily @ 9 PM    │  │  /health         │```

└─────────────────┘   └──────────────────┘  └──────────────────┘

```### 3. Frontend Deployment



---**Option A: GitHub Pages**

1. Upload `frontend/index.html` to a GitHub repository

## 🛠️ Tech Stack2. Enable GitHub Pages in repository settings

3. Update backend URL in the HTML file

### Frontend

- **HTML/CSS/JavaScript** - Static site**Option B: Local Development**

- **Chart.js 4.4.0** - Doughnut chart with data labels1. Open `frontend/index.html` in a web browser

- **GitHub Pages** - Free hosting2. Ensure backend is running on localhost:3000



### Backend## 📊 Features

- **Node.js 22.x** - Runtime

- **Express 4.18** - Web framework### Backend Features

- **PostgreSQL** - Database (via Supabase)- ✅ **Real-time Polling**: Fetches data from 4 GitHub Gists every 60 seconds

- **Vercel** - Serverless deployment- ✅ **Smart Deduplication**: Prevents duplicate entries using unique constraints

- ✅ **WhatsApp Integration**: Sends notifications via Twilio for each new activity

### Email & Automation- ✅ **RESTful API**: Provides `/aggregates.json` endpoint for frontend

- **SendGrid** - Email service (100 emails/day free tier)- ✅ **Error Handling**: Comprehensive error handling and logging

- **GitHub Actions** - Cron jobs (polling + email)- ✅ **Production Ready**: Environment-based configuration and graceful shutdown

- **QuickChart.io** - Chart embedding in emails

### Frontend Features

### Data Sources- ✅ **Interactive Charts**: Beautiful pie chart showing team member contributions

- **4 GitHub Gists** - Team members log activities manually- ✅ **Real-time Updates**: Auto-refreshes data every 60 seconds

- ✅ **Responsive Design**: Works on desktop, tablet, and mobile

---- ✅ **Modern UI**: Gradient design with smooth animations

- ✅ **Error Handling**: Graceful error states with retry functionality

## 📦 Project Structure

### Data Processing

```- ✅ **Member Name Normalization**: Consistent formatting across sources

fitness-tracker/- ✅ **Flexible Data Structure**: Handles different gist formats

├── .github/- ✅ **Cumulative Totals**: Accurate tracking of total minutes per member

│   └── workflows/- ✅ **Activity Logging**: Complete audit trail with timestamps

│       ├── poll-gists.yml        # Polls gists every 15 min

│       └── email-digest.yml      # Sends email daily at 9 PM CST## 📱 WhatsApp Notifications

├── api/

│   └── index.js                  # Vercel serverless entry pointEach new fitness activity triggers a WhatsApp message to the "Fittober" group:

├── backend/

│   ├── index.js                  # Main Express application```

│   ├── package.json              # Backend dependenciesJohn Doe completed 30 minutes of Running.

│   ├── database.sql              # PostgreSQL schemaJane Smith completed 45 minutes of Cycling.

│   ├── env.example               # Environment template```

│   └── test-email.js             # Email testing utility

├── index.html                    # Frontend dashboard### Setup Instructions

├── package.json                  # Root dependencies (for Vercel)1. Create Twilio account and enable WhatsApp Sandbox

├── vercel.json                   # Vercel configuration2. Create WhatsApp group named "Fittober"

├── SETUP.md                      # Complete setup guide3. Add Twilio sandbox number to the group

├── EMAIL_SETUP.md                # Detailed email guide4. Configure environment variables with your credentials

└── README.md                     # This file

```## 🎯 Data Sources



---The system polls these 4 GitHub Gists:

1. https://gist.github.com/pushpullleg/9c7ab834aa55e54fa70f61d501bf019d

## 🚀 Getting Started2. https://gist.github.com/pushpullleg/b2ff0075e1556c7b39d6f1bbc9860a90

3. https://gist.github.com/pushpullleg/b41a48c3557b59ad55d60c08a0bd2517

### Prerequisites4. https://gist.github.com/pushpullleg/5a8d4b337f4e2c5916559b193dc5b1c4

- Node.js 22.x

- GitHub account### Expected Data Format

- Free accounts: Vercel, Supabase, SendGrid```json

{

### Quick Setup  "logs": [

    {

1. **Clone the repository**      "id": "unique_id",

   ```bash      "timestamp": "2024-01-01T12:00:00.000Z",

   git clone https://github.com/pushpullleg/fitness-tracker.git      "member": "Member Name",

   cd fitness-tracker      "activity": "Running",

   ```      "duration": 30,

      "teamName": "Fittober"

2. **Install dependencies**    }

   ```bash  ]

   npm install}

   cd backend && npm install```

   ```

## 🛠️ Configuration

3. **Set up environment**

   ```bash### Environment Variables

   cd backend

   cp env.example .env**Backend (.env)**

   # Edit .env with your credentials```env

   ```DATABASE_URL=postgresql://user:pass@host:port/db

TWILIO_SID=your_twilio_account_sid

4. **Create database** (See `backend/database.sql`)TWILIO_TOKEN=your_twilio_auth_token

TWILIO_FROM=whatsapp:+14155238886

5. **Deploy to Vercel** (See `SETUP.md` for detailed guide)TWILIO_TO=whatsapp:+1234567890

PORT=3000

6. **Set up SendGrid** (See `EMAIL_SETUP.md`)NODE_ENV=production

```

For complete step-by-step instructions, see **[SETUP.md](./SETUP.md)**.

**Frontend (index.html)**

---```javascript

const API_BASE_URL = 'https://your-backend-url.herokuapp.com';

## 📡 API Endpoints```



### Public Endpoints## 🚀 Deployment Options



| Endpoint | Method | Description |### Backend Deployment

|----------|--------|-------------|

| `/` | GET | API information |**Heroku (Recommended)**

| `/health` | GET | Health check |```bash

| `/api/aggregates.json` | GET | Team statistics (real-time) |heroku create your-fittober-tracker

heroku addons:create heroku-postgresql:hobby-dev

### Email Endpointsheroku config:set DATABASE_URL=your_postgres_url

git push heroku main

| Endpoint | Method | Description |```

|----------|--------|-------------|

| `/api/send-digest` | GET | Send email to all 4 team members |**Google Cloud Run**

| `/api/test-digest` | GET | Send test email to one recipient |```bash

gcloud run deploy fittober-tracker --source . --platform managed

### Admin Endpoints```



| Endpoint | Method | Description |**Railway**

|----------|--------|-------------|- Connect GitHub repository

| `/poll` | GET | Manually trigger gist polling |- Set environment variables

- Auto-deploys on push

---

### Frontend Deployment

## 📧 Email Digest

**GitHub Pages**

**Schedule:** Daily at 9:00 PM CST (02:00 UTC)  - Upload HTML file to repository

**Recipients:** All 4 team members  - Enable Pages in settings

**Content:**- Access at `username.github.io/repo-name`

- Embedded dashboard chart

- Today's activities by member**Netlify**

- Overall team standings- Drag and drop HTML file

- Days remaining countdown- Instant deployment

- Custom domain support

---

## 📊 API Endpoints

## 🧪 Testing

### GET /health

### Test Backend LocallyHealth check endpoint

```bash```json

cd backend{

node index.js  "status": "healthy",

# Visit http://localhost:3000  "timestamp": "2024-01-01T12:00:00.000Z",

```  "gists": 4

}

### Test API Endpoints```

```bash

# Health check### GET /aggregates.json

curl https://fitness-tracker-flame-kappa.vercel.app/healthTeam fitness data

```json

# Get aggregates{

curl https://fitness-tracker-flame-kappa.vercel.app/api/aggregates.json  "members": [

    { "name": "John Doe", "total_min": 150 },

# Test email (to you only)    { "name": "Jane Smith", "total_min": 120 }

curl https://fitness-tracker-flame-kappa.vercel.app/api/test-digest  ],

```  "total_min": 270,

  "last_updated": "2024-01-01T12:00:00.000Z"

---}

```

## 🎨 Customization

## 🔧 Customization

### Change Email Design

Edit `backend/index.js` → `generateDigestEmail()` function### Adding New Gist Sources

1. Add URL to `GIST_URLS` array in `backend/index.js`

### Update Team Members2. Restart backend service

Edit GitHub Gist URLs in `backend/index.js` → `GIST_URLS` array3. New source will be polled automatically



### Change Email Schedule### Modifying Polling Frequency

Edit `.github/workflows/email-digest.yml` → cron expression```javascript

setInterval(pollAllGists, 60000); // Change 60000ms to desired interval

### Modify Dashboard Colors```

Edit `index.html` → Chart.js configuration

### Customizing Dashboard

---- Modify colors in `frontend/index.html`

- Change chart type (pie → doughnut, bar, etc.)

## 🐛 Troubleshooting- Add new statistics cards

- Customize refresh interval

### Dashboard shows "Loading..."

- Check API URL in `index.html`## 🧪 Testing

- Verify backend is deployed on Vercel

- Check browser console for CORS errors### Test WhatsApp Notifications

1. Add a test entry to one of the monitored gists

### Email not sending2. Wait for next polling cycle (up to 60 seconds)

- Verify SendGrid API key in Vercel env vars3. Check WhatsApp group for notification

- Check sender email is verified in SendGrid

- Ensure Vercel was redeployed after adding env vars### Test API Endpoints

```bash

### Database connection errors# Health check

- Use Session Mode connection string (port 5432)curl https://your-backend-url.herokuapp.com/health

- Verify `max: 1` in pool configuration

- Check connection string format# Get aggregates

curl https://your-backend-url.herokuapp.com/aggregates.json

See **[SETUP.md](./SETUP.md)** for detailed troubleshooting.```



---### Test Frontend

1. Open dashboard in browser

## 📊 Challenge Details2. Verify chart displays correctly

3. Test auto-refresh functionality

- **Event:** Fittober 20254. Check responsive design on mobile

- **Duration:** October 1-31, 2025 (31 days)

- **Team:** The Excel-erators (4 members)## 🚨 Troubleshooting

- **Location:** Texas A&M University Commerce

- **Goal:** Track and motivate team fitness activities### Common Issues



**Days Remaining:** 19 days (as of October 12, 2025)**Backend not receiving data**

- Check gist URLs are accessible

---- Verify data format matches expected structure

- Review console logs for errors

## 💰 Cost Breakdown

**WhatsApp notifications not sending**

| Service | Plan | Cost |- Verify Twilio credentials

|---------|------|------|- Check sandbox setup

| GitHub Pages | Free | $0 |- Ensure group number format is correct

| Vercel | Hobby | $0 |

| Supabase | Free Tier | $0 |**Frontend not loading data**

| SendGrid | Free (100/day) | $0 |- Verify backend URL is correct

| GitHub Actions | Free (2000 min/month) | $0 |- Check CORS settings

| **Total** | | **$0/month** |- Test API endpoint directly



---**Database connection issues**

- Verify DATABASE_URL format

## 🤝 Contributing- Check database accessibility

- Run database.sql schema

This is a private team project for Fittober 2025. If you'd like to use this for your own team:

## 📈 Monitoring

1. Fork the repository

2. Update team member names and gist URLs### Health Monitoring

3. Follow `SETUP.md` to deployMonitor `/health` endpoint to ensure service is running:

4. Customize email design and schedule```bash

curl https://your-backend-url.herokuapp.com/health

---```



## 📝 License### Log Monitoring

Backend provides comprehensive logging:

MIT License - feel free to use this for your own team challenges!- Polling status for each gist

- New activities detected

---- WhatsApp message delivery status

- Error details for debugging

## 🙏 Acknowledgments

## 🔒 Security

- **Texas A&M University Commerce** - For hosting the challenge

- **The Excel-erators Team** - For staying active and motivated!- Environment variables for all sensitive data

- **GitHub** - For free hosting and CI/CD- No hardcoded credentials

- **Vercel, Supabase, SendGrid** - For generous free tiers- CORS configuration for frontend access

- Input validation and error handling

---- HTTPS recommended for production



## 📞 Support## 📞 Support



- **Issues:** [GitHub Issues](https://github.com/pushpullleg/fitness-tracker/issues)For issues or questions:

- **Setup Help:** See `SETUP.md`1. Check the troubleshooting section

- **Email Configuration:** See `EMAIL_SETUP.md`2. Review backend and frontend README files

3. Verify all configuration is correct

---4. Test individual components



## 🎯 Future Improvements

Want to see what we tried and what didn't work? Check out **[PROJECT_JOURNEY.md](./PROJECT_JOURNEY.md)** for:
- 🚫 Features we attempted (SMS/WhatsApp challenges)
- 💡 Future enhancement ideas (Activity streaks, Personal bests, Weekly summaries)
- 📊 Technical debt and optimization opportunities
- 🎓 Lessons learned and recommendations for next challenge

**High-Priority Ideas:**
- [ ] Activity type icons/emojis in emails 🏃‍♂️
- [ ] Personal bests tracking 🏆
- [ ] Weekly summary emails 📊
- [ ] Activity streak counter 🔥
- [ ] CSV export for analysis 📥

See the full roadmap in [PROJECT_JOURNEY.md](./PROJECT_JOURNEY.md)!

---

## 🤝 Contributing

Want to improve the project? Check out **[CONTRIBUTING.md](./CONTRIBUTING.md)** for guides on:
- 📸 Adding screenshots and demo GIFs
- 🎨 Creating architecture diagrams
- 🏷️ Adding badges and visual enhancements
- 📊 Implementing new charts and visualizations
- 🧪 Writing tests
- 📝 Improving documentation

---

## 📄 License

MIT License - feel free to use and modify for your team's needs.

---

**Made with ❤️ by The Excel-erators** | October 2025

*Track, notify, and visualize your team's fitness journey in real-time!*
