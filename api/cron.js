// Vercel Cron Job - Runs every hour to automatically fetch new data
// This endpoint is called by Vercel's cron scheduler

const app = require('../backend/index');

// This will be called by Vercel cron
module.exports = async (req, res) => {
  // Verify this is actually from Vercel Cron (security check)
  const authHeader = req.headers['authorization'];
  
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    console.log('❌ Unauthorized cron request');
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  console.log('⏰ Cron job triggered at:', new Date().toISOString());
  
  try {
    // Import the pollAllGists function
    // Since we're importing the app, we need to call the webhook endpoint internally
    const response = await fetch(`${process.env.VERCEL_URL || 'https://fitness-tracker-flame-kappa.vercel.app'}/api/webhook`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Vercel-Cron'
      },
      body: JSON.stringify({
        source: 'vercel-cron',
        timestamp: new Date().toISOString()
      })
    });
    
    const result = await response.json();
    
    console.log('✅ Cron job completed:', result);
    
    return res.status(200).json({
      success: true,
      message: 'Cron job executed successfully',
      timestamp: new Date().toISOString(),
      webhookResult: result
    });
    
  } catch (error) {
    console.error('❌ Cron job failed:', error);
    
    return res.status(500).json({
      success: false,
      error: 'Cron job failed',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
};
