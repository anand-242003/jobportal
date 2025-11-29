import express from "express";
import { applyForJob, getJobApplications } from "../controllers/applicationController.js";
import { authmiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/:jobId", authmiddleware, applyForJob);
router.get("/job/:jobId", authmiddleware, getJobApplications);

export default router;