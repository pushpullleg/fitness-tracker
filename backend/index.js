require('dotenv').config();
const express = require('express');
const axios = require('axios');
const { Pool } = require('pg');
const twilio = require('twilio');

const app = express();
const port = process.env.PORT || 3000;

// Database connection with error handling
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Handle pool errors to prevent crashes
pool.on('error', (err, client) => {
  console.error('Unexpected database error:', err.message);
  console.log('Database connection will be retried on next request');
});

// Twilio client
const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);

// Gist URLs to poll
const GIST_URLS = [
  'https://gist.github.com/pushpullleg/9c7ab834aa55e54fa70f61d501bf019d',
  'https://gist.github.com/pushpullleg/b2ff0075e1556c7b39d6f1bbc9860a90',
  'https://gist.github.com/pushpullleg/b41a48c3557b59ad55d60c08a0bd2517',
  'https://gist.github.com/pushpullleg/5a8d4b337f4e2c5916559b193dc5b1c4'
];

// Function to normalize member names
function normalizeMemberName(name) {
  if (!name) return 'Unknown';
  return name.trim().toLowerCase()
    .replace(/\b\w/g, l => l.toUpperCase()); // Capitalize first letter of each word
}

// Function to fetch data from a gist
async function fetchGistData(gistUrl) {
  try {
    console.log(`Fetching data from: ${gistUrl}`);
    const response = await axios.get(`${gistUrl}/raw`, {
      timeout: 10000,
      headers: {
        'User-Agent': 'Fittober-Tracker/1.0'
      }
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching data from ${gistUrl}:`, error.message);
    return null;
  }
}

// Function to process logs from a gist
async function processGistLogs(gistUrl) {
  const data = await fetchGistData(gistUrl);
  if (!data) return;

  // Handle different data structures
  const logs = data.logs || data.activities || (Array.isArray(data) ? data : []);
  
  if (!Array.isArray(logs)) {
    console.log(`No logs array found in gist: ${gistUrl}`);
    return;
  }

  console.log(`Processing ${logs.length} logs from ${gistUrl}`);

  for (const log of logs) {
    try {
      // Extract fields with fallbacks for different naming conventions
      const logId = log.id || log.log_id || log.logId;
      const timestamp = log.timestamp || log.ts || log.time;
      const member = normalizeMemberName(log.member || log.name || log.user);
      const activity = log.activity || log.exercise || log.type;
      const duration = log.duration || log.duration_min || log.minutes;
      const teamName = log.teamName || log.team || log.device_team || 'Fittober';

      // Validate required fields
      if (!logId || !member || !activity || !duration) {
        console.log(`Skipping invalid log:`, { logId, member, activity, duration });
        continue;
      }
      
      // Insert into database with conflict resolution
      const insertQuery = `
        INSERT INTO activities (
          log_id, member, activity, duration_min, ts, device_team, source_gist, raw_json
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        ON CONFLICT (log_id, source_gist) DO NOTHING
        RETURNING uid
      `;
      
      const result = await pool.query(insertQuery, [
        logId.toString(),
        member,
        activity,
        parseInt(duration),
        new Date(timestamp),
        teamName,
        gistUrl,
        JSON.stringify(log)
      ]);

      // If a new record was inserted, send WhatsApp notification
      if (result.rows.length > 0) {
        console.log(`New activity logged: ${member} - ${activity} (${duration} min)`);
        
        const message = `${member} completed ${duration} minutes of ${activity}.`;
        
        try {
          await client.messages.create({
            from: process.env.TWILIO_FROM,
            to: process.env.TWILIO_TO,
            body: message,
          });
          console.log(`WhatsApp notification sent: ${message}`);
        } catch (whatsappError) {
          console.error('Error sending WhatsApp message:', whatsappError.message);
        }
      }

    } catch (error) {
      console.error('Error processing individual log:', error.message);
    }
  }
}

// Main polling function
async function pollAllGists() {
  console.log(`Starting to poll ${GIST_URLS.length} gists...`);
  
  for (const gistUrl of GIST_URLS) {
    try {
      await processGistLogs(gistUrl);
    } catch (error) {
      console.error(`Error processing gist ${gistUrl}:`, error.message);
    }
  }
  
  console.log('Polling cycle completed');
}

// Start polling every 60 seconds
setInterval(pollAllGists, 60000);

// Initial poll
pollAllGists();

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    gists: GIST_URLS.length
  });
});

// Aggregates endpoint
app.get('/aggregates.json', async (req, res) => {
  try {
    // Get member totals
    const memberTotalsQuery = `
      SELECT member as name, SUM(duration_min) as total_min 
      FROM activities 
      GROUP BY member 
      ORDER BY total_min DESC
    `;
    
    const memberTotals = await pool.query(memberTotalsQuery);

    // Get overall total
    const overallTotalQuery = `
      SELECT SUM(duration_min) as total_min 
      FROM activities
    `;
    
    const overallTotal = await pool.query(overallTotalQuery);

    res.json({
      members: memberTotals.rows,
      total_min: overallTotal.rows[0].total_min || 0,
      last_updated: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error fetching aggregates:', error);
    res.status(500).json({ 
      error: 'Internal Server Error',
      message: error.message 
    });
  }
});

// CORS middleware for frontend
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// Serve static files if running locally
if (process.env.NODE_ENV !== 'production') {
  app.use(express.static('public'));
}

// Start server
app.listen(port, () => {
  console.log(`🚀 Fittober Tracker server running on port ${port}`);
  console.log(`📊 Aggregates available at: http://localhost:${port}/aggregates.json`);
  console.log(`❤️  Health check at: http://localhost:${port}/health`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('Shutting down gracefully...');
  pool.end();
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('Shutting down gracefully...');
  pool.end();
  process.exit(0);
});
