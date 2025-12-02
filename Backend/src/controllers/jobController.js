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

export const getAllJobs = async (req, res) => {
  try {
    const {
      search,
      sort,
      location,
      jobType,
      experienceLevel,
      datePosted,
      page = 1,
      limit = 10
    } = req.query;

    const query = {};

    if (search) {
      query.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { location: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (location) {
      query.location = { contains: location, mode: 'insensitive' };
    }

    if (jobType) {
      query.jobType = jobType;
    }

    if (experienceLevel) {
      query.experienceLevel = { gte: parseInt(experienceLevel) };
    }

    if (datePosted) {
      const now = new Date();
      let dateThreshold;

      switch (datePosted) {
        case '24h':
          dateThreshold = new Date(now.setDate(now.getDate() - 1));
          break;
        case '7d':
          dateThreshold = new Date(now.setDate(now.getDate() - 7));
          break;
        case '30d':
          dateThreshold = new Date(now.setDate(now.getDate() - 30));
          break;
        default:
          dateThreshold = null;
      }

      if (dateThreshold) {
        query.createdAt = { gte: dateThreshold };
      }
    }

    let orderBy = {};
    if (sort === 'newest') {
      orderBy = { createdAt: 'desc' };
    } else if (sort === 'oldest') {
      orderBy = { createdAt: 'asc' };
    } else if (sort === 'salary') {
      orderBy = { salary: 'desc' };
    } else {
      orderBy = { createdAt: 'desc' };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [jobs, totalCount] = await Promise.all([
      prisma.job.findMany({
        where: query,
        orderBy,
        skip,
        take: parseInt(limit),
        include: {
          created_by: {
            select: {
              fullName: true,
              email: true,
            }
          }
        }
      }),
      prisma.job.count({ where: query })
    ]);

    const totalPages = Math.ceil(totalCount / parseInt(limit));

    res.status(200).json({
      jobs,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalJobs: totalCount,
        hasMore: parseInt(page) < totalPages
      }
    });

  } catch (error) {
    console.error("Get jobs error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

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

export const updateJob = async (req, res) => {
  try {
    const { id } = req.params;
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

    const job = await prisma.job.findUnique({ where: { id } });

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    if (job.createdById !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to update this job" });
    }

    const updateData = {};
    if (title) updateData.title = title;
    if (description) updateData.description = description;
    if (requirements) updateData.requirements = requirements;
    if (salary) updateData.salary = salary;
    if (location) updateData.location = location;
    if (jobType) updateData.jobType = jobType;
    if (experienceLevel) updateData.experienceLevel = parseInt(experienceLevel);
    if (position) updateData.position = parseInt(position);

    const updatedJob = await prisma.job.update({
      where: { id },
      data: updateData
    });

    res.status(200).json({ message: "Job updated successfully", job: updatedJob });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const deleteJob = async (req, res) => {
  try {
    const { id } = req.params;

    const job = await prisma.job.findUnique({ where: { id } });

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    if (job.createdById !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to delete this job" });
    }

    await prisma.$transaction(async (tx) => {
      await tx.application.deleteMany({ where: { jobId: id } });
      await tx.job.delete({ where: { id } });
    });

    res.status(200).json({ message: "Job deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};