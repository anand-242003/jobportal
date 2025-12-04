import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
export const authmiddleware = (req, res, next) => {
  // Try to get token from cookie first, then from Authorization header
  let token = req.cookies.token;
  
  if (!token && req.headers.authorization) {
    const authHeader = req.headers.authorization;
    if (authHeader.startsWith("Bearer ")) {
      token = authHeader.substring(7);
    }
  }

  if (!token) {
    return res.status(401).json({ message: "Access denied. No token found." });
  }

  try {

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;
    next();

  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

export const roleMiddleware = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied. Insufficient permissions." });
    }
    next();
  };
};