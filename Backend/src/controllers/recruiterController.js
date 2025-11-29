import prisma from "../config/db.js";

export const getDashboardStats = async (req, res) => {
    try {
        const userId = req.user.id;

        const totalJobs = await prisma.job.count({
            where: { createdById: userId },
        });

        const totalApplications = await prisma.application.count({
            where: {
                job: {
                    createdById: userId,
                },
            },
        });

        const recentApplications = await prisma.application.findMany({
            where: {
                job: {
                    createdById: userId,
                },
            },
            take: 5,
            orderBy: { createdAt: "desc" },
            include: {
                job: {
                    select: { title: true },
                },
                applicant: {
                    select: { fullName: true, email: true },
                },
            },
        });

        res.status(200).json({
            totalJobs,
            totalApplications,
            recentApplications,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const getJobStats = async (req, res) => {
    try {
        const userId = req.user.id;

        const jobStats = await prisma.job.findMany({
            where: { createdById: userId },
            select: {
                id: true,
                title: true,
                _count: {
                    select: { applications: true },
                },
            },
            orderBy: { createdAt: "desc" },
        });

        const formattedStats = jobStats.map((job) => ({
            id: job.id,
            title: job.title,
            applicationsCount: job._count.applications,
        }));

        res.status(200).json(formattedStats);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
