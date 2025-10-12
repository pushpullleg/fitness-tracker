require('dotenv').config();
const sgMail = require('@sendgrid/mail');

console.log('🧪 Testing SendGrid email...');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const msg = {
  to: 'mravichandr@leomail.tamuc.edu',
  from: 'mravichandr@leomail.tamuc.edu',
  subject: '🧪 Test Email from Fittober Tracker',
  html: `
    <div style="font-family: Arial, sans-serif; padding: 20px; background: #f5f5f5;">
      <div style="max-width: 600px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px;">
        <h1 style="color: #00386C;">✅ SendGrid is Working!</h1>
        <p style="font-size: 16px; color: #333;">
          Your email digest feature is configured correctly.
        </p>
        <p style="font-size: 16px; color: #333;">
          You will receive daily team updates at <strong>9:00 PM CST</strong>.
        </p>
        <div style="background: #FFC333; padding: 15px; border-radius: 5px; margin-top: 20px;">
          <p style="margin: 0; color: #00386C; font-weight: bold;">
            🎉 Ready for Fittober 2025!
          </p>
        </div>
      </div>
    </div>
  `,
};

sgMail.send(msg)
  .then(() => {
    console.log('✅ Test email sent successfully!');
    console.log('📧 Check your inbox: mravichandr@leomail.tamuc.edu');
    console.log('');
    console.log('Next steps:');
    console.log('1. Check your email (might be in spam)');
    console.log('2. Update Vercel environment variables');
    console.log('3. Redeploy and wait for 9 PM CST!');
  })
  .catch((error) => {
    console.error('❌ Error sending email:', error.message);
    if (error.response) {
      console.error('Response:', error.response.body);
    }
  });
