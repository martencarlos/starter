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
    const currentYear = new Date().getFullYear();

    switch (template) {
        case 'welcome':
            return {
                to: data.email,
                subject: 'Welcome to Our App',
                text: `Hello ${data.name},\n\nWelcome to our app! We're excited to have you on board.\n\nBest regards,\nThe Team`,
                html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
                  <div style="text-align: center; margin-bottom: 30px;">
                    <h1 style="color: #6366f1; margin-bottom: 10px;">Welcome to Our App</h1>
                    <p style="font-size: 16px;">We're excited to have you with us!</p>
                  </div>
                  
                  <div style="background-color: #f9fafb; padding: 20px; border-radius: 10px; border: 1px solid #e5e7eb;">
                    <h2 style="margin-top: 0;">Hello ${data.name},</h2>
                    
                    <p>Thank you for creating an account with us. We're thrilled to have you as part of our community!</p>
                    
                    <p>You can now log in to your account and start exploring all the features and benefits our platform has to offer.</p>
                    
                    <div style="text-align: center; margin: 30px 0;">
                      <a href="${process.env.NEXTAUTH_URL}/login" style="background-color: #6366f1; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">Sign In to Your Account</a>
                    </div>
                  </div>
                  
                  <div style="text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px;">
                    <p>This is an automated email, please do not reply to this message.</p>
                    <p>&copy; ${currentYear} Our App. All rights reserved.</p>
                  </div>
                </div>
                `
            };
        case 'resetPassword':
            return {
                to: data.email,
                subject: 'Reset Your Password',
                text: `Hello,\n\nYou requested to reset your password. Click the link below to set a new password:\n\n${data.resetUrl}\n\nThe link will expire in 1 hour.\n\nIf you didn't request this, please ignore this email.\n\nBest regards,\nThe Team`,
                html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
                  <div style="text-align: center; margin-bottom: 30px;">
                    <h1 style="color: #6366f1; margin-bottom: 10px;">Password Reset</h1>
                    <p style="font-size: 16px;">Follow the instructions to reset your password</p>
                  </div>
                  
                  <div style="background-color: #f9fafb; padding: 20px; border-radius: 10px; border: 1px solid #e5e7eb;">
                    <h2 style="margin-top: 0;">Reset Your Password</h2>
                    
                    <p>We received a request to reset the password for your account. To create a new password, click the button below:</p>
                    
                    <div style="text-align: center; margin: 30px 0;">
                      <a href="${data.resetUrl}" style="background-color: #6366f1; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">Reset Password</a>
                    </div>
                    
                    <p>If you didn't request a password reset, you can ignore this email and your password will remain unchanged.</p>
                    
                    <p>For security reasons, this link will expire in 1 hour.</p>
                  </div>
                  
                  <div style="text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px;">
                    <p>This is an automated email, please do not reply to this message.</p>
                    <p>&copy; ${currentYear} Our App. All rights reserved.</p>
                  </div>
                </div>
                `
            };
        case 'verifyEmail':
            return {
                to: data.email,
                subject: 'Verify Your Email',
                text: `Hello,\n\nPlease verify your email address by clicking the link below:\n\n${data.verifyUrl}\n\nThe link will expire in 24 hours.\n\nBest regards,\nThe Team`,
                html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
                  <div style="text-align: center; margin-bottom: 30px;">
                    <h1 style="color: #6366f1; margin-bottom: 10px;">Verify Your Email</h1>
                    <p style="font-size: 16px;">One quick step to activate your account</p>
                  </div>
                  
                  <div style="background-color: #f9fafb; padding: 20px; border-radius: 10px; border: 1px solid #e5e7eb;">
                    <h2 style="margin-top: 0;">Email Verification</h2>
                    
                    <p>Thank you for creating an account. To complete your registration and activate your account, please verify your email address by clicking the button below:</p>
                    
                    <div style="text-align: center; margin: 30px 0;">
                      <a href="${data.verifyUrl}" style="background-color: #6366f1; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">Verify Email</a>
                    </div>
                    
                    <p>If the button doesn't work, you can also copy and paste the following link into your browser:</p>
                    <p style="background-color: #e5e7eb; padding: 10px; border-radius: 5px; word-break: break-all; font-size: 14px;">${data.verifyUrl}</p>
                    
                    <p>For security reasons, this link will expire in 24 hours.</p>
                  </div>
                  
                  <div style="text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px;">
                    <p>This is an automated email, please do not reply to this message.</p>
                    <p>&copy; ${currentYear} Our App. All rights reserved.</p>
                  </div>
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
