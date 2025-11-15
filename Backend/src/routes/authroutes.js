import express from "express";
import { login, signup, logout,handleRefreshToken } from "../controllers/authController.js";

const authrouter = express.Router();

authrouter.post("/signup", signup);
authrouter.post("/login", login);
authrouter.post("/logout", logout); 
authrouter.post("/refresh", handleRefreshToken); 


export default authrouter;
