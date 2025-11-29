import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import authrouter from "./routes/authroutes.js";
import userroutes from './routes/userroutes.js'
import jobroutes from './routes/jobroutes.js'
import applicationroutes from './routes/applicationroutes.js'
import recruiterRoutes from './routes/recruiterRoutes.js'
import { apiLimiter, authLimiter } from "./middlewares/rateLimit.js";
import { errorHandler } from "./middlewares/errorHandler.js";

dotenv.config();

const app = express();

app.use(cors({
  origin: [
    "http://localhost:3000",
    "https://jobportal-frontend-navy-xi.vercel.app",
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(apiLimiter);

app.use(express.json());

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

app.use(cookieParser());

app.use("/api/auth", authLimiter, authrouter);
app.use('/api/users', userroutes)
app.use("/api/jobs", jobroutes);
app.use("/api/applications", applicationroutes)
app.use("/api/recruiter", recruiterRoutes)
app.get("/api/test", (req, res) => {
  res.json({ message: "Backend is alive!" });
});

app.use((req, res, next) => {
  const error = new Error("Route not found");
  error.statusCode = 404;
  next(error);
});

app.use(errorHandler);

export default app;
