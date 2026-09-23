import express from "express";
import {
  getUser,
  login,
  logout,
  register,
  updatePassword,
  updateProfile,
  forgotPassword,
  resetPassword,
  getUserForPortfolio,
} from "../controller/userController.js";
import { isAuthenticated } from "../middlewares/auth.js";
import { authLimiter } from "../middlewares/rateLimiter.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", authLimiter, login);
router.get("/me", isAuthenticated, getUser);
router.get("/logout", logout);
router.get("/portfolio/me", getUserForPortfolio);
router.put("/password/update", isAuthenticated, updatePassword);
router.put("/me/profile/update", isAuthenticated, updateProfile);
router.post("/password/forgot", authLimiter, forgotPassword);
router.put("/password/reset/:token", resetPassword);

export default router;
