require('dotenv').config();
const express = require('express');
const axios = require('axios');
const { Pool } = require('pg');
const twilio = require('twilio');
const sgMail = require('@sendgrid/mail');

const app = express();
const port = process.env.PORT || 3000;

// SendGrid configuration
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  console.log('✅ SendGrid initialized');
} else {
  console.warn('⚠️  SendGrid API key not found - email notifications will be disabled');
}

// Database connection with error handling and connection limits
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 1, // Limit to 1 connection for serverless (Vercel)
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
  allowExitOnIdle: true, // Allow process to exit when pool is idle
});

// Handle pool errors to prevent crashes
pool.on('error', (err, client) => {
  console.error('Unexpected database error:', err.message);
  console.log('Database connection will be retried on next request');
});

// Twilio client (initialize only if credentials exist)
let client = null;
if (process.env.TWILIO_SID && process.env.TWILIO_TOKEN) {
  try {
    client = twilio(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);
    console.log('✅ Twilio client initialized');
  } catch (error) {
    console.error('❌ Failed to initialize Twilio client:', error.message);
  }
} else {
  console.warn('⚠️  Twilio credentials not found - SMS notifications will be disabled');
}

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

      // If a new record was inserted, send SMS notification
      if (result.rows.length > 0) {
        console.log(`New activity logged: ${member} - ${activity} (${duration} min)`);
        
        // Send SMS to multiple team members
        const recipients = process.env.TWILIO_TO 
          ? process.env.TWILIO_TO.split(',').map(num => num.trim())
          : [];
        
        if (client && recipients.length > 0 && process.env.TWILIO_FROM) {
          try {
            const notificationPromises = recipients.map(async (recipient) => {
              try {
                await client.messages.create({
                  from: process.env.TWILIO_FROM,
                  to: recipient,
                  body: `🏋️ ${member} completed ${duration} minutes of ${activity}!`,
                });
                console.log(`SMS notification sent to ${recipient}`);
              } catch (error) {
                console.error(`Error sending SMS to ${recipient}:`, error.message);
              }
            });
            
            await Promise.all(notificationPromises);
            console.log(`SMS notifications sent to ${recipients.length} team members`);
          } catch (smsError) {
            console.error('Error sending SMS messages:', smsError.message);
          }
        } else {
          console.log('SMS notifications skipped - missing Twilio configuration');
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

// CORS middleware (must be before routes)
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: '🏃‍♂️ Fittober Fitness Tracker API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      aggregates: '/aggregates.json'
    },
    status: 'running'
  });
});

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

// Add /api prefix routes for Vercel serverless compatibility
app.get('/api', (req, res) => {
  res.json({
    message: '🏃‍♂️ Fittober Fitness Tracker API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      aggregates: '/api/aggregates.json'
    },
    status: 'running'
  });
});

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    gists: GIST_URLS.length
  });
});

app.get('/api/aggregates.json', async (req, res) => {
  try {
    const memberTotalsQuery = `
      SELECT member as name, SUM(duration_min) as total_min 
      FROM activities 
      GROUP BY member 
      ORDER BY total_min DESC
    `;
    
    const memberTotals = await pool.query(memberTotalsQuery);

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

// Recent activities endpoint
app.get('/api/recent', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5;
    
    const recentActivitiesQuery = `
      SELECT member, activity, duration_min, ts 
      FROM activities 
      ORDER BY ts DESC 
      LIMIT $1
    `;
    
    const result = await pool.query(recentActivitiesQuery, [limit]);

    res.json({
      activities: result.rows,
      count: result.rows.length
    });

  } catch (error) {
    console.error('Error fetching recent activities:', error);
    res.status(500).json({ 
      error: 'Internal Server Error',
      message: error.message 
    });
  }
});

// Manual refresh endpoint to trigger data fetch
app.post('/api/refresh', async (req, res) => {
  try {
    console.log('🔄 Manual refresh triggered');
    await pollAllGists();
    
    res.json({ 
      success: true,
      message: 'Data refreshed successfully',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error during manual refresh:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to refresh data',
      message: error.message 
    });
  }
});

// GET version of refresh for easier testing
app.get('/api/refresh', async (req, res) => {
  try {
    console.log('🔄 Manual refresh triggered (GET)');
    await pollAllGists();
    
    res.json({ 
      success: true,
      message: 'Data refreshed successfully',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error during manual refresh:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to refresh data',
      message: error.message 
    });
  }
});

// Webhook endpoint to receive GitHub Gist update notifications
app.post('/api/webhook', async (req, res) => {
  const startTime = new Date();
  console.log('📬 Webhook received at:', startTime.toISOString());
  console.log('From GitHub:', req.headers['user-agent']);
  
  // Respond immediately to GitHub so it knows we received it (GitHub has 10 second timeout)
  res.status(200).json({ 
    success: true,
    message: 'Webhook received, processing in background',
    timestamp: startTime.toISOString()
  });
  
  // Process the webhook in background (after responding to GitHub)
  try {
    console.log('🔄 Starting automatic data refresh from webhook...');
    
    // Fetch new data from all Gists and update database
    await pollAllGists();
    
    const endTime = new Date();
    const duration = endTime - startTime;
    
    console.log(`✅ Webhook processing completed in ${duration}ms`);
    console.log('💬 SMS notifications sent (if configured in pollAllGists)');
    
  } catch (error) {
    console.error('❌ Error processing webhook:', error.message);
    console.error('Stack:', error.stack);
  }
});

// Daily email digest endpoint (triggered by cron job at 9 PM CST)
app.get('/api/send-digest', async (req, res) => {
  console.log('📧 Email digest triggered at:', new Date().toISOString());
  
  try {
    if (!process.env.SENDGRID_API_KEY) {
      return res.status(500).json({
        success: false,
        error: 'SendGrid not configured'
      });
    }

    // Get today's activities (since midnight)
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    
    const activitiesQuery = `
      SELECT member_name, activity_type, duration_minutes, timestamp
      FROM fitness_logs
      WHERE timestamp >= $1
      ORDER BY timestamp DESC
    `;
    
    const activitiesResult = await pool.query(activitiesQuery, [todayStart]);
    const todayActivities = activitiesResult.rows;

    // Get overall team standings
    const standingsQuery = `
      SELECT member_name, SUM(duration_minutes) as total_minutes
      FROM fitness_logs
      GROUP BY member_name
      ORDER BY total_minutes DESC
    `;
    
    const standingsResult = await pool.query(standingsQuery);
    const teamStandings = standingsResult.rows;
    
    const totalMinutes = teamStandings.reduce((sum, m) => sum + parseInt(m.total_minutes), 0);

    // Calculate days remaining
    const challengeEnd = new Date('2025-10-31T23:59:59');
    const now = new Date();
    const daysRemaining = Math.ceil((challengeEnd - now) / (1000 * 60 * 60 * 24));

    // Generate HTML email
    const emailHtml = generateDigestEmail(todayActivities, teamStandings, totalMinutes, daysRemaining);

    // Send email to all team members
    const recipients = process.env.EMAIL_RECIPIENTS 
      ? process.env.EMAIL_RECIPIENTS.split(',').map(email => email.trim())
      : [];

    if (recipients.length === 0) {
      return res.status(500).json({
        success: false,
        error: 'No email recipients configured'
      });
    }

    const msg = {
      to: recipients,
      from: process.env.SENDGRID_FROM_EMAIL || 'fittober@yourdomain.com',
      subject: `🏋️ Fittober Update: ${todayActivities.length} activities logged today`,
      html: emailHtml,
    };

    await sgMail.send(msg);

    console.log(`✅ Email digest sent to ${recipients.length} recipients`);
    
    res.json({
      success: true,
      message: 'Email digest sent successfully',
      recipients: recipients.length,
      activitiesToday: todayActivities.length,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Error sending email digest:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to send email digest',
      message: error.message
    });
  }
});

// Helper function to generate email HTML
function generateDigestEmail(todayActivities, teamStandings, totalMinutes, daysRemaining) {
  // Group today's activities by member
  const activitiesByMember = {};
  todayActivities.forEach(activity => {
    if (!activitiesByMember[activity.member_name]) {
      activitiesByMember[activity.member_name] = [];
    }
    activitiesByMember[activity.member_name].push(activity);
  });

  // Calculate today's totals per member
  const todayTotals = {};
  Object.keys(activitiesByMember).forEach(member => {
    todayTotals[member] = activitiesByMember[member].reduce(
      (sum, a) => sum + parseInt(a.duration_minutes), 
      0
    );
  });

  // Generate activities section
  let activitiesHtml = '';
  Object.keys(activitiesByMember).forEach(member => {
    const activities = activitiesByMember[member];
    const memberEmojis = {
      'Mukesh Ravichandran': '🏃',
      'Tejaswini Damodara Kannan': '🧘',
      'Jaahnavi Garikipati': '🚴',
      'Trisha Harjono': '💪'
    };
    const emoji = memberEmojis[member] || '🏋️';
    
    activitiesHtml += `
      <div style="background: #f8f9fa; border-left: 4px solid #00386C; padding: 15px; margin-bottom: 15px; border-radius: 5px;">
        <h3 style="color: #00386C; margin: 0 0 10px 0; font-size: 18px;">${emoji} ${member.split(' ')[0]}</h3>
        <ul style="margin: 0; padding-left: 20px;">
    `;
    
    activities.forEach(activity => {
      const time = new Date(activity.timestamp).toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      });
      activitiesHtml += `<li style="margin: 5px 0;">${activity.activity_type} - ${activity.duration_minutes} mins (${time})</li>`;
    });
    
    activitiesHtml += `
        </ul>
        <p style="margin: 10px 0 0 0; font-weight: bold; color: #FFC333;">Total today: ${todayTotals[member]} mins</p>
      </div>
    `;
  });

  // Generate standings HTML
  let standingsHtml = '';
  const medals = ['🥇', '🥈', '🥉', '📊'];
  teamStandings.forEach((member, index) => {
    const percentage = ((parseInt(member.total_minutes) / totalMinutes) * 100).toFixed(1);
    standingsHtml += `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #ddd;">${medals[index]} ${member.member_name}</td>
        <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: right; font-weight: bold; color: #00386C;">${member.total_minutes} mins</td>
        <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: right; color: #666;">${percentage}%</td>
      </tr>
    `;
  });

  // Embedded dashboard image (using Chart.js via QuickChart)
  const chartData = teamStandings.map(m => parseInt(m.total_minutes));
  const chartLabels = teamStandings.map(m => m.member_name.split(' ')[0]);
  const chartColors = ['#FFC333', '#1172DE', '#10B981', '#F26839'];
  
  const chartConfig = {
    type: 'doughnut',
    data: {
      labels: chartLabels,
      datasets: [{
        data: chartData,
        backgroundColor: chartColors,
        borderWidth: 3,
        borderColor: '#ffffff'
      }]
    },
    options: {
      plugins: {
        legend: { display: false },
        datalabels: {
          color: '#fff',
          font: { size: 16, weight: 'bold' },
          formatter: (value) => value + ' min'
        }
      },
      cutout: '65%'
    }
  };
  
  const chartUrl = `https://quickchart.io/chart?c=${encodeURIComponent(JSON.stringify(chartConfig))}&width=500&height=300`;

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; margin: 0; padding: 20px; background-color: #f5f5f5;">
  <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
    
    <!-- Header -->
    <div style="background: linear-gradient(135deg, #00386C 0%, #1172DE 100%); color: white; padding: 30px 20px; text-align: center;">
      <h1 style="margin: 0 0 10px 0; font-size: 28px; font-weight: 800;">🏋️ THE EXCEL-ERATORS</h1>
      <p style="margin: 0; font-size: 16px; opacity: 0.9;">Fittober 2025 Daily Update</p>
      <p style="margin: 10px 0 0 0; font-size: 14px; background: rgba(255,255,255,0.2); display: inline-block; padding: 5px 15px; border-radius: 20px;">
        ⏰ ${daysRemaining} days remaining
      </p>
    </div>

    <!-- Dashboard Chart -->
    <div style="padding: 30px 20px; text-align: center; background: #fafafa;">
      <h2 style="color: #00386C; margin: 0 0 20px 0;">📊 Team Progress</h2>
      <img src="${chartUrl}" alt="Team Activity Chart" style="max-width: 100%; height: auto; border-radius: 10px;" />
      <p style="margin: 15px 0 0 0;">
        <a href="https://pushpullleg.github.io/fitness-tracker/" style="display: inline-block; background: #FFC333; color: #00386C; padding: 12px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; font-size: 16px;">
          View Live Dashboard →
        </a>
      </p>
    </div>

    <!-- Today's Activities -->
    <div style="padding: 30px 20px;">
      <h2 style="color: #00386C; margin: 0 0 20px 0; border-bottom: 3px solid #FFC333; padding-bottom: 10px;">
        📅 Today's Activities (${todayActivities.length} total)
      </h2>
      ${activitiesHtml || '<p style="color: #666; text-align: center; padding: 20px;">No activities logged today yet. Get moving! 💪</p>'}
    </div>

    <!-- Team Standings -->
    <div style="padding: 0 20px 30px 20px;">
      <h2 style="color: #00386C; margin: 0 0 20px 0; border-bottom: 3px solid #FFC333; padding-bottom: 10px;">
        🏆 Overall Standings
      </h2>
      <table style="width: 100%; border-collapse: collapse; background: white;">
        <thead>
          <tr style="background: #00386C; color: white;">
            <th style="padding: 12px; text-align: left;">Member</th>
            <th style="padding: 12px; text-align: right;">Total Minutes</th>
            <th style="padding: 12px; text-align: right;">% of Team</th>
          </tr>
        </thead>
        <tbody>
          ${standingsHtml}
        </tbody>
        <tfoot>
          <tr style="background: #FFC333; font-weight: bold;">
            <td style="padding: 12px;">Team Total</td>
            <td style="padding: 12px; text-align: right;" colspan="2">${totalMinutes} minutes</td>
          </tr>
        </tfoot>
      </table>
    </div>

    <!-- Footer -->
    <div style="background: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #ddd;">
      <p style="margin: 0; color: #666; font-size: 14px;">
        Keep crushing it, Excel-erators! 💪
      </p>
      <p style="margin: 10px 0 0 0; color: #999; font-size: 12px;">
        You're receiving this because you're part of The Excel-erators team.<br>
        Challenge ends October 31, 2025
      </p>
    </div>

  </div>
</body>
</html>
  `;
}

// Start polling in background if not in serverless environment
if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
  // Start polling every 60 seconds (only for local development)
  setInterval(pollAllGists, 60000);
  
  // Initial poll
  pollAllGists();
  
  console.log('📡 Started polling GitHub Gists every 60 seconds');
}

// For Vercel serverless: Export the Express app
if (process.env.VERCEL) {
  module.exports = app;
} else {
  // For local development: Start server
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
}
