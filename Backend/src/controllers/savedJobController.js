import prisma from "../config/db.js";

// Save a job
export const saveJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const userId = req.user.id;

    // Check if job exists
    const job = await prisma.job.findUnique({
      where: { id: jobId }
    });

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // Check if already saved
    const existing = await prisma.savedJob.findUnique({
      where: {
        userId_jobId: {
          userId,
          jobId
        }
      }
    });

    if (existing) {
      return res.status(400).json({ message: "Job already saved" });
    }

    // Save the job
    const savedJob = await prisma.savedJob.create({
      data: {
        userId,
        jobId
      }
    });

    res.status(201).json({ 
      message: "Job saved successfully",
      savedJob 
    });
  } catch (error) {
    console.error("Error saving job:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Unsave a job
export const unsaveJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const userId = req.user.id;

    const savedJob = await prisma.savedJob.findUnique({
      where: {
        userId_jobId: {
          userId,
          jobId
        }
      }
    });

    if (!savedJob) {
      return res.status(404).json({ message: "Saved job not found" });
    }

    await prisma.savedJob.delete({
      where: {
        id: savedJob.id
      }
    });

    res.status(200).json({ message: "Job unsaved successfully" });
  } catch (error) {
    console.error("Error unsaving job:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all saved jobs for a user
export const getMySavedJobs = async (req, res) => {
  try {
    const userId = req.user.id;

    const savedJobs = await prisma.savedJob.findMany({
      where: { userId },
      include: {
        job: {
          include: {
            created_by: {
              select: {
                fullName: true,
                email: true
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.status(200).json(savedJobs);
  } catch (error) {
    console.error("Error fetching saved jobs:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Check if a job is saved
export const checkIfSaved = async (req, res) => {
  try {
    const { jobId } = req.params;
    const userId = req.user.id;

    const savedJob = await prisma.savedJob.findUnique({
      where: {
        userId_jobId: {
          userId,
          jobId
        }
      }
    });

    res.status(200).json({ isSaved: !!savedJob });
  } catch (error) {
    console.error("Error checking saved job:", error);
    res.status(500).json({ message: "Server error" });
  }
};
