# Fittober Fitness Tracker - Backend

A Node.js backend service that tracks fitness activities from multiple team members by polling GitHub Gists, stores data in PostgreSQL, and sends daily email digests via SendGrid.

## 🚀 Features

- **Real-time Data Polling**: Fetches fitness logs from 4 GitHub Gists every 60 seconds
- **Smart Deduplication**: Prevents duplicate entries using `(log_id + source_gist)` unique constraint
- **WhatsApp Notifications**: Sends real-time notifications to team group for each new activity
- **RESTful API**: Provides `/aggregates.json` endpoint for frontend consumption
- **Production Ready**: Modular, error-handling, graceful shutdown, and environment-based configuration

## 📋 Prerequisites

- Node.js 18+ 
- PostgreSQL 12+
- Twilio Account with WhatsApp Sandbox access

## 🛠️ Installation & Setup

### 1. Clone and Install Dependencies

```bash
git clone <your-repo-url>
cd fitness-tracker/backend
npm install
```

### 2. Database Setup

#### Option A: Local PostgreSQL

1. Install PostgreSQL locally
2. Create a database:
```sql
CREATE DATABASE fittober_db;
```

3. Run the schema:
```bash
psql -d fittober_db -f database.sql
```

#### Option B: Cloud Database (Recommended for Production)

**Heroku Postgres:**
```bash
# Add Heroku Postgres addon
heroku addons:create heroku-postgresql:hobby-dev

# Get the DATABASE_URL
heroku config:get DATABASE_URL
```

**Other Cloud Providers:**
- [Supabase](https://supabase.com) (Free tier available)
- [Railway](https://railway.app) (Free tier available)
- [Neon](https://neon.tech) (Free tier available)

### 3. Twilio WhatsApp Setup

1. **Create Twilio Account**
   - Sign up at [twilio.com](https://www.twilio.com)
   - Get your Account SID and Auth Token from the console

2. **Enable WhatsApp Sandbox**
   - Go to [WhatsApp Sandbox](https://console.twilio.com/us1/develop/sms/try-it-out/whatsapp-learn)
   - Follow instructions to join the sandbox
   - Note your sandbox WhatsApp number (usually `+14155238886`)

3. **Create WhatsApp Group**
   - Create a WhatsApp group named "Fittober"
   - Add the Twilio sandbox number to the group
   - Note your group's WhatsApp number

### 4. Environment Configuration

Copy the example environment file and configure:

```bash
cp env.example .env
```

Edit `.env` with your actual values:

```env
# Database Configuration
DATABASE_URL=postgresql://username:password@localhost:5432/fittober_db

# Twilio WhatsApp Configuration  
TWILIO_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_TOKEN=your_auth_token_here
TWILIO_FROM=whatsapp:+14155238886
TWILIO_TO=whatsapp:+1234567890

# Server Configuration
PORT=3000
NODE_ENV=development
```

## 🏃‍♂️ Running the Application

### Development

```bash
npm start
```

The server will start on `http://localhost:3000`

### Production

```bash
NODE_ENV=production npm start
```

## 📊 API Endpoints

### GET /health
Health check endpoint

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T12:00:00.000Z",
  "gists": 4
}
```

### GET /aggregates.json
Returns cumulative fitness activity data

**Response:**
```json
{
  "members": [
    {
      "name": "John Doe",
      "total_min": 150
    },
    {
      "name": "Jane Smith", 
      "total_min": 120
    }
  ],
  "total_min": 270,
  "last_updated": "2024-01-01T12:00:00.000Z"
}
```

## 🚀 Deployment Options

### Heroku (Recommended)

1. **Create Heroku App**
```bash
heroku create your-fittober-tracker
```

2. **Set Environment Variables**
```bash
heroku config:set DATABASE_URL=your_postgres_url
heroku config:set TWILIO_SID=your_twilio_sid
heroku config:set TWILIO_TOKEN=your_twilio_token
heroku config:set TWILIO_FROM=whatsapp:+14155238886
heroku config:set TWILIO_TO=whatsapp:+your_group_number
```

3. **Deploy**
```bash
git push heroku main
```

4. **Run Database Migration**
```bash
heroku run psql $DATABASE_URL -f database.sql
```

### Google Cloud Run

1. **Create Dockerfile**
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

2. **Deploy**
```bash
gcloud run deploy fittober-tracker \
  --source . \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars="DATABASE_URL=your_db_url,TWILIO_SID=your_sid,TWILIO_TOKEN=your_token"
```

### Railway

1. Connect your GitHub repository to Railway
2. Set environment variables in Railway dashboard
3. Railway automatically detects Node.js and deploys

## 🧪 Testing WhatsApp Notifications

1. **Test with a sample log**: Add a test entry to one of the monitored gists
2. **Check logs**: Monitor console output for WhatsApp message sending
3. **Verify delivery**: Check your WhatsApp group for the notification

**Expected notification format:**
```
John Doe completed 30 minutes of Running.
```

## 📝 Monitoring & Logs

The application provides comprehensive logging:

- **Polling Status**: Shows when each gist is being polled
- **New Activities**: Logs each new activity detected
- **WhatsApp Status**: Confirms message delivery
- **Errors**: Detailed error logging for debugging

### Health Monitoring

Monitor the `/health` endpoint to ensure the service is running:

```bash
curl http://your-app-url/health
```

## 🔧 Configuration

### Gist URLs

The application polls these 4 GitHub Gists by default:
- https://gist.github.com/pushpullleg/9c7ab834aa55e54fa70f61d501bf019d
- https://gist.github.com/pushpullleg/b2ff0075e1556c7b39d6f1bbc9860a90  
- https://gist.github.com/pushpullleg/b41a48c3557b59ad55d60c08a0bd2517
- https://gist.github.com/pushpullleg/5a8d4b337f4e2c5916559b193dc5b1c4

### Polling Frequency

Currently set to 60 seconds. To change, modify the interval in `index.js`:

```javascript
setInterval(pollAllGists, 60000); // 60 seconds
```

### Data Structure

The application expects gist data in this format:

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

## 🚨 Troubleshooting

### Common Issues

1. **Database Connection Errors**
   - Verify DATABASE_URL is correct
   - Ensure database is accessible
   - Check if table exists (run database.sql)

2. **WhatsApp Notifications Not Sending**
   - Verify Twilio credentials
   - Check sandbox setup
   - Ensure group number format: `whatsapp:+1234567890`

3. **Gist Polling Issues**
   - Check internet connectivity
   - Verify gist URLs are accessible
   - Review console logs for specific errors

4. **No New Activities Detected**
   - Check if gist data structure matches expected format
   - Verify log_id field exists and is unique
   - Review database for existing entries

### Debug Mode

Enable debug logging by setting:

```env
NODE_ENV=development
```

## 📈 Performance Considerations

- **Database Indexing**: Optimized indexes for member and timestamp queries
- **Connection Pooling**: Uses pg connection pooling for database efficiency
- **Error Handling**: Comprehensive error handling prevents crashes
- **Memory Management**: Proper cleanup of resources and graceful shutdown

## 🔒 Security Notes

- Never commit `.env` files to version control
- Use environment variables for all sensitive data
- Consider rate limiting for production deployments
- Monitor Twilio usage to avoid unexpected charges

## 📞 Support

For issues or questions:
1. Check the troubleshooting section above
2. Review application logs
3. Verify all environment variables are set correctly
4. Test individual components (database, Twilio, gist access)

---

**Built with ❤️ for the Fittober team**
