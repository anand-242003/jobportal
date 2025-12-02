import express from "express";
import { login, signup, logout, handleRefreshToken } from "../controllers/authController.js";
import { validateSignup, validateLogin } from "../middlewares/validation.js";

const authrouter = express.Router();

authrouter.post("/signup", validateSignup, signup);
authrouter.post("/login", validateLogin, login);
authrouter.post("/logout", logout); 
authrouter.post("/refresh", handleRefreshToken); 

export default authrouter;
