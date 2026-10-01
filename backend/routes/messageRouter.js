import express from "express";
import {
  deleteMessage,
  getAllMessages,
  sendMessage,
  replyMessage,
} from "../controller/messageController.js";
import { isAuthenticated } from "../middlewares/auth.js";
import { messageLimiter } from "../middlewares/rateLimiter.js";

const router = express.Router();

router.post("/send", messageLimiter, sendMessage);
router.post("/reply/:id", isAuthenticated, replyMessage);
router.delete("/delete/:id", isAuthenticated, deleteMessage);
router.get("/getall", isAuthenticated, getAllMessages);

export default router;
