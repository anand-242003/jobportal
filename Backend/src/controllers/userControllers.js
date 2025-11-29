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
      data: {
        fullName, profileBio, skills, phoneNumber
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

import imagekit from "../utils/imagekit.js";

export const uploadResume = async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const result = await imagekit.upload({
      file: file.buffer,
      fileName: file.originalname,
      folder: "/resumes",
    });

    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: {
        resume: result.url,
        resumeOriginalname: file.originalname,
      },
      select: {
        id: true,
        resume: true,
        resumeOriginalname: true,
      },
    });

    res.status(200).json({ message: "Resume uploaded successfully", user: updatedUser });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ message: "Upload failed", error: error.message });
  }
};

export const uploadProfilePhoto = async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const result = await imagekit.upload({
      file: file.buffer,
      fileName: `profile_${req.user.id}`,
      folder: "/avatars",
    });

    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: {
        profilePhoto: result.url,
      },
      select: {
        id: true,
        profilePhoto: true,
      },
    });

    res.status(200).json({ message: "Profile photo uploaded successfully", user: updatedUser });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ message: "Upload failed", error: error.message });
  }
};
