import express from "express";
import { getDashboardStats, getJobStats } from "../controllers/recruiterController.js";
import { authmiddleware, roleMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.use(authmiddleware);
router.use(roleMiddleware(["Employer"]));

router.get("/stats", getDashboardStats);
router.get("/job-stats", getJobStats);

export default router;
