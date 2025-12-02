import express from "express";
import { createJob, getAllJobs, getJobById, getMyJobs, updateJob, deleteJob } from "../controllers/jobController.js";
import { authmiddleware, roleMiddleware } from "../middlewares/authMiddleware.js";
import { validateJobCreation } from "../middlewares/validation.js";

const router = express.Router();

router.route("/")
  .post(authmiddleware, roleMiddleware(["Employer", "Admin"]), validateJobCreation, createJob)
  .get(getAllJobs);
router.get("/my-jobs", authmiddleware, getMyJobs);
router.route("/:id")
  .get(getJobById)
  .put(authmiddleware, roleMiddleware(["Employer", "Admin"]), updateJob)
  .delete(authmiddleware, roleMiddleware(["Employer", "Admin"]), deleteJob);

export default router;
