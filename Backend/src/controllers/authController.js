import { comparePassword, hashPassword } from "../utils/hash.js";
import prisma from "../config/db.js";
import { generateToken } from "../utils/generateToken.js";
import { RefreshToken } from "../utils/generateToken.js";

export const signup = async (req, res) => {
  try {
    const { fullName, email, password, phoneNumber, role, skills } = req.body;

    if (!email || !password || !fullName) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
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
        skills,
      }
      ,
    });

    const token = generateToken(newUser);
    const refreshToken = RefreshToken(newUser);

  
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 15 * 60 * 1000, 
    });
    
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
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
    if (!email || !password)
      return res.status(400).json({ message: "Email and password required" });

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    const token = generateToken(user);
    const refreshToken = RefreshToken(user);

  
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 15 * 60 * 1000, // 15 minutes
    });
    
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    res.json({ message: "Login successful", user: { id: user.id, fullName: user.fullName } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};


export const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });
  res.json({ message: "Logout successful" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
export const handleRefreshToken = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    return res.status(401).json({ message: "Access denied. No refresh token found." });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    
    
    const newAccessToken = generateToken(decoded);

    res.cookie("token", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 60 * 1000, 
    });
    
    res.json({ message: "Token refreshed successfully" });

  } catch (error) {
    console.error("Refresh token verification failed:", error);
    return res.status(401).json({ message: "Access denied. Invalid refresh token." });
  }
};

