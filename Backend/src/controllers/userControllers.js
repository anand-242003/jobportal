import prisma from "../config/db.js";
import jwt from "jsonwebtoken";
export const getUserProfiledata = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        profileBio: true,
        skills: true,
        resume: true,
        profilePhoto: true,
        phoneNumber: true,
      },
    });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const updateUserProfile = async (req, res) => {
  try {
    const { fullName, profileBio, skills, phoneNumber } = req.body;
    const updatedUser = await prisma.user.update({
        where: { id: req.user.id },
        data:{
            fullName,profileBio,skills,phoneNumber
        },
        select: {
            id: true,
            email: true,
            fullName: true,
            role: true,
            profileBio: true,
            skills: true,
            phoneNumber: true,
          },

    })
    res.status(200).json({ message: "Profile updated successfully", user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
