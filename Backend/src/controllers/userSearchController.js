import prisma from "../config/db.js";

export const searchUsers = async (req, res) => {
    try {
        const userId = req.user.id;
        const { search, role } = req.query;

        const query = {
            id: { not: userId }, 
        };

        if (role) {
            query.role = role;
        }

        if (search) {
            query.OR = [
                { fullName: { contains: search, mode: 'insensitive' } },
                { email: { contains: search, mode: 'insensitive' } },
            ];
        }

        const users = await prisma.user.findMany({
            where: query,
            select: {
                id: true,
                fullName: true,
                email: true,
                profilePhoto: true,
                role: true,
            },
            take: 20,
            orderBy: {
                fullName: 'asc'
            }
        });

        res.status(200).json(users);
    } catch (error) {
        console.error("Search users error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
