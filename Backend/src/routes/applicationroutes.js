import express from "express";
import { applyForJob, getJobApplications, getMyApplications, updateApplicationStatus } from "../controllers/applicationController.js";
import { authmiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/:jobId", authmiddleware, applyForJob);
router.get("/job/:jobId", authmiddleware, getJobApplications);
router.get("/my-applications", authmiddleware, getMyApplications);
router.put("/:applicationId/status", authmiddleware, updateApplicationStatus);

export default router;