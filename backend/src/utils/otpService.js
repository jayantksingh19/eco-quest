import bcrypt from "bcryptjs";
import twilio from "twilio";
import nodemailer from "nodemailer";
import OtpToken from "../models/OtpToken.js";

const OTP_LENGTH = Number.parseInt(process.env.OTP_LENGTH ?? "6", 10);
const OTP_EXPIRY_MINUTES = Number.parseInt(process.env.OTP_EXPIRY_MINUTES ?? "10", 10);
const OTP_MAX_ATTEMPTS = Number.parseInt(process.env.OTP_MAX_ATTEMPTS ?? "5", 10);
const otpDebugFlag = process.env.OTP_DEBUG;
const OTP_DEBUG =
  otpDebugFlag === "true" || (otpDebugFlag !== "false" && process.env.NODE_ENV !== "production");

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

export const sendEmail = async ({ to, subject, text, html, attachments }) => {
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
        await sendEmail({
          to: emailFallback.to,
          subject: emailFallback.subject ?? "Your EcoQuest verification code",
          text: emailMessage,
          html: `<p>${emailMessage}</p><p>If you did not request this code, please ignore this message.</p>`,
        });
        deliveryChannel = "email";
      }
    }
  } else if (channel === "email") {
    await sendEmail({
      to: identifier,
      subject: "Your EcoQuest verification code",
      text: message,
      html: `<p>${message}</p>`
        + "<p>If you did not request this code, please ignore this message.</p>",
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
