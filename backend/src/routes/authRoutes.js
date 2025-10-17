import { Router } from "express";
import {
  registerTeacher,
  registerStudent,
  login,
  getProfile,
  updateProfile,
  sendPhoneOtp,
  verifyPhoneOtp,
  updatePassword,
  requestLoginOtp,
  verifyLoginOtp,
  requestPasswordResetOtp,
  resetPasswordWithOtp,
} from "../controllers/authController.js";
import authenticate from "../middleware/authMiddleware.js";

const router = Router();

router.post("/register/teacher", registerTeacher);
router.post("/register/student", registerStudent);
router.post("/login", login);
router.post("/login/request-otp", requestLoginOtp);
router.post("/login/verify-otp", verifyLoginOtp);
router.get("/me", authenticate, getProfile);
router.put("/me", authenticate, updateProfile);
router.put("/me/password", authenticate, updatePassword);
router.post("/phone/send-otp", authenticate, sendPhoneOtp);
router.post("/phone/verify", authenticate, verifyPhoneOtp);
router.post("/password/request-otp", requestPasswordResetOtp);
router.post("/password/reset", resetPasswordWithOtp);

export default router;
