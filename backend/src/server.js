import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import hazardRoutes from "./routes/hazardRoutes.js";
import taskSubmissionRoutes from "./routes/taskSubmissionRoutes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({
     status: "ok",
     message: "Lee behendchod main toh chal gaya!!! ab bol bsdk??💦" 
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
