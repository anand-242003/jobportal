import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import passport from "passport";
import authrouter from "./routes/authroutes.js";
import userroutes from './routes/userroutes.js'
import jobroutes from './routes/jobroutes.js'
import applicationroutes from './routes/applicationroutes.js'
import recruiterRoutes from './routes/recruiterRoutes.js'
import oauthrouter from './routes/oauthRoutes.js'
import chatRoutes from './routes/chatRoutes.js'
import savedJobRoutes from './routes/savedJobRoutes.js'
import { apiLimiter, authLimiter } from "./middlewares/rateLimit.js";
import { errorHandler } from "./middlewares/errorHandler.js";

dotenv.config();

const app = express();

app.set('trust proxy', 1);

if (!process.env.FRONTEND_URL) {
  console.error("ERROR: FRONTEND_URL environment variable is required");
  process.exit(1);
}

const allowedOrigins = [
  process.env.FRONTEND_URL,
  process.env.FRONTEND_URL_PRODUCTION
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
      return callback(null, true);
    }
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['set-cookie'],
}));

app.use(apiLimiter);

app.use(express.json());



app.use(cookieParser());
app.use(passport.initialize());

app.use("/api/auth", authLimiter, authrouter);
app.use("/api/auth", oauthrouter);
app.use('/api/users', userroutes)
app.use("/api/jobs", jobroutes);
app.use("/api/applications", applicationroutes)
app.use("/api/recruiter", recruiterRoutes)
app.use("/api/chat", chatRoutes)
app.use("/api/saved-jobs", savedJobRoutes)
app.get("/api/test", (req, res) => {
  res.json({ message: "Backend is alive!" });
});

app.use((req, res, next) => {
  if (req.url.startsWith('/api/')) {
    const error = new Error("Route not found");
    error.statusCode = 404;
    next(error);
  } else {
    res.status(404).send('Not Found');
  }
});

app.use(errorHandler);

export default app;
