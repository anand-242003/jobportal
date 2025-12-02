import { comparePassword, hashPassword } from "../utils/hash.js";
import prisma from "../config/db.js";
import { generateToken } from "../utils/generateToken.js";
import { RefreshToken } from "../utils/generateToken.js";
import jwt from "jsonwebtoken";

export const signup = async (req, res) => {
  try {
    const { fullName, email, password, phoneNumber, role, skills } = req.body;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const existingPhone = await prisma.user.findUnique({ where: { phoneNumber } });
    if (existingPhone) {
      return res.status(400).json({ message: "Phone number already exists" });
    }

    const hashed = await hashPassword(password);
    const formattedRole = role
      ? role.charAt(0).toUpperCase() + role.slice(1).toLowerCase()
      : "Student";

    const newUser = await prisma.user.create({
      data: {
        fullName,
        email,
        password: hashed,
        phoneNumber,
        role: formattedRole,
        skills: skills || [],
      }
    });

    const token = generateToken(newUser);
    const refreshToken = RefreshToken(newUser);

    await prisma.user.update({
      where: { id: newUser.id },
      data: { refreshToken: refreshToken }
    });

    const isProduction = process.env.NODE_ENV === 'production';

    res.cookie("token", token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      maxAge: 15 * 60 * 1000,
      path: "/",
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/",
    });

    res.status(201).json({
      message: "User registered successfully",
      user: { id: newUser.id, fullName: newUser.fullName, email: newUser.email },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};


export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    const token = generateToken(user);
    const refreshToken = RefreshToken(user);

    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken: refreshToken }
    });

    const isProduction = process.env.NODE_ENV === 'production';

    res.cookie("token", token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      maxAge: 15 * 60 * 1000,
      path: "/",
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/",
    });

    res.json({ message: "Login successful", user: { id: user.id, fullName: user.fullName } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};


export const logout = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (refreshToken) {
      await prisma.user.updateMany({
        where: { refreshToken: refreshToken },
        data: { refreshToken: null }
      });
    }

    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    });
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    });
    res.json({ message: "Logout successful" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const handleRefreshToken = async (req, res) => {
  console.log("Handle Refresh Token Called");
  console.log("Cookies received:", req.cookies);
  console.log("Headers:", req.headers.cookie);

  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    console.log("No refresh token in cookies");
    return res.status(401).json({ message: "Access denied. No refresh token found." });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    console.log("Token verified. User ID:", decoded.id);

    const user = await prisma.user.findFirst({
      where: {
        id: decoded.id,
        refreshToken: refreshToken
      }
    });

    if (!user) {
      console.log("Token mismatch or user not found in DB");
      await prisma.user.update({
        where: { id: decoded.id },
        data: { refreshToken: null }
      });

      res.clearCookie("token");
      res.clearCookie("refreshToken");
      return res.status(403).json({ message: "Invalid refresh token. Please login again." });
    }

    console.log("User found. Rotating tokens...");

    const newAccessToken = generateToken(user);
    const newRefreshToken = RefreshToken(user);

    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken: newRefreshToken }
    });

    const isProduction = process.env.NODE_ENV === 'production';

    res.cookie("token", newAccessToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      maxAge: 15 * 60 * 1000,
      path: "/",
    });

    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/",
    });

    console.log("Tokens refreshed successfully");
    res.json({ message: "Token refreshed successfully" });

  } catch (error) {
    console.error("Refresh token error:", error.message);
    res.status(403).json({ message: "Invalid or expired refresh token" });
  }
};
