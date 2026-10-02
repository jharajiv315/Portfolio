import nodemailer from "nodemailer";

export const sendEmail = async (options) => {
  // Method 1: Resend HTTP REST API over HTTPS (Port 443 - 100% bypasses Render Free SMTP port blockage)
  if (process.env.RESEND_API_KEY) {
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY.trim()}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: process.env.RESEND_FROM || "Rajiv Jha <onboarding@resend.dev>",
          to: [options.email],
          subject: options.subject,
          text: options.message,
          html: options.html,
          reply_to: options.replyTo,
        }),
      });

      if (res.ok) {
        return await res.json();
      }
      const errData = await res.json();
      console.warn("Resend API returned error, trying fallback:", errData);
    } catch (apiErr) {
      console.warn("Resend fetch failed, trying fallback:", apiErr.message);
    }
  }

  // Method 2: Brevo HTTP REST API over HTTPS (Port 443)
  if (process.env.BREVO_API_KEY) {
    try {
      const res = await fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: {
          "api-key": process.env.BREVO_API_KEY.trim(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sender: { name: "Rajiv Jha — Portfolio", email: "jharajiv315@gmail.com" },
          to: [{ email: options.email }],
          subject: options.subject,
          textContent: options.message,
          htmlContent: options.html,
          replyTo: options.replyTo ? { email: options.replyTo } : undefined,
        }),
      });

      if (res.ok) {
        return await res.json();
      }
    } catch (brevoErr) {
      console.warn("Brevo API failed:", brevoErr.message);
    }
  }

  // Method 3: Direct Gmail SMTP (Works on local dev and paid tiers where ports 465/587 are unblocked)
  const host = (process.env.SMTP_HOST || "smtp.gmail.com").trim();
  const port = Number(process.env.SMTP_PORT) || 465;
  const service = (process.env.SMTP_SERVICE || "gmail").trim();
  const secure = port === 465;

  const rawMail = process.env.SMTP_MAIL || "jharajiv315@gmail.com";
  const rawPass = process.env.SMTP_PASSWORD || "";

  // Sanitize: strip any accidental spaces or wrapping quotes from the App Password
  const smtpMail = rawMail.trim().replace(/["']/g, "");
  const smtpPass = rawPass.replace(/[\s"']/g, "");

  if (!smtpMail || !smtpPass) {
    const error = new Error(
      "Gmail SMTP credentials (SMTP_MAIL or SMTP_PASSWORD) are missing."
    );
    error.code = "SMTP_NOT_CONFIGURED";
    throw error;
  }

  const transporter = nodemailer.createTransport({
    service,
    host,
    port,
    secure,
    connectionTimeout: 4000,
    greetingTimeout: 4000,
    socketTimeout: 5000,
    auth: {
      user: smtpMail,
      pass: smtpPass,
    },
  });

  const fromAddress =
    options.from ||
    `${process.env.SMTP_FROM_NAME || "Rajiv Jha — Portfolio"} <${smtpMail}>`;

  const mailOptions = {
    from: fromAddress,
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.html,
    replyTo: options.replyTo,
  };

  return await transporter.sendMail(mailOptions);
};

export default sendEmail;
