# Backend API for Fittober Fitness Tracker

This is the Node.js/Express backend that:
- Polls GitHub Gists every 60 seconds for fitness activities
- Stores data in Supabase PostgreSQL
- Sends WhatsApp notifications via Twilio
- Serves aggregated fitness data via REST API

## API Endpoints

- `GET /health` - Health check
- `GET /aggregates.json` - Get fitness statistics for all team members

## Local Development

```bash
npm install
node index.js
```

Server runs on http://localhost:3001

## Environment Variables Required

See `.env.example` for required variables.
