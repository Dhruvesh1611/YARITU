import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import dbConnect from '../../../lib/dbConnect';
import Contact from '../../../models/Contact';

// --- GET function to fetch all contacts for the admin panel ---
export async function GET() {
  try {
  await dbConnect();
  const contacts = await Contact.find().sort({ createdAt: -1 }); // Get newest first
    return NextResponse.json({ data: contacts }, { status: 200 });
  } catch (error) {
    console.error('Failed to fetch contacts:', error);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}

// --- POST function to save a new contact and send an email ---
export async function POST(request) {
  try {
    const { fullName, email, phone, subject, message } = await request.json();

    // 1. Validate required fields
    if (!fullName || !email || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // 2. Save the submission to the database FIRST
  await dbConnect();
  await Contact.create({ fullName, email, phone, subject, message });
  console.log('Contact submission saved to database successfully.');

    // 3. Now, attempt to send the email notification
    try {
      let transporter;
      const gmailUser = process.env.GMAIL_SMTP_USER || 'dhruveshshyaraog@gmail.com';
      const gmailPass = process.env.GMAIL_APP_PASSWORD;

      // Attempt to use Gmail SMTP if configured
      if (gmailPass) {
        try {
          transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: { user: gmailUser, pass: gmailPass },
            tls: { rejectUnauthorized: false },
          });
          await transporter.verify(); // Verify connection and credentials
          console.log('SMTP connection verified (Gmail). Ready to send emails.');
        } catch (gmailError) {
          console.error('Gmail SMTP verification failed:', gmailError.message);
          console.warn('Falling back to Ethereal test account due to Gmail error.');
          transporter = null; // Reset transporter
        }
      }

      // If transporter is not set (either no password or Gmail failed), use Ethereal
      if (!transporter) {
        const testAccount = await nodemailer.createTestAccount();
        transporter = nodemailer.createTransport({
          host: 'smtp.ethereal.email',
          port: 587,
          auth: { user: testAccount.user, pass: testAccount.pass },
        });
        console.log('Using Ethereal test account for email preview.');
      }

      const mailOptions = {
        from: `"${fullName}" <${process.env.GMAIL_SMTP_USER || 'dhruveshshyaraog@gmail.com'}>`,
        to: process.env.NOTIFY_EMAIL || 'dhruveshshyaraog@gmail.com',
        replyTo: email,
        subject: subject || 'Contact Form Submission from Yaritu Website',
        html: `
            <div style="font-family: 'Arial', sans-serif; max-width: 600px; margin: 20px auto; background-color: #f9f9f9; padding: 20px; border-radius: 10px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
              <h2 style="color: #25384d; border-bottom: 2px solid #c5a46d; padding-bottom: 10px;">New Contact Submission</h2>
              <p><strong>Name:</strong> ${fullName}</p>
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
              <p><strong>Subject:</strong> ${subject || 'No subject'}</p>
              <div style="background-color: #ffffff; padding: 15px; border-left: 4px solid #c5a46d; margin-top: 15px;">
                <p style="margin: 0; white-space: pre-wrap;">${message}</p>
              </div>
              <p style="font-size: 12px; color: #888; text-align: center; margin-top: 20px;">
                Sent from the Yaritu website on ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
              </p>
            </div>
          `,
      };

      const info = await transporter.sendMail(mailOptions);
      console.log('Email notification sent. MessageId:', info.messageId);

      // If using Ethereal, log preview URL
      if (nodemailer.getTestMessageUrl && info) {
        const preview = nodemailer.getTestMessageUrl(info);
        if (preview) console.log('Ethereal preview URL:', preview);
      }

    } catch (emailError) {
      console.error('Failed to send email notification:', emailError && emailError.message ? emailError.message : emailError);
      // Primary function (saving data) succeeded; email is secondary.
    }
    
    // Return a success response because the data was saved.
    return NextResponse.json(
        { message: 'Submission received successfully!' },
        { status: 201 }
      );

  } catch (error) {
    console.error('Error processing contact form:', error);
    return NextResponse.json(
      { error: 'An internal error occurred.' },
      { status: 500 }
    );
  }
}

