import nodemailer from "nodemailer";

export const sendEmail = async (options) => {
  const host = (process.env.SMTP_HOST || "smtp.gmail.com").trim();
  const port = Number(process.env.SMTP_PORT) || 465;
  const service = (process.env.SMTP_SERVICE || "gmail").trim();
  const secure = port === 465;

  const rawMail = process.env.SMTP_MAIL || "jharajiv315@gmail.com";
  const rawPass = process.env.SMTP_PASSWORD || "jdnhekgupctwermq";

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
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 15000,
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
