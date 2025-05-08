import nodemailer from 'nodemailer';

// Create a nodemailer transporter
const transporter = nodemailer.createTransport({
    host: 'smtp.zoho.eu',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    },
    tls: {
        // Do not fail on invalid certs
        rejectUnauthorized: false
    }
});

// Email templates
type EmailTemplate = 'welcome' | 'resetPassword' | 'verifyEmail';

interface EmailOptions {
    to: string;
    subject: string;
    text: string;
    html: string;
}

// Get email template
function getEmailTemplate(template: EmailTemplate, data: any): EmailOptions {
    switch (template) {
        case 'welcome':
            return {
                to: data.email,
                subject: 'Welcome to Our App',
                text: `Hello ${data.name},\n\nWelcome to our app! We're excited to have you on board.\n\nBest regards,\nThe Team`,
                html: `
          <div>
            <h1>Welcome to Our App</h1>
            <p>Hello ${data.name},</p>
            <p>Welcome to our app! We're excited to have you on board.</p>
            <p>Best regards,<br />The Team</p>
          </div>
        `
            };
        case 'resetPassword':
            return {
                to: data.email,
                subject: 'Reset Your Password',
                text: `Hello,\n\nYou requested to reset your password. Click the link below to set a new password:\n\n${data.resetUrl}\n\nThe link will expire in 1 hour.\n\nIf you didn't request this, please ignore this email.\n\nBest regards,\nThe Team`,
                html: `
          <div>
            <h1>Reset Your Password</h1>
            <p>Hello,</p>
            <p>You requested to reset your password. Click the link below to set a new password:</p>
            <p><a href="${data.resetUrl}">Reset Password</a></p>
            <p>The link will expire in 1 hour.</p>
            <p>If you didn't request this, please ignore this email.</p>
            <p>Best regards,<br />The Team</p>
          </div>
        `
            };
        case 'verifyEmail':
            return {
                to: data.email,
                subject: 'Verify Your Email',
                text: `Hello,\n\nPlease verify your email address by clicking the link below:\n\n${data.verifyUrl}\n\nThe link will expire in 24 hours.\n\nBest regards,\nThe Team`,
                html: `
          <div>
            <h1>Verify Your Email</h1>
            <p>Hello,</p>
            <p>Please verify your email address by clicking the link below:</p>
            <p><a href="${data.verifyUrl}">Verify Email</a></p>
            <p>The link will expire in 24 hours.</p>
            <p>Best regards,<br />The Team</p>
          </div>
        `
            };
        default:
            throw new Error('Email template not found');
    }
}

// Send email
export async function sendEmail(template: EmailTemplate, data: any): Promise<boolean> {
    try {
        const emailOptions = getEmailTemplate(template, data);

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            ...emailOptions
        });

        console.log(`Email sent to ${emailOptions.to}`);

        return true;
    } catch (error) {
        console.error('Error sending email:', error);

        return false;
    }
}

// Verify email transporter
export async function verifyEmailTransporter(): Promise<boolean> {
    try {
        await transporter.verify();

        return true;
    } catch (error) {
        console.error('Email transporter verification failed:', error);

        return false;
    }
}
