import express from "express";
import { login, signup, logout } from "../controllers/authController.js";

const authrouter = express.Router();

authrouter.post("/signup", signup);
authrouter.post("/login", login);
authrouter.post("/logout", logout); 

export default authrouter;
