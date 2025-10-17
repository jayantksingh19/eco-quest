import bcrypt from "bcryptjs";
import Student from "../models/Student.js";
import Teacher from "../models/Teacher.js";
import School from "../models/School.js";
import { generateToken } from "../utils/token.js";
import { issueOtp, verifyOtp, revokeUserOtp } from "../utils/otpService.js";

const sanitizeSchoolInput = (value = "") => value.trim();

const otpDebugFlag = process.env.OTP_DEBUG;
const OTP_DEBUG =
  otpDebugFlag === "true" || (otpDebugFlag !== "false" && process.env.NODE_ENV !== "production");

const DEFAULT_COUNTRY_CODE = process.env.DEFAULT_PHONE_COUNTRY_CODE ?? "+91";

const sanitizePhoneNumber = (value = "") => {
  const digitsOnly = value.replace(/[^+\d]/g, "");
  if (!digitsOnly) return "";

  if (digitsOnly.startsWith("+")) {
    const cleaned = `+${digitsOnly.slice(1).replace(/\+/g, "")}`;
    if (OTP_DEBUG) {
      console.info(`[authController] sanitizePhoneNumber input="${value}" output="${cleaned}"`);
    }
    return cleaned;
  }

  const trimmed = digitsOnly.replace(/\+/g, "");
  const countryCode = DEFAULT_COUNTRY_CODE.startsWith("+")
    ? DEFAULT_COUNTRY_CODE
    : `+${DEFAULT_COUNTRY_CODE}`;
  const normalized = `${countryCode}${trimmed}`;
  if (OTP_DEBUG) {
    console.info(`[authController] sanitizePhoneNumber input="${value}" output="${normalized}"`);
  }
  return normalized;
};

const createTeacherResponse = async (teacherDoc) => {
  const doc = await teacherDoc.populate("school", "name code");
  return {
    id: doc._id,
    name: doc.name,
    email: doc.email,
    school: doc.school,
    role: "teacher",
    profileImageUrl: doc.profileImageUrl || null,
    phoneNumber: doc.phoneNumber || "",
    phoneVerified: doc.phoneVerified ?? false,
    wantsNotifications: doc.wantsNotifications ?? true,
    address: doc.address || "",
  };
};

const createStudentResponse = async (studentDoc) => {
  const doc = await studentDoc.populate("school", "name code");
  return {
    id: doc._id,
    name: doc.name,
    email: doc.email,
    grade: doc.grade,
    school: doc.school,
    role: "student",
    progress: doc.progress,
    profileImageUrl: doc.profileImageUrl || null,
    phoneNumber: doc.phoneNumber || "",
    phoneVerified: doc.phoneVerified ?? false,
    wantsNotifications: doc.wantsNotifications ?? true,
    address: doc.address || "",
  };
};

const createUserResponse = async (userDoc, role) => {
  return role === "teacher"
    ? createTeacherResponse(userDoc)
    : createStudentResponse(userDoc);
};

const normalizeEmail = (value = "") => value.trim().toLowerCase();

const findUserByEmail = async (email) => {
  const normalizedEmail = normalizeEmail(email);
  if (!normalizedEmail) return null;

  const teacher = await Teacher.findOne({ email: normalizedEmail });
  if (teacher) {
    return { user: teacher, role: "teacher", identifier: normalizedEmail };
  }

  const student = await Student.findOne({ email: normalizedEmail });
  if (student) {
    return { user: student, role: "student", identifier: normalizedEmail };
  }

  return null;
};

const findUserByPhone = async (phoneNumber) => {
  const sanitized = sanitizePhoneNumber(phoneNumber);
  if (!sanitized) return null;

  const teacher = await Teacher.findOne({ phoneNumber: sanitized });
  if (teacher) {
    return { user: teacher, role: "teacher", identifier: sanitized };
  }

  const student = await Student.findOne({ phoneNumber: sanitized });
  if (student) {
    return { user: student, role: "student", identifier: sanitized };
  }

  return null;
};

const assembleAuthPayload = async (userDoc, userRole) => {
  const token = generateToken({ userId: userDoc._id, role: userRole });

  if (userRole === "teacher") {
    const schoolId = userDoc.school?._id ?? userDoc.school;
    const students = schoolId
      ? await Student.find({ school: schoolId })
          .select("name email grade progress")
          .lean()
      : [];

    return {
      user: await createTeacherResponse(userDoc),
      token,
      students,
    };
  }

  return {
    user: await createStudentResponse(userDoc),
    token,
  };
};

const recordFailedLogin = async (userDoc) => {
  userDoc.loginFailedAttempts = (userDoc.loginFailedAttempts ?? 0) + 1;
  userDoc.lastLoginFailedAt = new Date();
  await userDoc.save();
  return userDoc.loginFailedAttempts;
};

const resetFailedLogin = async (userDoc) => {
  if ((userDoc.loginFailedAttempts ?? 0) > 0 || userDoc.lastLoginFailedAt) {
    userDoc.loginFailedAttempts = 0;
    userDoc.lastLoginFailedAt = undefined;
    await userDoc.save();
  }
};

const isEmailIdentifier = (value) => value.includes("@");

export const registerTeacher = async (req, res) => {
  try {
    const { name, email, password, schoolName, schoolCode } = req.body;

    if (!name || !email || !password || !schoolName || !schoolCode) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const normalizedEmail = email.toLowerCase();
    const normalizedCode = sanitizeSchoolInput(schoolCode).toUpperCase();

    const existingTeacher = await Teacher.findOne({ email: normalizedEmail });
    if (existingTeacher) {
      return res.status(409).json({ message: "Teacher with this email already exists." });
    }

    let school = await School.findOne({ code: normalizedCode });
    if (!school) {
      school = await School.create({
        name: schoolName.trim(),
        code: normalizedCode,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const teacher = await Teacher.create({
      name,
      email: normalizedEmail,
      password: hashedPassword,
      school: school._id,
    });

    const token = generateToken({ userId: teacher._id, role: "teacher" });

    return res.status(201).json({
      user: await createTeacherResponse(teacher),
      token,
    });
  } catch (error) {
    console.error("registerTeacher error", error);
    return res.status(500).json({ message: "Failed to register teacher." });
  }
};

export const registerStudent = async (req, res) => {
  try {
    const { name, email, password, grade, schoolCode } = req.body;

    if (!name || !email || !password || !schoolCode) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const normalizedEmail = email.toLowerCase();
    const normalizedCode = sanitizeSchoolInput(schoolCode).toUpperCase();

    const school = await School.findOne({ code: normalizedCode });
    if (!school) {
      return res.status(404).json({
        message: "School not found. Ask your teacher to register the school first.",
      });
    }

    const existingStudent = await Student.findOne({ email: normalizedEmail });
    if (existingStudent) {
      return res.status(409).json({ message: "Student with this email already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const student = await Student.create({
      name,
      email: normalizedEmail,
      password: hashedPassword,
      grade,
      school: school._id,
    });

    const token = generateToken({ userId: student._id, role: "student" });

    return res.status(201).json({
      user: await createStudentResponse(student),
      token,
    });
  } catch (error) {
    console.error("registerStudent error", error);
    return res.status(500).json({ message: "Failed to register student." });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    const normalizedEmail = normalizeEmail(email);

    let user;
    let userRole = role;

    if (role === "teacher") {
      user = await Teacher.findOne({ email: normalizedEmail }).populate("school");
    } else if (role === "student") {
      user = await Student.findOne({ email: normalizedEmail }).populate("school");
    } else {
      user =
        (await Teacher.findOne({ email: normalizedEmail }).populate("school")) ||
        (await Student.findOne({ email: normalizedEmail }).populate("school"));
      if (user) {
        const modelName = user.constructor?.modelName;
        userRole = modelName === "Teacher" ? "teacher" : "student";
      }
    }

    if (!user && role === "student") {
      user = await Teacher.findOne({ email: normalizedEmail }).populate("school");
      if (user) {
        userRole = "teacher";
      }
    }

    if (!user && role === "teacher") {
      user = await Student.findOne({ email: normalizedEmail }).populate("school");
      if (user) {
        userRole = "student";
      }
    }

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      const attempts = await recordFailedLogin(user);
      return res.status(401).json({
        message: "Invalid credentials.",
        canResetPassword: attempts >= 2,
      });
    }

    await resetFailedLogin(user);

    const payload = await assembleAuthPayload(user, userRole);
    return res.json(payload);
  } catch (error) {
    console.error("login error", error);
    return res.status(500).json({ message: "Failed to log in." });
  }
};

export const requestLoginOtp = async (req, res) => {
  try {
    const { identifier } = req.body;

    if (!identifier || typeof identifier !== "string") {
      return res.status(400).json({ message: "Identifier is required." });
    }

    const trimmedIdentifier = identifier.trim();

    if (isEmailIdentifier(trimmedIdentifier)) {
      const lookup = await findUserByEmail(trimmedIdentifier);
      if (!lookup) {
        return res.status(404).json({ message: "Account not found." });
      }

      const { user, role: userRole, identifier: normalizedEmail } = lookup;

      const { code, expiresAt, deliveryChannel } = await issueOtp({
        userId: user._id,
        userRole,
        identifier: normalizedEmail,
        purpose: "login",
        channel: "email",
        template: (otpCode) => `Your EcoQuest login code is ${otpCode}`,
      });

    if (OTP_DEBUG) {
      console.info(
        `[authController] login OTP (email) generated for user ${user._id}: ****${String(code).slice(-2)}`
      );
    }

    return res.json({
      message: "OTP sent to your email address.",
      channel: deliveryChannel,
      expiresAt,
    });
    }

    const lookup = await findUserByPhone(trimmedIdentifier);
    if (!lookup) {
      return res.status(404).json({ message: "Account not found." });
    }

    const { user, role: userRole, identifier: phoneNumber } = lookup;

    if (!user.phoneVerified) {
      return res.status(400).json({
        message: "Phone number is not verified. Please verify it from profile settings before using OTP login.",
      });
    }

    const { code, expiresAt, deliveryChannel } = await issueOtp({
      userId: user._id,
      userRole,
      identifier: phoneNumber,
      purpose: "login",
      channel: "sms",
      template: (otpCode) => `EcoQuest login code: ${otpCode}`,
      emailFallback: user.email
        ? {
            to: user.email,
            subject: "Your EcoQuest login code",
            template: (otpCode) => `EcoQuest login code: ${otpCode}`,
          }
        : undefined,
    });

    if (OTP_DEBUG) {
      console.info(
        `[authController] login OTP (sms/email fallback) generated for user ${user._id}: ****${String(code).slice(-2)} via ${deliveryChannel}`
      );
    }

    return res.json({
      message:
        deliveryChannel === "email"
          ? "OTP sent to your email address."
          : "OTP sent to your mobile number.",
      channel: deliveryChannel,
      expiresAt,
    });
  } catch (error) {
    console.error("requestLoginOtp error", error);
    return res.status(500).json({ message: "Failed to send login OTP." });
  }
};

export const verifyLoginOtp = async (req, res) => {
  try {
    const { identifier, code } = req.body;

    if (!identifier || !code) {
      return res.status(400).json({ message: "Identifier and OTP code are required." });
    }

    const channel = isEmailIdentifier(identifier) ? "email" : "sms";
    const normalizedIdentifier =
      channel === "email" ? normalizeEmail(identifier) : sanitizePhoneNumber(identifier);

    if (!normalizedIdentifier) {
      return res.status(400).json({ message: "Invalid identifier provided." });
    }

    const verification = await verifyOtp({
      identifier: normalizedIdentifier,
      purpose: "login",
      channel,
      code: String(code),
    });

    if (!verification.valid) {
      const messageMap = {
        expired: "OTP has expired. Please request a new one.",
        too_many_attempts: "Too many incorrect attempts. Please request a new OTP.",
        invalid: "Invalid OTP.",
        not_found: "No OTP request found.",
      };
      const message = messageMap[verification.reason] ?? "Failed to verify OTP.";
      return res.status(400).json({ message });
    }

    const Model = verification.userRole === "teacher" ? Teacher : Student;
    const user = await Model.findById(verification.userId).populate("school");

    if (!user) {
      return res.status(404).json({ message: "Account not found." });
    }

    await resetFailedLogin(user);
    await revokeUserOtp({ userId: user._id, purpose: "login" });

    const payload = await assembleAuthPayload(user, verification.userRole);
    return res.json(payload);
  } catch (error) {
    console.error("verifyLoginOtp error", error);
    return res.status(500).json({ message: "Failed to verify login OTP." });
  }
};

export const requestPasswordResetOtp = async (req, res) => {
  try {
    const { identifier } = req.body;

    if (!identifier || typeof identifier !== "string") {
      return res.status(400).json({ message: "Identifier is required." });
    }

    const trimmedIdentifier = identifier.trim();

    const lookup = isEmailIdentifier(trimmedIdentifier)
      ? await findUserByEmail(trimmedIdentifier)
      : await findUserByPhone(trimmedIdentifier);

    if (!lookup) {
      return res.status(404).json({ message: "Account not found." });
    }

    const { user, role: userRole } = lookup;
    const channels = [];

    await revokeUserOtp({ userId: user._id, purpose: "password_reset" });

    const emailIdentifier = normalizeEmail(user.email);
    let code;
    let expiresAt;

    try {
      const emailResult = await issueOtp({
        userId: user._id,
        userRole,
        identifier: emailIdentifier,
        purpose: "password_reset",
        channel: "email",
        template: (otpCode) => `Use ${otpCode} to reset your EcoQuest password.`,
      });
      code = emailResult.code;
      expiresAt = emailResult.expiresAt;
      const emailChannel = emailResult.deliveryChannel ?? "email";
      if (!channels.includes(emailChannel)) {
        channels.push(emailChannel);
      }
    } catch (error) {
      console.error("requestPasswordResetOtp email error", error);
      return res.status(500).json({ message: "Failed to send password reset email." });
    }

    if (user.phoneVerified && user.phoneNumber) {
      try {
        const smsResult = await issueOtp({
          userId: user._id,
          userRole,
          identifier: user.phoneNumber,
          purpose: "password_reset",
          channel: "sms",
          template: (otpCode) => `Reset your EcoQuest password with code: ${otpCode}`,
          codeOverride: code,
          emailFallback: {
            to: user.email,
            subject: "Your EcoQuest password reset code",
            template: (otpCode) => `Reset your EcoQuest password with code: ${otpCode}`,
          },
        });
        if (smsResult.deliveryChannel === "sms") {
          channels.push("sms");
        } else if (smsResult.deliveryChannel === "email" && !channels.includes("email")) {
          channels.push("email");
        }
      } catch (error) {
        console.error("requestPasswordResetOtp sms error", error);
        // Don't fail the entire request; user can still use email.
      }
    }

    if (OTP_DEBUG) {
      console.info(
        `[authController] password reset OTP generated for user ${user._id}: ****${String(code).slice(-2)} channels=${channels.join(",")}`
      );
    }

    return res.json({
      message:
        channels.length > 1
          ? "OTP sent to your email and mobile number."
          : "OTP sent to your email address.",
      channels,
      expiresAt,
    });
  } catch (error) {
    console.error("requestPasswordResetOtp error", error);
    return res.status(500).json({ message: "Failed to send password reset OTP." });
  }
};

export const resetPasswordWithOtp = async (req, res) => {
  try {
    const { identifier, code, newPassword } = req.body;

    if (!identifier || !code || !newPassword) {
      return res.status(400).json({ message: "Identifier, OTP code, and new password are required." });
    }

    if (typeof newPassword !== "string" || newPassword.trim().length < 8) {
      return res.status(400).json({ message: "New password must be at least 8 characters long." });
    }

    const channel = isEmailIdentifier(identifier) ? "email" : "sms";
    const normalizedIdentifier =
      channel === "email" ? normalizeEmail(identifier) : sanitizePhoneNumber(identifier);

    if (!normalizedIdentifier) {
      return res.status(400).json({ message: "Invalid identifier provided." });
    }

    const verification = await verifyOtp({
      identifier: normalizedIdentifier,
      purpose: "password_reset",
      channel,
      code: String(code),
    });

    if (!verification.valid) {
      const messageMap = {
        expired: "OTP has expired. Please request a new one.",
        too_many_attempts: "Too many incorrect attempts. Please request a new OTP.",
        invalid: "Invalid OTP.",
        not_found: "No OTP request found.",
      };
      const message = messageMap[verification.reason] ?? "Failed to verify OTP.";
      return res.status(400).json({ message });
    }

    const Model = verification.userRole === "teacher" ? Teacher : Student;
    const user = await Model.findById(verification.userId);

    if (!user) {
      return res.status(404).json({ message: "Account not found." });
    }

    const isSamePassword = await bcrypt.compare(newPassword, user.password);
    if (isSamePassword) {
      return res.status(400).json({ message: "New password must be different from the current password." });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.loginFailedAttempts = 0;
    user.lastLoginFailedAt = undefined;
    await user.save();

    await revokeUserOtp({ userId: user._id, purpose: "password_reset" });

    return res.json({ message: "Password reset successfully." });
  } catch (error) {
    console.error("resetPasswordWithOtp error", error);
    return res.status(500).json({ message: "Failed to reset password." });
  }
};

export const getProfile = async (req, res) => {
  try {
    const { userDoc, userRole } = req;

    if (!userDoc || !userRole) {
      return res.status(401).json({ message: "Authentication required." });
    }

    return res.json({
      user: await createUserResponse(userDoc, userRole),
    });
  } catch (error) {
    console.error("getProfile error", error);
    return res.status(500).json({ message: "Failed to load profile." });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { userDoc, userRole } = req;

    if (!userDoc || !userRole) {
      return res.status(401).json({ message: "Authentication required." });
    }

    const {
      name,
      profileImageUrl,
      wantsNotifications,
      address,
      phoneNumber,
      grade,
    } = req.body;

    if (typeof name === "string" && name.trim()) {
      userDoc.name = name.trim();
    }

    if (typeof profileImageUrl === "string") {
      userDoc.profileImageUrl = profileImageUrl.trim();
    } else if (profileImageUrl === null) {
      userDoc.profileImageUrl = "";
    }

    if (typeof wantsNotifications === "boolean") {
      userDoc.wantsNotifications = wantsNotifications;
    }

    if (typeof address === "string") {
      userDoc.address = address.trim();
    } else if (address === null) {
      userDoc.address = "";
    }

    if (typeof phoneNumber === "string") {
      const sanitized = sanitizePhoneNumber(phoneNumber);
      userDoc.phoneNumber = sanitized;
      userDoc.phoneVerified = false;
      userDoc.phoneVerification = undefined;
    } else if (phoneNumber === null) {
      userDoc.phoneNumber = "";
      userDoc.phoneVerified = false;
      userDoc.phoneVerification = undefined;
    }

    if (userRole === "student") {
      if (typeof grade === "string") {
        userDoc.grade = grade.trim();
      } else if (grade === null) {
        userDoc.grade = "";
      }
    }

    await userDoc.save();

    return res.json({
      user: await createUserResponse(userDoc, userRole),
    });
  } catch (error) {
    console.error("updateProfile error", error);
    return res.status(500).json({ message: "Failed to update profile." });
  }
};

export const sendPhoneOtp = async (req, res) => {
  try {
    const { userDoc, userRole } = req;

    if (!userDoc || !userRole) {
      return res.status(401).json({ message: "Authentication required." });
    }

    const { phoneNumber } = req.body;
    const sanitized = sanitizePhoneNumber(phoneNumber);

    if (!sanitized) {
      return res.status(400).json({ message: "Phone number is required." });
    }
    userDoc.phoneNumber = sanitized;
    userDoc.phoneVerified = false;
    userDoc.phoneVerification = undefined;

    await userDoc.save();

    const { code, expiresAt, deliveryChannel } = await issueOtp({
      userId: userDoc._id,
      userRole,
      identifier: sanitized,
      purpose: "phone_verification",
      channel: "sms",
      template: (otpCode) => `EcoQuest verification code: ${otpCode}`,
      emailFallback: userDoc.email
        ? {
            to: userDoc.email,
            subject: "Verify your phone number for EcoQuest",
            template: (otpCode) => `EcoQuest verification code: ${otpCode}`,
          }
        : undefined,
    });

    if (OTP_DEBUG) {
      console.info(
        `[authController] phone verification OTP generated for user ${userDoc._id}: ****${String(code).slice(-2)} via ${deliveryChannel}`
      );
    }

    return res.json({
      message:
        deliveryChannel === "email"
          ? "OTP sent to your email address."
          : "OTP sent to your mobile number.",
      channel: deliveryChannel,
      expiresAt,
    });
  } catch (error) {
    console.error("sendPhoneOtp error", error);
    return res.status(500).json({ message: "Failed to send OTP." });
  }
};

export const verifyPhoneOtp = async (req, res) => {
  try {
    const { userDoc, userRole } = req;

    if (!userDoc || !userRole) {
      return res.status(401).json({ message: "Authentication required." });
    }

    const { code } = req.body;

    if (!code) {
      return res.status(400).json({ message: "OTP code is required." });
    }

    const phoneIdentifier = userDoc.phoneNumber;

    if (!phoneIdentifier) {
      return res.status(400).json({ message: "No phone number on record." });
    }

    const verificationResult = await verifyOtp({
      identifier: phoneIdentifier,
      purpose: "phone_verification",
      channel: "sms",
      code: String(code),
    });

    if (!verificationResult.valid) {
      const messageMap = {
        expired: "OTP has expired. Please request a new one.",
        too_many_attempts: "Too many incorrect attempts. Please request a new OTP.",
        invalid: "Invalid OTP.",
        not_found: "No OTP request found.",
      };
      const message = messageMap[verificationResult.reason] ?? "Failed to verify OTP.";
      return res.status(400).json({ message });
    }

    userDoc.phoneVerified = true;
    userDoc.phoneVerification = undefined;
    await userDoc.save();

    await revokeUserOtp({ userId: userDoc._id, purpose: "phone_verification" });

    return res.json({
      user: await createUserResponse(userDoc, userRole),
      message: "Phone number verified successfully.",
    });
  } catch (error) {
    console.error("verifyPhoneOtp error", error);
    return res.status(500).json({ message: "Failed to verify OTP." });
  }
};

export const updatePassword = async (req, res) => {
  try {
    const { userDoc } = req;

    if (!userDoc) {
      return res.status(401).json({ message: "Authentication required." });
    }

    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Current and new passwords are required." });
    }

    const isMatch = await bcrypt.compare(currentPassword, userDoc.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect." });
    }

    if (currentPassword === newPassword) {
      return res.status(400).json({ message: "New password must be different from the current password." });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    userDoc.password = hashedPassword;
    await userDoc.save();

    return res.json({ message: "Password updated successfully." });
  } catch (error) {
    console.error("updatePassword error", error);
    return res.status(500).json({ message: "Failed to update password." });
  }
};
