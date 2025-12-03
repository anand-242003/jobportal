import express from "express";
import { saveJob, unsaveJob, getMySavedJobs, checkIfSaved } from "../controllers/savedJobController.js";
import { authmiddleware, roleMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

// All routes require authentication and job seeker role
router.use(authmiddleware);
router.use(roleMiddleware(["Student", "Seeker"]));

router.get("/my-saved-jobs", getMySavedJobs);
router.get("/check/:jobId", checkIfSaved);
router.post("/:jobId", saveJob);
router.delete("/:jobId", unsaveJob);

export default router;
