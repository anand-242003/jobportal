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
      page = 1,
      limit = 10
    } = req.query;

    const query = {};

    if (search) {
      query.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { location: { contains: search, mode: "insensitive" } },
        { created_by: { fullName: { contains: search, mode: "insensitive" } } }
      ];
    }

    if (location) {
      query.location = { contains: location, mode: "insensitive" };
    }
    if (jobType) {
      query.jobType = { equals: jobType, mode: "insensitive" };
    }
    if (experienceLevel) {
      query.experienceLevel = { gte: parseInt(experienceLevel) };
    }

    let orderBy = { createdAt: "desc" };
    if (sort === "oldest") orderBy = { createdAt: "asc" };
    if (sort === "salary_high") orderBy = { salary: "desc" };
    if (sort === "salary_low") orderBy = { salary: "asc" };

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const [jobs, totalJobs] = await Promise.all([
      prisma.job.findMany({
        where: query,
        orderBy: orderBy,
        skip: skip,
        take: limitNum,
        include: {
          created_by: {
            select: { fullName: true, email: true }
          }
        }
      }),
      prisma.job.count({ where: query })
    ]);

    const totalPages = Math.ceil(totalJobs / limitNum);

    res.status(200).json({
      jobs,
      pagination: {
        totalJobs,
        totalPages,
        currentPage: pageNum,
        limit: limitNum
      }
    });

  } catch (error) {
    console.error(error);
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