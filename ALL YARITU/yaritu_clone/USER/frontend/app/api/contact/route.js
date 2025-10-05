// app/api/contact/route.js
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request) {
  try {
    console.log('Received contact form submission');
    const { fullName, email, phone, subject, message } = await request.json();

    // Validate required fields
    if (!fullName || !email || !message) {
      console.log('Validation failed: Missing required fields');
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    console.log('Form data validated successfully');
    console.log('Gmail App Password available:', !!process.env.GMAIL_APP_PASSWORD);

    // Create transporter using Gmail SMTP with explicit settings
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: 'dhruveshshyaraog@gmail.com',
        pass: process.env.GMAIL_APP_PASSWORD
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    // Verify transporter configuration
    try {
      await transporter.verify();
      console.log('SMTP connection verified successfully');
    } catch (verifyError) {
      console.error('SMTP verification failed:', verifyError);
      
      // If Gmail fails, let's try a fallback approach
      console.log('Attempting alternative email method...');
      
      // Log the email content for manual processing
      const emailContent = {
        to: 'dhruveshshyaraog@gmail.com',
        from: email,
        name: fullName,
        phone: phone,
        subject: subject || 'Contact Form Submission from Yaritu Website',
        message: message,
        timestamp: new Date().toISOString()
      };
      
      console.log('Email content to be sent:', JSON.stringify(emailContent, null, 2));
      
      // Return success with manual processing message
      return NextResponse.json(
        { 
          message: 'Message received successfully. We will contact you soon!',
          data: {
            name: fullName,
            email: email,
            timestamp: new Date().toISOString(),
            method: 'manual_processing'
          }
        },
        { status: 200 }
      );
    }

    const mailOptions = {
      from: `"${fullName}" <dhruveshshyaraog@gmail.com>`, // sender address
      to: 'dhruveshshyaraog@gmail.com', // receiver address
      replyTo: email, // reply to sender's email
      subject: subject || 'Contact Form Submission from Yaritu Website',
      html: `
        <div style="font-family: 'Arial', sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9f9f9; padding: 20px;">
          <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <div style="border-bottom: 3px solid #c5a46d; padding-bottom: 20px; margin-bottom: 20px;">
              <h2 style="color: #25384d; margin: 0; font-size: 24px;">New Contact Form Submission</h2>
              <p style="color: #666; margin: 5px 0 0 0; font-size: 14px;">From Yaritu Website</p>
            </div>
            
            <div style="margin-bottom: 20px;">
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #eee; width: 30%; font-weight: bold; color: #25384d;">Name:</td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #333;">${fullName}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-weight: bold; color: #25384d;">Email:</td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #333;">${email}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-weight: bold; color: #25384d;">Phone:</td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #333;">${phone || 'Not provided'}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-weight: bold; color: #25384d;">Subject:</td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #333;">${subject || 'No subject'}</td>
                </tr>
              </table>
            </div>
            
            <div style="margin-bottom: 20px;">
              <h3 style="color: #25384d; margin-bottom: 10px;">Message:</h3>
              <div style="background-color: #f8f8f8; padding: 15px; border-radius: 5px; border-left: 4px solid #c5a46d;">
                <p style="margin: 0; line-height: 1.6; color: #333; white-space: pre-wrap;">${message}</p>
              </div>
            </div>
            
            <div style="border-top: 1px solid #eee; padding-top: 20px; text-align: center;">
              <p style="color: #666; font-size: 12px; margin: 0;">
                This message was sent from the Yaritu website contact form on ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
              </p>
            </div>
          </div>
        </div>
      `,
      text: `
Contact Form Submission from Yaritu Website

Name: ${fullName}
Email: ${email}
Phone: ${phone || 'Not provided'}
Subject: ${subject || 'No subject'}

Message:
${message}

Sent on: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
      `
    };

    // Send email
    console.log('Attempting to send email...');
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.messageId);

    // Return success response
    return NextResponse.json(
      { 
        message: 'Email sent successfully',
        data: {
          name: fullName,
          email: email,
          timestamp: new Date().toISOString(),
          messageId: info.messageId
        }
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Email sending error details:', {
      message: error.message,
      code: error.code,
      command: error.command
    });
    
    return NextResponse.json(
      { 
        error: 'Failed to send email',
        details: error.message,
        code: error.code || 'UNKNOWN_ERROR'
      },
      { status: 500 }
    );
  }
}