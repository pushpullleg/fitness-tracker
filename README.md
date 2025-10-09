# 🏃‍♂️ Fittober Fitness Tracker

A complete solution for tracking fitness activities from multiple team members with real-time WhatsApp notifications and beautiful data visualization.

## 🌟 Overview

Fittober is a comprehensive fitness tracking system that:
- **Polls 4 GitHub Gists** every 60 seconds for new fitness activities
- **Stores data** in PostgreSQL with smart deduplication
- **Sends WhatsApp notifications** to team group for each new activity
- **Provides a beautiful dashboard** showing team progress with interactive charts
- **Handles real-time updates** with automatic refresh every minute

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   GitHub Gists  │───▶│  Node.js Backend│───▶│  PostgreSQL DB  │
│   (4 sources)   │    │  (Express API)  │    │  (Activities)   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │
                                ▼
                       ┌─────────────────┐    ┌─────────────────┐
                       │  WhatsApp API   │    │  Frontend       │
                       │  (Twilio)       │    │  (Chart.js)     │
                       └─────────────────┘    └─────────────────┘
```

## 📁 Project Structure

```
fitness-tracker/
├── backend/
│   ├── index.js              # Main server application
│   ├── package.json          # Node.js dependencies
│   ├── database.sql          # PostgreSQL schema
│   ├── env.example           # Environment variables template
│   └── README.md             # Backend setup guide
├── frontend/
│   ├── index.html            # Dashboard web page
│   └── README.md             # Frontend deployment guide
└── README.md                 # This file
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 12+
- Twilio Account
- GitHub account (for hosting frontend)

### 1. Backend Setup

```bash
cd backend
npm install
cp env.example .env
# Edit .env with your database and Twilio credentials
npm start
```

### 2. Database Setup

```bash
# Create database and run schema
psql -d your_database -f database.sql
```

### 3. Frontend Deployment

**Option A: GitHub Pages**
1. Upload `frontend/index.html` to a GitHub repository
2. Enable GitHub Pages in repository settings
3. Update backend URL in the HTML file

**Option B: Local Development**
1. Open `frontend/index.html` in a web browser
2. Ensure backend is running on localhost:3000

## 📊 Features

### Backend Features
- ✅ **Real-time Polling**: Fetches data from 4 GitHub Gists every 60 seconds
- ✅ **Smart Deduplication**: Prevents duplicate entries using unique constraints
- ✅ **WhatsApp Integration**: Sends notifications via Twilio for each new activity
- ✅ **RESTful API**: Provides `/aggregates.json` endpoint for frontend
- ✅ **Error Handling**: Comprehensive error handling and logging
- ✅ **Production Ready**: Environment-based configuration and graceful shutdown

### Frontend Features
- ✅ **Interactive Charts**: Beautiful pie chart showing team member contributions
- ✅ **Real-time Updates**: Auto-refreshes data every 60 seconds
- ✅ **Responsive Design**: Works on desktop, tablet, and mobile
- ✅ **Modern UI**: Gradient design with smooth animations
- ✅ **Error Handling**: Graceful error states with retry functionality

### Data Processing
- ✅ **Member Name Normalization**: Consistent formatting across sources
- ✅ **Flexible Data Structure**: Handles different gist formats
- ✅ **Cumulative Totals**: Accurate tracking of total minutes per member
- ✅ **Activity Logging**: Complete audit trail with timestamps

## 📱 WhatsApp Notifications

Each new fitness activity triggers a WhatsApp message to the "Fittober" group:

```
John Doe completed 30 minutes of Running.
Jane Smith completed 45 minutes of Cycling.
```

### Setup Instructions
1. Create Twilio account and enable WhatsApp Sandbox
2. Create WhatsApp group named "Fittober"
3. Add Twilio sandbox number to the group
4. Configure environment variables with your credentials

## 🎯 Data Sources

The system polls these 4 GitHub Gists:
1. https://gist.github.com/pushpullleg/9c7ab834aa55e54fa70f61d501bf019d
2. https://gist.github.com/pushpullleg/b2ff0075e1556c7b39d6f1bbc9860a90
3. https://gist.github.com/pushpullleg/b41a48c3557b59ad55d60c08a0bd2517
4. https://gist.github.com/pushpullleg/5a8d4b337f4e2c5916559b193dc5b1c4

### Expected Data Format
```json
{
  "logs": [
    {
      "id": "unique_id",
      "timestamp": "2024-01-01T12:00:00.000Z",
      "member": "Member Name",
      "activity": "Running",
      "duration": 30,
      "teamName": "Fittober"
    }
  ]
}
```

## 🛠️ Configuration

### Environment Variables

**Backend (.env)**
```env
DATABASE_URL=postgresql://user:pass@host:port/db
TWILIO_SID=your_twilio_account_sid
TWILIO_TOKEN=your_twilio_auth_token
TWILIO_FROM=whatsapp:+14155238886
TWILIO_TO=whatsapp:+1234567890
PORT=3000
NODE_ENV=production
```

**Frontend (index.html)**
```javascript
const API_BASE_URL = 'https://your-backend-url.herokuapp.com';
```

## 🚀 Deployment Options

### Backend Deployment

**Heroku (Recommended)**
```bash
heroku create your-fittober-tracker
heroku addons:create heroku-postgresql:hobby-dev
heroku config:set DATABASE_URL=your_postgres_url
git push heroku main
```

**Google Cloud Run**
```bash
gcloud run deploy fittober-tracker --source . --platform managed
```

**Railway**
- Connect GitHub repository
- Set environment variables
- Auto-deploys on push

### Frontend Deployment

**GitHub Pages**
- Upload HTML file to repository
- Enable Pages in settings
- Access at `username.github.io/repo-name`

**Netlify**
- Drag and drop HTML file
- Instant deployment
- Custom domain support

## 📊 API Endpoints

### GET /health
Health check endpoint
```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T12:00:00.000Z",
  "gists": 4
}
```

### GET /aggregates.json
Team fitness data
```json
{
  "members": [
    { "name": "John Doe", "total_min": 150 },
    { "name": "Jane Smith", "total_min": 120 }
  ],
  "total_min": 270,
  "last_updated": "2024-01-01T12:00:00.000Z"
}
```

## 🔧 Customization

### Adding New Gist Sources
1. Add URL to `GIST_URLS` array in `backend/index.js`
2. Restart backend service
3. New source will be polled automatically

### Modifying Polling Frequency
```javascript
setInterval(pollAllGists, 60000); // Change 60000ms to desired interval
```

### Customizing Dashboard
- Modify colors in `frontend/index.html`
- Change chart type (pie → doughnut, bar, etc.)
- Add new statistics cards
- Customize refresh interval

## 🧪 Testing

### Test WhatsApp Notifications
1. Add a test entry to one of the monitored gists
2. Wait for next polling cycle (up to 60 seconds)
3. Check WhatsApp group for notification

### Test API Endpoints
```bash
# Health check
curl https://your-backend-url.herokuapp.com/health

# Get aggregates
curl https://your-backend-url.herokuapp.com/aggregates.json
```

### Test Frontend
1. Open dashboard in browser
2. Verify chart displays correctly
3. Test auto-refresh functionality
4. Check responsive design on mobile

## 🚨 Troubleshooting

### Common Issues

**Backend not receiving data**
- Check gist URLs are accessible
- Verify data format matches expected structure
- Review console logs for errors

**WhatsApp notifications not sending**
- Verify Twilio credentials
- Check sandbox setup
- Ensure group number format is correct

**Frontend not loading data**
- Verify backend URL is correct
- Check CORS settings
- Test API endpoint directly

**Database connection issues**
- Verify DATABASE_URL format
- Check database accessibility
- Run database.sql schema

## 📈 Monitoring

### Health Monitoring
Monitor `/health` endpoint to ensure service is running:
```bash
curl https://your-backend-url.herokuapp.com/health
```

### Log Monitoring
Backend provides comprehensive logging:
- Polling status for each gist
- New activities detected
- WhatsApp message delivery status
- Error details for debugging

## 🔒 Security

- Environment variables for all sensitive data
- No hardcoded credentials
- CORS configuration for frontend access
- Input validation and error handling
- HTTPS recommended for production

## 📞 Support

For issues or questions:
1. Check the troubleshooting section
2. Review backend and frontend README files
3. Verify all configuration is correct
4. Test individual components

## 🎯 Roadmap

Potential future enhancements:
- [ ] GitHub webhook integration for real-time updates
- [ ] Additional chart types (bar, line, etc.)
- [ ] Member-specific activity breakdowns
- [ ] Historical data trends
- [ ] Mobile app companion
- [ ] Slack integration option

## 📄 License

MIT License - feel free to use and modify for your team's needs.

---

**Built with ❤️ for the Fittober team**

*Track, notify, and visualize your team's fitness journey in real-time!*
