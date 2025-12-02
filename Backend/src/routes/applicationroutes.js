import express from "express";
import { applyForJob, getJobApplications, getMyApplications, updateApplicationStatus, deleteApplication } from "../controllers/applicationController.js";
import { authmiddleware, roleMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/:jobId", authmiddleware, roleMiddleware(["Student", "Seeker"]), applyForJob);
router.get("/job/:jobId", authmiddleware, roleMiddleware(["Employer", "Admin"]), getJobApplications);
router.get("/my-applications", authmiddleware, getMyApplications);
router.put("/:applicationId/status", authmiddleware, roleMiddleware(["Employer", "Admin"]), updateApplicationStatus);
router.delete("/:applicationId", authmiddleware, deleteApplication);

export default router;