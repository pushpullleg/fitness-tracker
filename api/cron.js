// Vercel Cron Job - Runs every hour to automatically fetch new data
// This endpoint is called by Vercel's cron scheduler

// Simply redirect to the refresh endpoint which already does everything we need
module.exports = async (req, res) => {
  console.log('⏰ Cron job triggered at:', new Date().toISOString());
  
  // Forward the request to the refresh endpoint
  // This uses the existing /api/refresh logic
  const refreshHandler = require('./index');
  
  // Create a modified request that looks like it's going to /api/refresh
  req.url = '/api/refresh';
  req.method = 'GET';
  
  // Use the app to handle the request
  return refreshHandler(req, res);
};
