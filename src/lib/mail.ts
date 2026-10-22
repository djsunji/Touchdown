import nodemailer, { type Transporter } from "nodemailer";

// Optional email (weekly digest). Configure your company SMTP relay via environment:
// SMTP_HOST, SMTP_PORT (587), SMTP_USER, SMTP_PASSWORD, SMTP_SECURE ("true" for port 465), MAIL_FROM.
// Without SMTP_HOST no email is sent; the digest is still shown in the app.
export function mailEnabled() {
  return !!process.env.SMTP_HOST && !!process.env.MAIL_FROM;
}

let transport: Transporter | null = null;

export async function sendMail(to: string, subject: string, text: string, html: string) {
  if (!mailEnabled()) throw new Error("SMTP ist nicht konfiguriert");
  transport ??= nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === "true",
    auth: process.env.SMTP_USER ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD } : undefined,
    // Only plain content we build ourselves: no file or URL attachments
    disableFileAccess: true,
    disableUrlAccess: true,
  });
  await transport.sendMail({ from: process.env.MAIL_FROM, to, subject, text, html });
}

export function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
}
