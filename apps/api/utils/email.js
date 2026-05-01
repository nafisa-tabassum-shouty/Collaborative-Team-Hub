const nodemailer = require("nodemailer");

// Create transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_SECURE === "true", // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

/**
 * Send email notification
 * @param {Object} options - Email options
 * @param {string} options.to - Recipient email
 * @param {string} options.subject - Email subject
 * @param {string} options.html - HTML content
 * @param {string} [options.text] - Plain text content
 */
const sendEmail = async ({ to, subject, html, text }) => {
  try {
    const info = await transporter.sendMail({
      from: `"Collaborative Team Hub" <${process.env.SMTP_USER}>`,
      to,
      subject,
      text: text || "You have a new notification from Collaborative Team Hub",
      html,
    });

    console.log("Email sent: %s", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Error sending email:", error);
    return { success: false, error: error.message };
  }
};

/**
 * Queue-safe async wrapper for non-blocking email sending
 * This will not wait for the email to be sent before continuing execution
 */
const sendEmailAsync = (options) => {
  sendEmail(options).catch((err) => {
    console.error("Async email sending failed:", err);
  });
};

module.exports = {
  sendEmail,
  sendEmailAsync,
};
