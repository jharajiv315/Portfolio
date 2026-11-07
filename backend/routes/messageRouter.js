import { mutateStore } from "../storage/blobStore.js";
import { updateInquiry } from "../content/inbox.js";
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

router.patch('/:id', isAuthenticated, async (req, res, next) => {
  try {
    if (process.env.STORAGE_DRIVER !== 'blob') return res.status(503).json({ message: 'Inbox tracking requires the portfolio content store.' });
    const message = await mutateStore(data => updateInquiry(data, req.params.id, req.body));
    res.json({ success: true, message });
  } catch (error) { res.status(error.status || 500).json({ message: error.status ? error.message : 'Could not update inquiry.' }); }
});
export default router;
