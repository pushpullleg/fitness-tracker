<div align="center"># ‍♂️ Fittober Fitness Tracker



# Fitness TrackerA real-time fitness tracking dashboard for **The Excel-erators** team challenge (October 1-31, 2025). Track activities, visualize progress, and stay motivated with automated daily email digests!



**A serverless fitness tracking system for the Fittober 2025 challenge**[![Live Dashboard](https://img.shields.io/badge/Live-Dashboard-blue?style=for-the-badge)](https://pushpullleg.github.io/fitness-tracker/)

[![API Status](https://img.shields.io/badge/API-Online-success?style=for-the-badge)](https://fitness-tracker-flame-kappa.vercel.app/)

[![Live Dashboard](https://img.shields.io/badge/Live-Dashboard-brightgreen?style=flat-square)](https://pushpullleg.github.io/fitness-tracker)

[![API Status](https://img.shields.io/badge/API-Online-success?style=flat-square)](https://fitness-tracker-flame-kappa.vercel.app)---

[![Node Version](https://img.shields.io/badge/Node.js-22.x-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org)

[![License](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)](LICENSE)## 📚 Documentation



[Overview](#overview) • [Features](#features) • [Getting Started](#getting-started) • [Architecture](#architecture) • [API](#api-reference) • [Deployment](#deployment)- **[Setup Guide](./SETUP.md)** - Complete installation and deployment instructions

- **[Email Setup](./EMAIL_SETUP.md)** - SendGrid configuration for daily digests

![Dashboard Preview](https://via.placeholder.com/800x400/4CAF50/FFFFFF?text=Fitness+Tracker+Dashboard)- **[Project Journey](./PROJECT_JOURNEY.md)** - What we tried, what worked, and lessons learned

- **[Contributing](./CONTRIBUTING.md)** - How to add screenshots, diagrams, and improvements

</div>

---

---

## 🌟 Overview

## Overview

Fittober is a comprehensive fitness tracking system that:

Fitness Tracker is a comprehensive activity monitoring system built for the **Fittober 2025 challenge** at Texas A&M University Commerce. The application combines real-time data visualization, automated email digests, and team leaderboards to encourage daily fitness activities throughout October 2025.

---- **Polls 4 GitHub Gists** every 60 seconds for new fitness activities

The system automatically collects activity data from GitHub Gists, processes it through a serverless backend, stores it in PostgreSQL, and provides an interactive dashboard with daily email summaries sent at 2 PM CST.

- **Stores data** in PostgreSQL with smart deduplication

> [!TIP]

> You can view the live dashboard at [pushpullleg.github.io/fitness-tracker](https://pushpullleg.github.io/fitness-tracker) to see real-time activity tracking in action.## 📊 Features- **Sends WhatsApp notifications** to team group for each new activity



### Key Highlights- **Provides a beautiful dashboard** showing team progress with interactive charts



- **Serverless Architecture**: Fully hosted on Vercel Functions and GitHub Pages with zero infrastructure management- **📈 Real-Time Dashboard**: Interactive doughnut chart showing team progress- **Handles real-time updates** with automatic refresh every minute

- **Real-time Synchronization**: Activity data updates every 15 minutes via GitHub Actions

- **Daily Email Digests**: Automated summaries with embedded charts using SendGrid (free tier: 100 emails/day)- **📧 Daily Email Digests**: Automated emails at 2 PM CST with embedded dashboard

- **PostgreSQL Database**: Reliable data storage on Supabase with optimized connection pooling for serverless environments

- **Team Challenge**: Tracks 4 team members competing in the month-long Fittober challenge- **🔄 Automatic Updates**: Polls GitHub Gists every 15 minutes for new activities## 🏗️ Architecture



## Features- **📱 Mobile Responsive**: Beautiful UI on all devices



### Core Functionality- **☁️ Serverless Architecture**: Zero-cost infrastructure on free tiers```



- **Activity Tracking**: Automatic data collection from 4 GitHub Gists with 15-minute polling intervals┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐

- **Interactive Dashboard**: Real-time visualization using Chart.js 4.4.0 with doughnut charts showing activity distribution

- **Team Leaderboard**: Live rankings displaying total minutes and member standings---│   GitHub Gists  │───▶│  Node.js Backend│───▶│  PostgreSQL DB  │

- **Daily Email Digests**: Automated reports at 2 PM CST (20:00 UTC) with:

  - Last 24 hours activity summary│   (4 sources)   │    │  (Express API)  │    │  (Activities)   │

  - Individual member breakdowns

  - Embedded QuickChart.io visualizations## 🚀 Live Demo└─────────────────┘    └─────────────────┘    └─────────────────┘

  - Timezone-aware timestamps (CST)

- **RESTful API**: Complete endpoints for activity management and email testing                                │



### Technical Capabilities**Dashboard:** https://pushpullleg.github.io/fitness-tracker/                                  ▼



- **Serverless Deployment**: Optimized for Vercel Functions with 1-connection PostgreSQL pool**API:** https://fitness-tracker-flame-kappa.vercel.app/api/aggregates.json                       ┌─────────────────┐    ┌─────────────────┐

- **Automated Workflows**: GitHub Actions for data polling and scheduled email delivery

- **Responsive Design**: Mobile-friendly interface accessible from any device                       │  WhatsApp API   │    │  Frontend       │

- **Error Handling**: Comprehensive logging and graceful degradation for failed operations

- **Email Rate Limiting**: Compatible with SendGrid free tier (100 emails/day)---                       │  (Twilio)       │    │  (Chart.js)     │



## Getting Started                       └─────────────────┘    └─────────────────┘



### Prerequisites## 👥 Team Members```



Before you begin, ensure you have the following accounts and tools:



- **Node.js** 22.x or higher ([download](https://nodejs.org))| Member | Total Minutes | Badge |## 📁 Project Structure

- **GitHub** account with repository access

- **Vercel** account for backend deployment ([sign up](https://vercel.com))|--------|--------------|-------|

- **Supabase** account for PostgreSQL database ([sign up](https://supabase.com))

- **SendGrid** account with API key ([sign up](https://sendgrid.com) - free tier available)| Mukesh Ravichandran | 735 min | 🥇 |```

- **4 GitHub Gists** containing activity log data

| Tejaswini Damodara Kannan | 345 min | 🥈 |fitness-tracker/

### Quick Start

| Jaahnavi Garikipati | 285 min | 🥉 |├── backend/

1. **Clone the repository**

| Trisha Harjono | 255 min | 📊 |│   ├── index.js              # Main server application

   ```bash

   git clone https://github.com/pushpullleg/fitness-tracker.git│   ├── package.json          # Node.js dependencies

   cd fitness-tracker

   ```**Team Total:** 1,620 minutes 💪│   ├── database.sql          # PostgreSQL schema



2. **Set up the database**│   ├── env.example           # Environment variables template



   Create a Supabase project and execute the schema:---│   └── README.md             # Backend setup guide



   ```bash├── frontend/

   # Copy the schema from backend/database.sql to Supabase SQL Editor

   # Run the queries to create the activities table## 🏗️ Architecture│   ├── index.html            # Dashboard web page

   ```

│   └── README.md             # Frontend deployment guide

3. **Configure environment variables**

```└── README.md                 # This file

   ```bash

   cd backend┌─────────────────┐```

   cp env.example .env

   ```│  GitHub Gists   │  (4 data sources - team members log activities)



   Edit `.env` with your credentials:│  (Raw Data)     │## 🚀 Quick Start



   ```env└────────┬────────┘

   DATABASE_URL=postgresql://user:pass@host:5432/database

   SENDGRID_API_KEY=your_sendgrid_api_key         │### Prerequisites

   GIST_URL_MUKESH=https://gist.githubusercontent.com/...

   GIST_URL_TEJASWINI=https://gist.githubusercontent.com/...         ▼- Node.js 18+

   GIST_URL_JAAHNAVI=https://gist.githubusercontent.com/...

   GIST_URL_TRISHA=https://gist.githubusercontent.com/...┌─────────────────────────────────────────┐- PostgreSQL 12+

   ```

│  GitHub Actions (every 15 min)         │- Twilio Account

4. **Install dependencies and start**

│  - Polls Gists                          │- GitHub account (for hosting frontend)

   ```bash

   npm install│  - Stores in Database                   │

   npm start

   ```│  - Triggers Email (2 PM CST)           │### 1. Backend Setup



   The API will be available at `http://localhost:3000`└────────┬────────────────────────────────┘



> [!NOTE]         │```bash

> For complete setup instructions including Vercel deployment, GitHub Actions configuration, and SendGrid email setup, see the [SETUP.md](./SETUP.md) guide.

         ▼cd backend

## Architecture

┌─────────────────┐     ┌──────────────────┐npm install

### System Design

│  Backend API    │────▶│  Supabase        │cp env.example .env

The application follows a serverless architecture with clear separation of concerns:

│  (Vercel)       │     │  (PostgreSQL)    │# Edit .env with your database and Twilio credentials

```

┌─────────────────────────────────────────────────────────────┐│  Node.js/Express│     │  Session Mode    │npm start

│                   Fitness Tracker System                     │

├─────────────────────────────────────────────────────────────┤└────────┬────────┘     └──────────────────┘```

│                                                               │

│  ┌──────────────┐         ┌──────────────┐                  │         │

│  │   Frontend   │◄────────┤   Backend    │                  │

│  │  (GitHub     │  HTTPS  │   (Vercel    │                  │         ├──────────────────────┬─────────────────────┐### 2. Database Setup

│  │   Pages)     │         │  Functions)  │                  │

│  └──────────────┘         └──────┬───────┘                  │         ▼                      ▼                     ▼

│                                   │ PostgreSQL               │

│                           ┌───────▼───────┐                  │┌─────────────────┐   ┌──────────────────┐  ┌──────────────────┐```bash

│                           │   Supabase    │                  │

│                           │  (Session     │                  ││  Frontend       │   │  Email Digest    │  │  REST API        │# Create database and run schema

│                           │   Mode)       │                  │

│                           └───────────────┘                  ││  (GitHub Pages) │   │  (SendGrid)      │  │  /aggregates.json│psql -d your_database -f database.sql

│                                                               │

│  ┌──────────────┐         ┌──────────────┐                  ││  Chart.js UI    │   │  Daily @ 9 PM    │  │  /health         │```

│  │   GitHub     │────────►│   SendGrid   │                  │

│  │   Actions    │  Cron   │    Email     │                  │└─────────────────┘   └──────────────────┘  └──────────────────┘

│  │  (Scheduler) │         │   Service    │                  │

│  └──────────────┘         └──────────────┘                  │```### 3. Frontend Deployment

│                                                               │

│  ┌──────────────┐                                            │

│  │   GitHub     │────────► Data Source (4 Gists)            │

│  │    Gists     │                                            │---**Option A: GitHub Pages**

│  └──────────────┘                                            │

│                                                               │1. Upload `frontend/index.html` to a GitHub repository

└─────────────────────────────────────────────────────────────┘

```## 🛠️ Tech Stack2. Enable GitHub Pages in repository settings



### Data Flow3. Update backend URL in the HTML file



1. **Data Collection**: Team members log activities in individual GitHub Gists (plain text format)### Frontend

2. **Automated Polling**: GitHub Actions workflow runs every 15 minutes to trigger `/api/poll-activities`

3. **Data Processing**: Backend fetches Gists via `axios`, normalizes member names, parses activity logs- **HTML/CSS/JavaScript** - Static site**Option B: Local Development**

4. **Database Storage**: Processed activities stored in Supabase PostgreSQL with timestamps and metadata

5. **Visualization**: Frontend queries `/api/activities` and renders charts using Chart.js- **Chart.js 4.4.0** - Doughnut chart with data labels1. Open `frontend/index.html` in a web browser

6. **Email Digest**: Daily workflow at 2 PM CST calls `/api/send-digest` to generate emails with QuickChart.io embedded charts

- **GitHub Pages** - Free hosting2. Ensure backend is running on localhost:3000

### Technology Stack



**Frontend**

- HTML5, CSS3, JavaScript (ES6+)### Backend## 📊 Features

- Chart.js 4.4.0 for interactive visualizations

- GitHub Pages for static hosting- **Node.js 22.x** - Runtime



**Backend**- **Express 4.18** - Web framework### Backend Features

- Node.js 22.x with Express.js framework

- PostgreSQL via `pg` library (Session Mode connection)- **PostgreSQL** - Database (via Supabase)- ✅ **Real-time Polling**: Fetches data from 4 GitHub Gists every 60 seconds

- SendGrid `@sendgrid/mail` ^7.7.0 for email delivery

- Vercel serverless functions with optimized connection pooling- **Vercel** - Serverless deployment- ✅ **Smart Deduplication**: Prevents duplicate entries using unique constraints



**DevOps & Automation**- ✅ **WhatsApp Integration**: Sends notifications via Twilio for each new activity

- GitHub Actions for cron-based scheduling

- Vercel for continuous deployment### Email & Automation- ✅ **RESTful API**: Provides `/aggregates.json` endpoint for frontend

- QuickChart.io API for email chart rendering

- **SendGrid** - Email service (100 emails/day free tier)- ✅ **Error Handling**: Comprehensive error handling and logging

**Dependencies**

```json- **GitHub Actions** - Cron jobs (polling + email)- ✅ **Production Ready**: Environment-based configuration and graceful shutdown

{

  "@sendgrid/mail": "^7.7.0",- **QuickChart.io** - Chart embedding in emails

  "axios": "^1.6.0",

  "dotenv": "^16.3.1",### Frontend Features

  "express": "^4.18.2",

  "pg": "^8.11.3"### Data Sources- ✅ **Interactive Charts**: Beautiful pie chart showing team member contributions

}

```- **4 GitHub Gists** - Team members log activities manually- ✅ **Real-time Updates**: Auto-refreshes data every 60 seconds



## API Reference- ✅ **Responsive Design**: Works on desktop, tablet, and mobile



### Base URL---- ✅ **Modern UI**: Gradient design with smooth animations



**Production**: `https://fitness-tracker-flame-kappa.vercel.app`  - ✅ **Error Handling**: Graceful error states with retry functionality

**Development**: `http://localhost:3000`

## 📦 Project Structure

### Endpoints

### Data Processing

#### Health Check

```- ✅ **Member Name Normalization**: Consistent formatting across sources

```http

GET /fitness-tracker/- ✅ **Flexible Data Structure**: Handles different gist formats

```

├── .github/- ✅ **Cumulative Totals**: Accurate tracking of total minutes per member

Returns API status and basic information.

│   └── workflows/- ✅ **Activity Logging**: Complete audit trail with timestamps

**Response**

```json│       ├── poll-gists.yml        # Polls gists every 15 min

{

  "message": "Fitness Tracker API",│       └── email-digest.yml      # Sends email daily at 2 PM CST## 📱 WhatsApp Notifications

  "status": "healthy",

  "timestamp": "2025-01-28T14:00:00.000Z"├── api/

}

```│   └── index.js                  # Vercel serverless entry pointEach new fitness activity triggers a WhatsApp message to the "Fittober" group:



#### Get All Activities├── backend/



```http│   ├── index.js                  # Main Express application```

GET /api/activities

```│   ├── package.json              # Backend dependenciesJohn Doe completed 30 minutes of Running.



Retrieves all activities from the database, ordered by timestamp (most recent first).│   ├── database.sql              # PostgreSQL schemaJane Smith completed 45 minutes of Cycling.



**Response**│   ├── env.example               # Environment template```

```json

[│   └── test-email.js             # Email testing utility

  {

    "id": 123,├── index.html                    # Frontend dashboard### Setup Instructions

    "member_name": "Mukesh",

    "activity_type": "Running",├── package.json                  # Root dependencies (for Vercel)1. Create Twilio account and enable WhatsApp Sandbox

    "duration_minutes": 45,

    "activity_date": "2025-01-28T19:47:00.000Z",├── vercel.json                   # Vercel configuration2. Create WhatsApp group named "Fittober"

    "created_at": "2025-01-28T19:50:00.000Z"

  }├── SETUP.md                      # Complete setup guide3. Add Twilio sandbox number to the group

]

```├── EMAIL_SETUP.md                # Detailed email guide4. Configure environment variables with your credentials



#### Get Leaderboard└── README.md                     # This file



```http```## 🎯 Data Sources

GET /api/leaderboard

```



Returns team rankings with total minutes per member.---The system polls these 4 GitHub Gists:



**Response**1. https://gist.github.com/pushpullleg/9c7ab834aa55e54fa70f61d501bf019d

```json

[## 🚀 Getting Started2. https://gist.github.com/pushpullleg/b2ff0075e1556c7b39d6f1bbc9860a90

  {

    "member_name": "Mukesh",3. https://gist.github.com/pushpullleg/b41a48c3557b59ad55d60c08a0bd2517

    "total_minutes": 735,

    "activity_count": 42### Prerequisites4. https://gist.github.com/pushpullleg/5a8d4b337f4e2c5916559b193dc5b1c4

  },

  {- Node.js 22.x

    "member_name": "Tejaswini",

    "total_minutes": 345,- GitHub account### Expected Data Format

    "activity_count": 28

  }- Free accounts: Vercel, Supabase, SendGrid```json

]

```{



#### Poll Activities### Quick Setup  "logs": [



```http    {

POST /api/poll-activities

```1. **Clone the repository**      "id": "unique_id",



Manually triggers data collection from all GitHub Gists. Automatically called by GitHub Actions every 15 minutes.   ```bash      "timestamp": "2024-01-01T12:00:00.000Z",



**Response**   git clone https://github.com/pushpullleg/fitness-tracker.git      "member": "Member Name",

```json

{   cd fitness-tracker      "activity": "Running",

  "message": "Activities polled successfully",

  "newActivities": 3   ```      "duration": 30,

}

```      "teamName": "Fittober"



#### Test Email Digest2. **Install dependencies**    }



```http   ```bash  ]

POST /api/test-digest

```   npm install}



Sends a test email digest to verify SendGrid configuration and email templates.   cd backend && npm install```



**Response**   ```

```json

{## 🛠️ Configuration

  "message": "Test email sent successfully",

  "timestamp": "2025-01-28T20:00:00.000Z"3. **Set up environment**

}

```   ```bash### Environment Variables



#### Send Daily Digest   cd backend



```http   cp env.example .env**Backend (.env)**

POST /api/send-digest

```   # Edit .env with your credentials```env



Generates and sends daily digest emails to all team members. Automatically triggered by GitHub Actions at 2 PM CST (20:00 UTC).   ```DATABASE_URL=postgresql://user:pass@host:port/db



**Response**TWILIO_SID=your_twilio_account_sid

```json

{4. **Create database** (See `backend/database.sql`)TWILIO_TOKEN=your_twilio_auth_token

  "message": "Daily digest sent to all members",

  "emailsSent": 4TWILIO_FROM=whatsapp:+14155238886

}

```5. **Deploy to Vercel** (See `SETUP.md` for detailed guide)TWILIO_TO=whatsapp:+1234567890



> [!WARNING]PORT=3000

> The `/api/send-digest` endpoint should only be called once per day to avoid exceeding SendGrid's free tier limit of 100 emails/day.

6. **Set up SendGrid** (See `EMAIL_SETUP.md`)NODE_ENV=production

## Deployment

```

### Backend Deployment (Vercel)

For complete step-by-step instructions, see **[SETUP.md](./SETUP.md)**.

1. **Install Vercel CLI**

**Frontend (index.html)**

   ```bash

   npm install -g vercel---```javascript

   ```

const API_BASE_URL = 'https://your-backend-url.herokuapp.com';

2. **Deploy to Vercel**

## 📡 API Endpoints```

   ```bash

   cd backend

   vercel --prod

   ```### Public Endpoints## 🚀 Deployment Options



3. **Set environment variables** in Vercel dashboard:

   - `DATABASE_URL`

   - `SENDGRID_API_KEY`| Endpoint | Method | Description |### Backend Deployment

   - `GIST_URL_MUKESH`

   - `GIST_URL_TEJASWINI`|----------|--------|-------------|

   - `GIST_URL_JAAHNAVI`

   - `GIST_URL_TRISHA`| `/` | GET | API information |**Heroku (Recommended)**



### Frontend Deployment (GitHub Pages)| `/health` | GET | Health check |```bash



1. **Enable GitHub Pages** in repository settings| `/api/aggregates.json` | GET | Team statistics (real-time) |heroku create your-fittober-tracker

2. Select `main` branch and root directory as source

3. The dashboard will be available at `https://<username>.github.io/<repository>`heroku addons:create heroku-postgresql:hobby-dev



### GitHub Actions Configuration### Email Endpointsheroku config:set DATABASE_URL=your_postgres_url



Two automated workflows are configured:git push heroku main



**Data Polling** (`.github/workflows/poll-activities.yml`)| Endpoint | Method | Description |```

```yaml

schedule:|----------|--------|-------------|

  - cron: '*/15 * * * *'  # Every 15 minutes

```| `/api/send-digest` | GET | Send email to all 4 team members |**Google Cloud Run**



**Daily Email Digest** (`.github/workflows/email-digest.yml`)| `/api/test-digest` | GET | Send test email to one recipient |```bash

```yaml

schedule:gcloud run deploy fittober-tracker --source . --platform managed

  - cron: '0 20 * * *'  # 2 PM CST (20:00 UTC)

```### Admin Endpoints```



> [!IMPORTANT]

> You must add `VERCEL_API_URL` as a GitHub repository secret for workflows to function correctly.

| Endpoint | Method | Description |**Railway**

## Documentation

|----------|--------|-------------|- Connect GitHub repository

- **[SETUP.md](./SETUP.md)** - Complete deployment guide with step-by-step instructions

- **[EMAIL_SETUP.md](./EMAIL_SETUP.md)** - SendGrid configuration and email template customization| `/poll` | GET | Manually trigger gist polling |- Set environment variables

- **[PROJECT_JOURNEY.md](./PROJECT_JOURNEY.md)** - Development history, challenges faced, and lessons learned

- **[CONTRIBUTING.md](./CONTRIBUTING.md)** - Guidelines for adding features, screenshots, and documentation- Auto-deploys on push



## Troubleshooting---



### Common Issues### Frontend Deployment



**Database Connection Errors**## 📧 Email Digest

- Ensure Supabase connection string uses Session Mode (port 5432, not 6543)

- Verify `max: 1` and `allowExitOnIdle: true` in PostgreSQL pool configuration**GitHub Pages**



**Email Not Sending****Schedule:** Daily at 9:00 PM CST (02:00 UTC)  - Upload HTML file to repository

- Check SendGrid API key validity

- Verify sender email is authenticated in SendGrid dashboard**Recipients:** All 4 team members  - Enable Pages in settings

- Confirm you haven't exceeded 100 emails/day free tier limit

**Content:**- Access at `username.github.io/repo-name`

**GitHub Actions Failing**

- Verify `VERCEL_API_URL` secret is set correctly- Embedded dashboard chart

- Check workflow logs in Actions tab for specific error messages

- Today's activities by member**Netlify**

**Timestamp Display Issues**

- Email times are displayed in CST timezone (`America/Chicago`)- Overall team standings- Drag and drop HTML file

- "Last 24 Hours" represents a rolling 24-hour window from current time

- Days remaining countdown- Instant deployment

For additional help, see the comprehensive [troubleshooting guide](./SETUP.md#troubleshooting) in SETUP.md.

- Custom domain support

## Team

---

Built by students at **Texas A&M University Commerce** for the Fittober 2025 challenge:

## 📊 API Endpoints

- Mukesh Ravichandran

- Tejaswini## 🧪 Testing

- Jaahnavi

- Trisha### GET /health



**Challenge Details**  ### Test Backend LocallyHealth check endpoint

Event: Fittober 2025  

Duration: October 1-31, 2025  ```bash```json

Goal: Track and encourage daily fitness activities

cd backend{

## Acknowledgments

node index.js  "status": "healthy",

- [Chart.js](https://www.chartjs.org/) for data visualization

- [SendGrid](https://sendgrid.com/) for email delivery# Visit http://localhost:3000  "timestamp": "2024-01-01T12:00:00.000Z",

- [Supabase](https://supabase.com/) for PostgreSQL hosting

- [Vercel](https://vercel.com/) for serverless deployment```  "gists": 4

- [QuickChart.io](https://quickchart.io/) for email chart rendering

}

---

### Test API Endpoints```

<div align="center">

```bash

**[View Live Dashboard](https://pushpullleg.github.io/fitness-tracker)** • **[API Documentation](https://fitness-tracker-flame-kappa.vercel.app)**

# Health check### GET /aggregates.json

Made with ❤️ for Fittober 2025

curl https://fitness-tracker-flame-kappa.vercel.app/healthTeam fitness data

</div>

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
