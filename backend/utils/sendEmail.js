import nodemailer from "nodemailer";

export const sendEmail = async (options) => {
  const host = process.env.SMTP_HOST || "smtp.gmail.com";
  const port = Number(process.env.SMTP_PORT) || 465;
  const service = process.env.SMTP_SERVICE || "gmail";
  const secure = port === 465;

  if (!process.env.SMTP_MAIL || !process.env.SMTP_PASSWORD) {
    const error = new Error(
      "Gmail SMTP credentials (SMTP_MAIL or SMTP_PASSWORD) are not configured in server environment variables."
    );
    error.code = "SMTP_NOT_CONFIGURED";
    throw error;
  }

  const transporter = nodemailer.createTransport({
    service,
    host,
    port,
    secure,
    connectionTimeout: 8000,
    greetingTimeout: 8000,
    socketTimeout: 10000,
    auth: {
      user: process.env.SMTP_MAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  const fromAddress =
    options.from ||
    `${process.env.SMTP_FROM_NAME || "Rajiv Jha — Portfolio"} <${process.env.SMTP_MAIL}>`;

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
