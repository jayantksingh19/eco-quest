import bcrypt from "bcryptjs";
import twilio from "twilio";
import nodemailer from "nodemailer";
import sgMail from "@sendgrid/mail";
import OtpToken from "../models/OtpToken.js";

const OTP_LENGTH = Number.parseInt(process.env.OTP_LENGTH ?? "6", 10);
const OTP_EXPIRY_MINUTES = Number.parseInt(process.env.OTP_EXPIRY_MINUTES ?? "10", 10);
const OTP_MAX_ATTEMPTS = Number.parseInt(process.env.OTP_MAX_ATTEMPTS ?? "5", 10);
const otpDebugFlag = process.env.OTP_DEBUG;
const OTP_DEBUG =
  otpDebugFlag === "true" || (otpDebugFlag !== "false" && process.env.NODE_ENV !== "production");

const EMAIL_PROVIDER_RAW = (process.env.EMAIL_PROVIDER ?? "").trim().toLowerCase();
const ACTIVE_EMAIL_PROVIDER =
  EMAIL_PROVIDER_RAW === "sendgrid" || EMAIL_PROVIDER_RAW === "smtp"
    ? EMAIL_PROVIDER_RAW
    : process.env.SENDGRID_API_KEY
      ? "sendgrid"
      : "smtp";
const DEFAULT_EMAIL_FOOTER = "Stay curious, stay green! 🌱";

const escapeHtml = (value = "") =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

export const renderBrandedEmail = ({
  heading = "EcoQuest update",
  previewText = "",
  introHtml = "",
  bodyHtml = "",
  highlightValue,
  highlightLabel = "Code",
  closingHtml = "",
  cta,
  footerNote = DEFAULT_EMAIL_FOOTER,
}) => {
  const preview = previewText
    ? `<div class="preview-text">${escapeHtml(previewText)}</div>`
    : '<div class="preview-text"></div>';

  const highlightBlock = highlightValue
    ? `<div class="highlight">
        <span class="highlight-label">${escapeHtml(highlightLabel)}</span>
        <div class="highlight-value">${escapeHtml(highlightValue)}</div>
      </div>`
    : "";

  const ctaBlock =
    cta && cta.href && cta.label
      ? `<p style="text-align:center;margin:32px 0 0;">
            <a class="cta-button" href="${escapeHtml(cta.href)}" target="_blank" rel="noopener">
              ${escapeHtml(cta.label)}
            </a>
         </p>`
      : "";

  const closingBlock = closingHtml
    ? `<div class="closing">${closingHtml}</div>`
    : `<div class="closing"><p>${footerNote}</p></div>`;

  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="color-scheme" content="light" />
    <title>${escapeHtml(heading)}</title>
    <style>
      :root { color-scheme: light; font-synthesis: none; }
      * { box-sizing: border-box; }
      body {
        margin: 0;
        padding: 0;
        background: #eef5f1;
        font-family: "Inter", "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        color: #243026;
      }
      .preview-text {
        display: none;
        max-height: 0;
        overflow: hidden;
        font-size: 1px;
        color: transparent;
      }
      .wrapper {
        width: 100%;
        padding: 24px 16px;
      }
      .card {
        max-width: 560px;
        margin: 0 auto;
        background: #ffffff;
        border-radius: 18px;
        box-shadow: 0 18px 40px rgba(28, 92, 72, 0.16);
        border-top: 6px solid #34c759;
        padding: 36px;
      }
      h1 {
        font-size: 26px;
        margin: 0 0 12px;
        color: #1d513c;
        letter-spacing: -0.02em;
      }
      .subtitle {
        font-size: 16px;
        line-height: 1.6;
        color: #475b4d;
        margin-bottom: 24px;
      }
      .content {
        font-size: 16px;
        line-height: 1.7;
        color: #314338;
      }
      .highlight {
        margin: 28px 0;
        padding: 20px 24px;
        border-radius: 16px;
        background: linear-gradient(135deg, #22c55e, #16a34a);
        color: #ffffff;
        text-align: center;
        box-shadow: 0 10px 25px rgba(22, 163, 74, 0.25);
      }
      .highlight-label {
        display: block;
        opacity: 0.85;
        font-size: 12px;
        letter-spacing: 2.4px;
        text-transform: uppercase;
        margin-bottom: 6px;
      }
      .highlight-value {
        font-size: 30px;
        letter-spacing: 8px;
        font-weight: 700;
      }
      .cta-button {
        display: inline-block;
        padding: 14px 28px;
        background: #15803d;
        color: #ffffff !important;
        border-radius: 999px;
        text-decoration: none;
        font-weight: 600;
        letter-spacing: 0.4px;
        box-shadow: 0 10px 24px rgba(21, 128, 61, 0.25);
      }
      .cta-button:hover {
        background: #166534;
      }
      .closing {
        margin-top: 32px;
        color: #516553;
        font-size: 15px;
      }
      footer {
        text-align: center;
        font-size: 13px;
        color: #708274;
        margin-top: 28px;
      }
      footer a {
        color: #14804a;
        text-decoration: none;
        font-weight: 600;
      }
      @media (max-width: 600px) {
        .card {
          padding: 28px 20px;
        }
        .highlight-value {
          letter-spacing: 6px;
          font-size: 26px;
        }
      }
    </style>
  </head>
  <body>
    ${preview}
    <div class="wrapper">
      <div class="card">
        <h1>${escapeHtml(heading)}</h1>
        ${introHtml ? `<div class="subtitle">${introHtml}</div>` : ""}
        ${highlightBlock}
        <div class="content">
          ${bodyHtml || ""}
        </div>
        ${ctaBlock}
        ${closingBlock}
      </div>
      <footer>
        ${footerNote}
      </footer>
    </div>
  </body>
</html>`;
};

const buildOtpEmailHtml = ({ code, message, purpose }) =>
  renderBrandedEmail({
    heading: "Your EcoQuest verification code",
    previewText: message,
    introHtml:
      "<p>Here is the secure code you requested to continue your EcoQuest journey.</p>",
    highlightValue: code,
    highlightLabel: purpose === "login" ? "Login Code" : "Verification Code",
    bodyHtml: `<p>${message}</p><p style="margin-top:16px;">This code expires in <strong>${OTP_EXPIRY_MINUTES} minutes</strong>. Enter it on EcoQuest to continue.</p><p style="margin-top:16px;">If you didn't request this, simply ignore this email—your account is still safe.</p>`,
    closingHtml: "<p>See you inside,<br/><strong>The EcoQuest Team</strong></p>",
  });

const generateNumericOtp = (length) => {
  const digits = "0123456789";
  let code = "";
  for (let index = 0; index < length; index += 1) {
    const randomIndex = Math.floor(Math.random() * digits.length);
    code += digits[randomIndex];
  }
  return code;
};

let twilioClient;
const getTwilioClient = () => {
  if (twilioClient !== undefined) return twilioClient;
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;

  if (!accountSid || !authToken) {
    if (OTP_DEBUG) {
      twilioClient = null;
      return null;
    }
    throw new Error("Twilio credentials are not configured");
  }

  twilioClient = twilio(accountSid, authToken);
  return twilioClient;
};

export const sendSms = async ({ to, body }) => {
  const client = getTwilioClient();
  if (!client) {
    console.info(`[otpService] OTP_DEBUG enabled, skipping SMS send to ${to}. Message: ${body}`);
    return false;
  }

  const messagingServiceSid = process.env.TWILIO_MESSAGING_SERVICE_SID;
  const from = process.env.TWILIO_FROM_NUMBER;

  if (!messagingServiceSid && !from) {
    throw new Error("Twilio sender (from number or messaging service SID) is not configured");
  }

  const payload = {
    to,
    body,
  };

  if (!payload.to.startsWith("+")) {
    console.warn(`[otpService] SMS destination missing country code, attempting to send as-is: ${payload.to}`);
  }

  if (messagingServiceSid) {
    payload.messagingServiceSid = messagingServiceSid;
  } else {
    payload.from = from;
  }

  if (OTP_DEBUG) {
    console.info(`[otpService] Sending SMS via Twilio`, payload);
  }

  try {
    await client.messages.create(payload);
    return true;
  } catch (error) {
    console.error(`[otpService] Failed to send SMS to ${to}`, error);
    return false;
  }
};

let emailTransporter;
const getEmailTransporter = () => {
  if (emailTransporter !== undefined) return emailTransporter;

  if (ACTIVE_EMAIL_PROVIDER === "sendgrid") {
    emailTransporter = null;
    return null;
  }

  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT ? Number.parseInt(process.env.SMTP_PORT, 10) : undefined;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !port || !user || !pass) {
    if (OTP_DEBUG) {
      emailTransporter = null;
      return null;
    }
    throw new Error("SMTP credentials are not configured");
  }

  emailTransporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: {
      user,
      pass,
    },
  });

  return emailTransporter;
};

let sendGridFromAddress = null;
let sendGridConfigured;
const getSendGridSettings = () => {
  if (sendGridConfigured !== undefined) {
    return sendGridConfigured ? { from: sendGridFromAddress } : null;
  }

  const apiKey = process.env.SENDGRID_API_KEY;
  const from = process.env.SENDGRID_FROM ?? process.env.EMAIL_FROM;

  if (!apiKey || !from) {
    if (OTP_DEBUG) {
      sendGridConfigured = false;
      return null;
    }
    throw new Error("SendGrid credentials are not configured");
  }

  sgMail.setApiKey(apiKey);
  sendGridFromAddress = from;
  sendGridConfigured = true;
  return { from };
};

export const sendEmail = async ({ to, subject, text, html, attachments }) => {
  if (ACTIVE_EMAIL_PROVIDER === "sendgrid") {
    const config = getSendGridSettings();
    if (!config) {
      console.info(
        `[otpService] OTP_DEBUG enabled, skipping email send to ${to}. Subject: ${subject}`
      );
      return;
    }

    const emailPayload = {
      to,
      from: config.from,
      subject,
      text,
      html,
    };

    if (Array.isArray(attachments) && attachments.length) {
      emailPayload.attachments = attachments.map((item) => ({
        content: item.content?.toString("base64"),
        filename: item.filename,
        type: item.contentType,
        disposition: "attachment",
      }));
    }

    if (OTP_DEBUG) {
      console.info("[otpService] Sending email via SendGrid", {
        to,
        subject,
        hasAttachments: Boolean(emailPayload.attachments?.length),
      });
    }

    await sgMail.send(emailPayload);
    return;
  }

  const transporter = getEmailTransporter();
  if (!transporter) {
    console.info(`[otpService] OTP_DEBUG enabled, skipping email send to ${to}. Subject: ${subject}`);
    return;
  }

  const from = process.env.EMAIL_FROM ?? process.env.SMTP_USER;
  await transporter.sendMail({
    from,
    to,
    subject,
    text,
    html,
    attachments,
  });
};

export const issueOtp = async ({
  userId,
  userRole,
  identifier,
  purpose,
  channel,
  template,
  codeOverride,
  emailFallback,
}) => {
  const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);
  const code = codeOverride ?? generateNumericOtp(OTP_LENGTH);
  const codeHash = await bcrypt.hash(code, 10);

  await OtpToken.findOneAndUpdate(
    { userId, userRole, identifier, purpose, channel },
    {
      userId,
      userRole,
      identifier,
      purpose,
      channel,
      codeHash,
      expiresAt,
      consumed: false,
      attempts: 0,
    },
    {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true,
    }
  );

  const message = template ? template(code) : `Your verification code is ${code}`;

  let deliveryChannel = channel;

  if (channel === "sms") {
    const sent = await sendSms({ to: identifier, body: message });
    if (!sent) {
      if (emailFallback?.to) {
        const emailMessage = emailFallback.template ? emailFallback.template(code) : message;
        const htmlTemplate = buildOtpEmailHtml({ code, message: emailMessage, purpose });
        await sendEmail({
          to: emailFallback.to,
          subject: emailFallback.subject ?? "Your EcoQuest verification code",
          text: emailMessage,
          html: htmlTemplate,
        });
        deliveryChannel = "email";
      }
    }
  } else if (channel === "email") {
    const htmlTemplate = buildOtpEmailHtml({ code, message, purpose });
    await sendEmail({
      to: identifier,
      subject: "Your EcoQuest verification code",
      text: message,
      html: htmlTemplate,
    });
    deliveryChannel = "email";
  }

  return { code, expiresAt, deliveryChannel };
};

export const verifyOtp = async ({ identifier, purpose, channel, code }) => {
  const record = await OtpToken.findOne({
    identifier,
    purpose,
    channel,
    consumed: false,
  }).select("+codeHash userId userRole expiresAt attempts");

  if (!record) {
    return { valid: false, reason: "not_found" };
  }

  if (record.expiresAt.getTime() < Date.now()) {
    record.consumed = true;
    await record.save();
    return { valid: false, reason: "expired" };
  }

  if (record.attempts >= OTP_MAX_ATTEMPTS) {
    record.consumed = true;
    await record.save();
    return { valid: false, reason: "too_many_attempts" };
  }

  const isMatch = await bcrypt.compare(String(code), record.codeHash);
  if (!isMatch) {
    record.attempts += 1;
    await record.save();
    return { valid: false, reason: "invalid" };
  }

  record.consumed = true;
  await record.save();

  return {
    valid: true,
    userId: record.userId,
    userRole: record.userRole,
    identifier: record.identifier,
    purpose,
    channel,
  };
};

export const revokeOtp = async ({ identifier, purpose, channel }) => {
  await OtpToken.updateMany({ identifier, purpose, channel }, { consumed: true });
};

export const revokeUserOtp = async ({ userId, purpose }) => {
  await OtpToken.updateMany({ userId, purpose }, { consumed: true });
};