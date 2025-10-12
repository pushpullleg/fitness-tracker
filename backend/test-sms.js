require('dotenv').config();
const twilio = require('twilio');

console.log('🧪 Testing Twilio SMS Setup...\n');

// Check environment variables
console.log('Environment Variables:');
console.log('✓ TWILIO_SID:', process.env.TWILIO_SID ? '✅ Set' : '❌ Missing');
console.log('✓ TWILIO_TOKEN:', process.env.TWILIO_TOKEN ? '✅ Set' : '❌ Missing');
console.log('✓ TWILIO_FROM:', process.env.TWILIO_FROM || '❌ Missing');
console.log('✓ TWILIO_TO:', process.env.TWILIO_TO || '❌ Missing');
console.log('');

if (!process.env.TWILIO_SID || !process.env.TWILIO_TOKEN) {
  console.error('❌ Missing Twilio credentials!');
  process.exit(1);
}

// Initialize Twilio client
try {
  const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);
  console.log('✅ Twilio client initialized successfully\n');

  // Test sending SMS to first recipient only
  const recipients = process.env.TWILIO_TO.split(',').map(num => num.trim());
  const testRecipient = recipients[0];

  console.log(`📱 Attempting to send test SMS to: ${testRecipient}`);
  console.log(`📞 From: ${process.env.TWILIO_FROM}\n`);

  client.messages
    .create({
      from: process.env.TWILIO_FROM,
      to: testRecipient,
      body: '🧪 Test SMS from Fittober Tracker! If you receive this, SMS notifications are working! 🏋️',
    })
    .then(message => {
      console.log('✅ SMS sent successfully!');
      console.log('Message SID:', message.sid);
      console.log('Status:', message.status);
      console.log('\n🎉 SMS feature is configured correctly!');
    })
    .catch(error => {
      console.error('❌ Failed to send SMS:');
      console.error('Error Code:', error.code);
      console.error('Error Message:', error.message);
      console.error('\n⚠️  Check the Twilio requirements below:');
      console.error('1. Verify phone number is verified in Twilio Console (trial account)');
      console.error('2. Check if FROM number has SMS capability');
      console.error('3. For toll-free numbers, ensure verification is complete');
    });

} catch (error) {
  console.error('❌ Failed to initialize Twilio client:');
  console.error(error.message);
}
