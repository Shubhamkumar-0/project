import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { assignClassToStudent} from "../controllers/classController.js";

const router = express.Router();

router.post("/select", protect, assignClassToStudent);
// router.get("/list", protect, getClasses);

export default router;