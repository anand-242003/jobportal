import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser"; 
import authrouter from "./routes/authroutes.js";
import userroutes from './routes/userroutes.js'
import jobroutes from './routes/jobroutes.js'
import applicationroutes from './routes/applicationroutes.js'
dotenv.config();

const app = express();

app.use(express.json());

app.use(cors({
  origin: [
    "http://localhost:3000", 
    "https://jobportal-frontend-navy-xi.vercel.app", 
  ],
  credentials: true,
}));

app.use(cookieParser());

app.use("/api/auth", authrouter);
app.use('/api/users',userroutes)
app.use("/api/jobs", jobroutes);
app.use("/api/applications", applicationroutes)
app.get("/api/test", (req, res) => {
  res.json({ message: "Backend is alive!" });
});

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

export default app;
