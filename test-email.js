// Test Gmail App Password
// Run this with: node test-email.js

const nodemailer = require('nodemailer');
require('dotenv').config({ path: '.env.local' });

async function testEmail() {
  console.log('Testing Gmail configuration...');
  console.log('Gmail App Password available:', !!process.env.GMAIL_APP_PASSWORD);
  console.log('Password length:', process.env.GMAIL_APP_PASSWORD?.length);

  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: 'dhruveshshyaraog@gmail.com',
      pass: process.env.GMAIL_APP_PASSWORD
    }
  });

  try {
    await transporter.verify();
    console.log('✅ SMTP connection successful!');
    
    // Send test email
    const info = await transporter.sendMail({
      from: 'dhruveshshyaraog@gmail.com',
      to: 'dhruveshshyaraog@gmail.com',
      subject: 'Test Email from Yaritu Website',
      text: 'This is a test email to verify the configuration works.'
    });
    
    console.log('✅ Test email sent:', info.messageId);
  } catch (error) {
    console.log('❌ Error:', error.message);
  }
}

testEmail();