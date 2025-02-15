// utils/mailer.ts
import nodemailer, { Transporter } from "nodemailer";
import dotenv from "dotenv";
import { config } from "../config";

// Load environment variables
dotenv.config();

// Define an interface for the email options
interface EmailOptions {
  to: string;
  subject: string;
  text: string;
  html?: string; // Optional HTML content
}

// Create a transporter using environment variables
const transporter: Transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: config.user_email as string, // Type assertion
    pass: config.email_pass as string, // Type assertion
  },
});

// Verify transporter configuration (optional)
transporter.verify(function (error, success) {
  if (error) {
    console.error("Email transporter error:", error);
  } else {
    console.log("Email transporter is ready");
  }
});

// Send email utility function
export const sendMail = async (emailOptions: EmailOptions) => {
  const { to, subject, text, html } = emailOptions;

  try {
    const info = await transporter.sendMail({
      from: `"Recipe-World" <${process.env.EMAIL_USER}>`, //
      to,
      subject,
      text,
      html,
    });

    console.log("Email sent: %s", info.messageId);
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};
