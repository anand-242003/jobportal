import prisma from "../config/db.js";


export const applyForJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    console.log("jobid", jobId)
    const applicantId = req.user.id;

    const job = await prisma.job.findUnique({ where: { id: jobId } });
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    const existingApplication = await prisma.application.findFirst({
      where: {
        jobId: jobId,
        applicantId: applicantId
      }
    });

    if (existingApplication) {
      return res.status(400).json({ message: "You have already applied for this job" });
    }

    const application = await prisma.application.create({
      data: {
        jobId,
        applicantId
      }
    });

    res.status(201).json({ message: "Application submitted successfully", application });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getJobApplications = async (req, res) => {
  try {
    const { jobId } = req.params;
    const employerId = req.user.id;

    const job = await prisma.job.findUnique({
      where: { id: jobId }
    });

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    if (job.createdById !== employerId) {
      return res.status(403).json({ message: "Not authorized to view these applications" });
    }

    const applications = await prisma.application.findMany({
      where: { jobId: jobId },
      include: {
        applicant: {
          select: {
            id: true,
            fullName: true,
            email: true,
            phoneNumber: true,
            skills: true,
            profileBio: true,
            resume: true,
            resumeOriginalname: true,
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.status(200).json(applications);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};