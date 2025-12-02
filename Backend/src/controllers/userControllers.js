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

    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(file.mimetype)) {
      return res.status(400).json({ message: "Invalid file type. Please upload PDF, DOC, or DOCX files only." });
    }

    if (file.size > 5 * 1024 * 1024) {
      return res.status(400).json({ message: "File size exceeds 5MB limit" });
    }

    const result = await imagekit.upload({
      file: file.buffer,
      fileName: `resume_${req.user.id}_${Date.now()}_${file.originalname}`,
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
        email: true,
        fullName: true,
        role: true,
        profileBio: true,
        skills: true,
        resume: true,
        resumeOriginalname: true,
        profilePhoto: true,
        phoneNumber: true,
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

    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
    if (!allowedTypes.includes(file.mimetype)) {
      return res.status(400).json({ message: "Invalid file type. Please upload JPEG, PNG, or WEBP images only." });
    }

    const result = await imagekit.upload({
      file: file.buffer,
      fileName: `profile_${req.user.id}_${Date.now()}`,
      folder: "/avatars",
    });

    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: {
        profilePhoto: result.url,
      },
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        profileBio: true,
        skills: true,
        resume: true,
        resumeOriginalname: true,
        profilePhoto: true,
        phoneNumber: true,
      },
    });

    res.status(200).json({ message: "Profile photo uploaded successfully", user: updatedUser });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ message: "Upload failed", error: error.message });
  }
};
