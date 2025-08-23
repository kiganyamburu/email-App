import { RequestHandler } from "express";
import nodemailer from "nodemailer";
import {
  SendEmailRequest,
  SendEmailResponse,
  EmailHistoryItem,
} from "@shared/api";

// In-memory storage for email history (in production, use a database)
const emailHistory: EmailHistoryItem[] = [];

// Create reusable transporter object using SMTP transport
const createTransporter = () => {
  // For development, you can use a service like Ethereal Email for testing
  // or configure with your SMTP settings
  return nodemailer.createTransporter({
    host: process.env.SMTP_HOST || "smtp.ethereal.email",
    port: parseInt(process.env.SMTP_PORT || "587"),
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER || "ethereal.user@ethereal.email",
      pass: process.env.SMTP_PASS || "ethereal.pass",
    },
  });
};

// Email templates
const getEmailTemplate = (template: string, data: any) => {
  switch (template) {
    case "notification":
      return {
        subject: `Notification: ${data.subject}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">Notification</h2>
            <p>${data.message}</p>
            <hr>
            <p style="color: #666; font-size: 12px;">This is an automated notification from your app.</p>
          </div>
        `,
      };
    case "password-reset":
      return {
        subject: "Password Reset Request",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">Password Reset</h2>
            <p>You have requested to reset your password. Click the link below to proceed:</p>
            <a href="${data.resetLink}" style="background: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Reset Password</a>
            <p style="margin-top: 20px;">If you didn't request this, please ignore this email.</p>
            <hr>
            <p style="color: #666; font-size: 12px;">This email will expire in 24 hours.</p>
          </div>
        `,
      };
    default:
      return {
        subject: data.subject,
        html: data.isHtml ? data.message : `<p>${data.message}</p>`,
      };
  }
};

export const handleSendEmail: RequestHandler = async (req, res) => {
  try {
    const { to, subject, message, isHtml, template }: SendEmailRequest =
      req.body;

    // Validation
    if (!to || !Array.isArray(to) || to.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Recipients (to) field is required and must be an array",
      } as SendEmailResponse);
    }

    if (!subject || !message) {
      return res.status(400).json({
        success: false,
        message: "Subject and message are required",
      } as SendEmailResponse);
    }

    // Create transporter
    const transporter = createTransporter();

    // Get email content based on template or use custom content
    const emailContent = template
      ? getEmailTemplate(template, { subject, message, resetLink: message })
      : getEmailTemplate("default", { subject, message, isHtml });

    // Create email ID for tracking
    const emailId = `email_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Create email history entry
    const historyItem: EmailHistoryItem = {
      id: emailId,
      to,
      subject: emailContent.subject,
      status: "pending",
      sentAt: new Date().toISOString(),
    };

    emailHistory.unshift(historyItem);

    // Send email
    const info = await transporter.sendMail({
      from: process.env.FROM_EMAIL || '"Email App" <noreply@emailapp.com>',
      to: to.join(", "),
      subject: emailContent.subject,
      html: emailContent.html,
    });

    // Update history with success
    historyItem.status = "sent";

    console.log("Email sent: %s", info.messageId);

    res.json({
      success: true,
      message: "Email sent successfully",
      emailId,
    } as SendEmailResponse);
  } catch (error) {
    console.error("Email sending error:", error);

    // Update history with error if emailId exists
    const lastEmail = emailHistory[0];
    if (lastEmail && lastEmail.status === "pending") {
      lastEmail.status = "failed";
      lastEmail.error =
        error instanceof Error ? error.message : "Unknown error";
    }

    res.status(500).json({
      success: false,
      message:
        "Failed to send email: " +
        (error instanceof Error ? error.message : "Unknown error"),
    } as SendEmailResponse);
  }
};

export const handleEmailHistory: RequestHandler = (_req, res) => {
  res.json(emailHistory.slice(0, 50)); // Return last 50 emails
};

export const handleEmailTest: RequestHandler = async (_req, res) => {
  try {
    const transporter = createTransporter();
    await transporter.verify();
    res.json({ success: true, message: "Email configuration is valid" });
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        "Email configuration error: " +
        (error instanceof Error ? error.message : "Unknown error"),
    });
  }
};
