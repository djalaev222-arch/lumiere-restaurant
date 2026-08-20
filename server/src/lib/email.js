import nodemailer from 'nodemailer';

let transporter = null;

export function isEmailConfigured() {
  return Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);
}

function getTransporter() {
  if (transporter) return transporter;
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });
  return transporter;
}

// Never throws — a notification failure must never break the booking/order
// flow that triggered it. Falls back to a console log when SMTP isn't
// configured, so the dev flow is visible without needing real credentials.
export async function sendEmail({ to, subject, html }) {
  if (!isEmailConfigured()) {
    console.log(`[email:mock] to=${to} subject="${subject}"`);
    return;
  }

  try {
    await getTransporter().sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to,
      subject,
      html,
    });
  } catch (error) {
    console.error('Failed to send email:', error.message);
  }
}
