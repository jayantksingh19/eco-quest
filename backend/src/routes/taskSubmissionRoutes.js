import { Router } from "express";
import multer from "multer";
import { submitTaskProof } from "../controllers/taskSubmissionController.js";

const router = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024,
    files: 1,
  },
});

router.post("/submissions", upload.array("photo", 1), submitTaskProof);

export default router;
