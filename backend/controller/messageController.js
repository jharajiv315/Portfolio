import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/error.js";
import { Message } from "../models/messageSchema.js";
import { User } from "../models/userSchema.js";
import { sendEmail } from "../utils/sendEmail.js";

// Helper: Extract email from text if not passed directly
const extractEmail = (email, messageText) => {
  if (email && typeof email === "string" && email.includes("@")) {
    return email.trim();
  }
  if (!messageText) return "";
  const clientMatch = messageText.match(/Client Email:\s*([^\s\n\r]+)/i);
  if (clientMatch && clientMatch[1]?.includes("@")) {
    return clientMatch[1].trim();
  }
  const generalMatch = messageText.match(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/);
  if (generalMatch && generalMatch[0]) {
    return generalMatch[0].trim();
  }
  return "";
};

// ---------------------------------------------------------------------
// 1. SEND MESSAGE (Client / Portfolio Contact Form)
// ---------------------------------------------------------------------
export const sendMessage = catchAsyncErrors(async (req, res, next) => {
  const { senderName, subject, message } = req.body;
  const rawEmail = req.body.email || req.body.senderEmail;

  if (!senderName || !subject || !message) {
    return next(new ErrorHandler("Please fill all the fields", 400));
  }

  if (senderName.trim().length < 3) {
    return next(new ErrorHandler("Name should be at least 3 characters", 400));
  }

  if (subject.trim().length < 3) {
    return next(new ErrorHandler("Subject should be at least 3 characters", 400));
  }

  if (message.trim().length < 5) {
    return next(new ErrorHandler("Message should be at least 5 characters", 400));
  }

  const senderEmail = extractEmail(rawEmail, message);

  // 1. Store message in Database
  const data = await Message.create({
    senderName: senderName.trim(),
    email: senderEmail,
    subject: subject.trim(),
    message: message.trim(),
  });

  // 2. Dispatch Email Notification to Admin
  try {
    const adminUser = await User.findOne();
    // Destination email explicitly set to jharajiv315@gmail.com
    const adminEmail = process.env.ADMIN_EMAIL || "jharajiv315@gmail.com";

    if (adminEmail) {
      const dashboardUrl = process.env.DASHBOARD_URL || "https://portfolio-dashboard-seven-delta.vercel.app";
      const formattedDate = new Date().toLocaleString("en-US", {
        dateStyle: "full",
        timeStyle: "short",
      });

      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #1c1917; background-color: #f5f3ef; margin: 0; padding: 24px; }
            .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 1px solid #e8e1d5; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.06); }
            .header { background: #b84a1c; color: #ffffff; padding: 24px 32px; text-align: left; }
            .header h1 { margin: 0; font-size: 20px; font-weight: 700; letter-spacing: -0.5px; }
            .header p { margin: 4px 0 0; font-size: 13px; opacity: 0.9; }
            .content { padding: 32px; }
            .field-group { margin-bottom: 20px; }
            .label { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #78716c; margin-bottom: 4px; }
            .value { font-size: 15px; color: #1c1917; font-weight: 500; }
            .message-box { background: #faf7f2; border: 1px solid #e8e1d5; border-radius: 12px; padding: 18px; font-size: 14px; color: #292524; white-space: pre-wrap; line-height: 1.6; margin-top: 8px; }
            .cta-btn { display: inline-block; background: #b84a1c; color: #ffffff !important; text-decoration: none; padding: 12px 24px; border-radius: 9999px; font-weight: 600; font-size: 14px; margin-top: 24px; }
            .footer { border-top: 1px solid #f0eae1; padding: 20px 32px; font-size: 12px; color: #a8a29e; text-align: center; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>📬 New Portfolio Inquiry Received</h1>
              <p>${formattedDate}</p>
            </div>
            <div class="content">
              <div class="field-group">
                <div class="label">Sender Name</div>
                <div class="value">${senderName.trim()}</div>
              </div>
              <div class="field-group">
                <div class="label">Sender Email</div>
                <div class="value">
                  ${senderEmail ? `<a href="mailto:${senderEmail}" style="color: #b84a1c; text-decoration: none; font-weight: 600;">${senderEmail}</a>` : '<span style="color: #a8a29e;">Not provided</span>'}
                </div>
              </div>
              <div class="field-group">
                <div class="label">Subject</div>
                <div class="value">${subject.trim()}</div>
              </div>
              <div class="field-group">
                <div class="label">Message Body</div>
                <div class="message-box">${message.trim()}</div>
              </div>

              <div style="text-align: center;">
                <a href="${dashboardUrl}" class="cta-btn">Open Admin Dashboard & Reply →</a>
              </div>
            </div>
            <div class="footer">
              This is an automated notification from your personal portfolio at Rajiv Jha portfolio system.
            </div>
          </div>
        </body>
        </html>
      `;

      await sendEmail({
        email: adminEmail,
        replyTo: senderEmail || undefined,
        subject: `📬 Portfolio Inquiry: ${subject.trim()} (from ${senderName.trim()})`,
        message: `New message from ${senderName.trim()} (${senderEmail || "No email"}):\n\nSubject: ${subject.trim()}\n\nMessage:\n${message.trim()}\n\nReceived: ${formattedDate}`,
        html: htmlContent,
      });
    }
  } catch (emailErr) {
    // Log error but do not fail the request since database record is successfully saved
    console.error("Warning: Could not deliver admin notification email:", emailErr?.message || emailErr);
  }

  res.status(200).json({
    success: true,
    message: "Message sent successfully",
    data,
  });
});

// ---------------------------------------------------------------------
// 2. GET ALL MESSAGES (Admin Dashboard)
// ---------------------------------------------------------------------
export const getAllMessages = catchAsyncErrors(async (req, res, next) => {
  const messages = await Message.find();
  res.status(200).json({
    success: true,
    messages,
  });
});

// ---------------------------------------------------------------------
// 3. REPLY TO MESSAGE (Admin Dashboard direct email reply)
// ---------------------------------------------------------------------
export const replyMessage = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const { replySubject, replyMessage: rawReply } = req.body;

  if (!rawReply || rawReply.trim().length < 2) {
    return next(new ErrorHandler("Please enter your reply message content.", 400));
  }

  const message = await Message.findById(id);
  if (!message) {
    return next(new ErrorHandler("Message not found", 404));
  }

  // Extract recipient email
  const recipientEmail = extractEmail(message.email, message.message);
  if (!recipientEmail || !recipientEmail.includes("@")) {
    return next(
      new ErrorHandler(
        "Cannot send email: this message does not contain a valid sender email address.",
        400
      )
    );
  }

  // Get admin user profile details
  const adminUser = await User.findById(req.user.id);
  const adminName = adminUser?.fullName || "Rajiv Jha";
  const adminEmail = adminUser?.email || process.env.SMTP_MAIL;

  const emailSubject = replySubject && replySubject.trim()
    ? replySubject.trim()
    : `Re: ${message.subject}`;

  const cleanReply = rawReply.trim();
  const sentDate = new Date().toLocaleString("en-US", {
    dateStyle: "full",
    timeStyle: "short",
  });

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #1c1917; background-color: #f5f3ef; margin: 0; padding: 24px; }
        .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 1px solid #e8e1d5; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.06); }
        .header { background: #b84a1c; color: #ffffff; padding: 24px 32px; }
        .header h1 { margin: 0; font-size: 20px; font-weight: 700; }
        .header p { margin: 4px 0 0; font-size: 13px; opacity: 0.9; }
        .content { padding: 32px; }
        .greeting { font-size: 16px; font-weight: 600; margin-bottom: 16px; color: #1c1917; }
        .reply-text { font-size: 15px; line-height: 1.7; color: #292524; white-space: pre-wrap; margin-bottom: 28px; }
        .quote-box { background: #faf7f2; border-left: 4px solid #b84a1c; border-radius: 8px; padding: 16px 20px; margin-top: 24px; }
        .quote-title { font-size: 11px; text-transform: uppercase; font-weight: 700; color: #78716c; margin-bottom: 8px; }
        .quote-body { font-size: 13px; color: #57534e; white-space: pre-wrap; line-height: 1.5; }
        .signature { margin-top: 32px; padding-top: 20px; border-top: 1px solid #e8e1d5; font-size: 14px; color: #44403c; }
        .signature strong { color: #1c1917; font-size: 15px; }
        .footer { border-top: 1px solid #f0eae1; padding: 18px 32px; font-size: 12px; color: #a8a29e; text-align: center; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>${adminName}</h1>
          <p>Portfolio Inquiry Response · ${sentDate}</p>
        </div>
        <div class="content">
          <div class="greeting">Hi ${message.senderName || "there"},</div>

          <div class="reply-text">${cleanReply}</div>

          <div class="quote-box">
            <div class="quote-title">In Reference to Your Original Message:</div>
            <div style="font-weight: 600; font-size: 13px; margin-bottom: 6px; color: #292524;">Subject: ${message.subject}</div>
            <div class="quote-body">${message.message}</div>
          </div>

          <div class="signature">
            Warm regards,<br>
            <strong>${adminName}</strong><br>
            <span style="color: #78716c; font-size: 13px;">Software & AIML Engineer</span><br>
            <a href="https://portfolio-beta-ochre-90.vercel.app" style="color: #b84a1c; text-decoration: none; font-size: 13px; font-weight: 500;">portfolio-beta-ochre-90.vercel.app</a>
          </div>
        </div>
        <div class="footer">
          You received this email because you sent an inquiry through Rajiv Jha's portfolio contact form.
        </div>
      </div>
    </body>
    </html>
  `;

  // 1. Dispatch Email to Sender if SMTP is available
  let emailDelivered = false;
  let deliveryWarning = null;

  try {
    await sendEmail({
      email: recipientEmail,
      replyTo: adminEmail,
      from: `${adminName} <${process.env.SMTP_MAIL || adminEmail}>`,
      subject: emailSubject,
      message: `${cleanReply}\n\n---\nOriginal message from ${message.senderName}:\nSubject: ${message.subject}\n\n${message.message}`,
      html: htmlContent,
    });
    emailDelivered = true;
  } catch (emailErr) {
    console.warn("Nodemailer reply dispatch failed:", emailErr?.message || emailErr);
    deliveryWarning =
      emailErr?.code === "SMTP_NOT_CONFIGURED"
        ? "Gmail SMTP credentials (SMTP_PASSWORD) are not yet set in Render environment variables."
        : (emailErr?.message || "Email server connection issue");
  }

  // 2. Mark as replied in database with audit record so the response is NEVER lost
  const updatedMessage = await Message.findByIdAndUpdateReply(id, {
    replyMessage: cleanReply,
    repliedAt: new Date(),
  });

  // 3. Construct direct mailto URI for instant 1-click mail client fallback
  const mailtoUrl = `mailto:${encodeURIComponent(recipientEmail)}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(cleanReply)}`;

  if (emailDelivered) {
    return res.status(200).json({
      success: true,
      message: `Reply email delivered successfully to ${recipientEmail}`,
      data: updatedMessage,
      emailDelivered: true,
    });
  }

  return res.status(200).json({
    success: true,
    message: "Reply saved in dashboard successfully!",
    data: updatedMessage,
    emailDelivered: false,
    deliveryWarning,
    mailtoUrl,
  });
});

// ---------------------------------------------------------------------
// 4. DELETE MESSAGE
// ---------------------------------------------------------------------
export const deleteMessage = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const message = await Message.findById(id);

  if (!message) {
    return next(new ErrorHandler("Message not found", 400));
  }

  await message.deleteOne();
  res.status(200).json({
    success: true,
    message: "Message deleted successfully",
  });
});