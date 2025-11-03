import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser"; 
import authrouter from "./routes/authroutes.js";

dotenv.config();

const app = express();

app.use(express.json());

app.use(cors({
  origin: "http://localhost:3000", 
  credentials: true,
}));

app.use(cookieParser());

app.use("/api/auth", authrouter);

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

export default app;
