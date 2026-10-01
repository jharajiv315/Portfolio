import nodemailer from "nodemailer";

export const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    service: process.env.SMTP_SERVICE,
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: {
      user: process.env.SMTP_MAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  const fromAddress = options.from || `${process.env.SMTP_FROM_NAME || "Rajiv Jha — Portfolio"} <${process.env.SMTP_MAIL}>`;

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
