import express from "express";
import { createJob, getAllJobs, getJobById, getMyJobs } from "../controllers/jobController.js";
import { authmiddleware } from "../middlewares/authMiddleware.js"; 

const router = express.Router();

router.route("/").post(authmiddleware, createJob).get(getAllJobs);
// Add this before the /:id route to avoid conflict
router.get("/my-jobs", authmiddleware, getMyJobs);
router.route("/:id").get(getJobById);
export default router;
