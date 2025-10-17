import jwt from "jsonwebtoken";
import Teacher from "../models/Teacher.js";
import Student from "../models/Student.js";

export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Authentication required." });
    }

    const token = authHeader.slice(7).trim();
    if (!token) {
      return res.status(401).json({ message: "Authentication required." });
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error("JWT_SECRET is not defined");
    }

    const payload = jwt.verify(token, secret);
    const { userId, role } = payload;

    let userDoc = null;
    let userRole = role;

    if (role === "teacher") {
      userDoc = await Teacher.findById(userId);
    } else if (role === "student") {
      userDoc = await Student.findById(userId);
    } else {
      userDoc = (await Teacher.findById(userId)) ?? (await Student.findById(userId));
      if (userDoc) {
        const modelName = userDoc.constructor?.modelName;
        userRole = modelName === "Teacher" ? "teacher" : "student";
      }
    }

    if (!userDoc) {
      return res.status(401).json({ message: "User not found." });
    }

    req.userDoc = userDoc;
    req.userRole = userRole;
    req.authTokenPayload = payload;

    return next();
  } catch (error) {
    console.error("authenticate error", error);
    const isTokenError = error.name === "TokenExpiredError" || error.name === "JsonWebTokenError";
    const status = isTokenError ? 401 : 500;
    const message = error.name === "TokenExpiredError"
      ? "Session expired. Please log in again."
      : isTokenError
        ? "Invalid authentication token."
        : "Failed to authenticate request.";
    return res.status(status).json({ message });
  }
};

export default authenticate;
