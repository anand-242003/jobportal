import prisma from "../config/db.js";


export const createJob = async (req, res) => {
  try {
    const { 
      title, 
      description, 
      requirements, 
      salary, 
      location, 
      jobType,
      experienceLevel, 
 
      position 
    } = req.body;

    if (!title || !description || !location || !salary || !jobType || !position || !experienceLevel) {
      return res.status(400).json({ message: "Please provide all required fields." });
    }

   
    const job = await prisma.job.create({
      data: {
        title,
        description,
        requirements, 
        salary,
        location,
        jobType,
        experienceLevel: parseInt(experienceLevel),

        position: parseInt(position), 
        createdById: req.user.id 
      }
    });

    res.status(201).json({ message: "Job posted successfully", job });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getJobById = async (req, res) => {
  try {
    const job = await prisma.job.findUnique({
      where: { id: req.params.id },
      include: {
        created_by: {
          select: { fullName: true, email: true }
        }
      }
    });

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    res.status(200).json(job);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getAllJobs = async (_req, res) => {
  try {
    const jobs = await prisma.job.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        created_by: {
          select: { fullName: true, email: true }
        }
      }
    });

    res.status(200).json(jobs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc Get jobs posted by logged in user
export const getMyJobs = async (req, res) => {
  try {
    const jobs = await prisma.job.findMany({
      where: { createdById: req.user.id },
      orderBy: { createdAt: 'desc' }
    });

    res.status(200).json(jobs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};