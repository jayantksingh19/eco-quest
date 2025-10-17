import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import hazardRoutes from "./routes/hazardRoutes.js";
import taskSubmissionRoutes from "./routes/taskSubmissionRoutes.js";

dotenv.config();

const app = express();

const defaultOrigins = [
  "https://eco-quest-1.onrender.com",
  "http://localhost:5173",
  "http://127.0.0.1:5173",
];

const allowedOrigins = (
  process.env.CORS && process.env.CORS.trim().length > 0
    ? process.env.CORS
    : defaultOrigins.join(",")
)
  .split(",")
  .map((value) => value.trim())
  .filter(Boolean);

const corsOptions = {
  origin: (origin, callback) => {
    if (
      !origin ||
      allowedOrigins.length === 0 ||
      allowedOrigins.includes("*") ||
      allowedOrigins.includes(origin)
    ) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.use(express.json());
app.options(/^\/api\/.*$/, cors(corsOptions));

app.get("/health", (_req, res) => {
  res.json({
     status: "ok",
     message: "Lee bhai main toh chal gaya!!! ab bol bro??💦" 
    });
});

app.use("/api/auth", authRoutes);
app.use("/api/hazards", hazardRoutes);
app.use("/api/tasks", taskSubmissionRoutes);

const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`✅ Han bhai yahi chal raha hun main: http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Server startup failed", error);
    process.exit(1);
  });