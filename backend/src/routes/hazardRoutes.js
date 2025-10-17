import { Router } from "express";
import multer from "multer";
import { createHazardReport } from "../controllers/hazardController.js";

const router = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024,
    files: 5,
  },
});

router.post("/", upload.array("attachments", 5), createHazardReport);

export default router;
