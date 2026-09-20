import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/error.js";
import { Message } from "../models/messageSchema.js";

export const sendMessage = catchAsyncErrors(async (req, res, next) => {
    const { senderName, subject, message } = req.body;

    if (!senderName || !subject || !message) {
        return next(new ErrorHandler("Please fill all the fields", 400));
    }

    if (senderName.trim().length < 3) {
        return next(new ErrorHandler("Name should be at least 3 characters", 400));
    }

    if (subject.trim().length < 3) {
        return next(new ErrorHandler("Subject should be at least 3 characters", 400));
    }

    if (message.trim().length < 5) {
        return next(new ErrorHandler("Message should be at least 5 characters", 400));
    }

    const data = await Message.create({
        senderName: senderName.trim(),
        subject: subject.trim(),
        message: message.trim(),
    });

    res.status(200).json({
        success: true,
        message: "Message sent successfully",
        data,
    });
});

export const getAllMessages = catchAsyncErrors(async (req, res, next) => {
    const messages = await Message.find();
    res.status(200).json({
        success: true,
        messages,
    });
});

export const deleteMessage = catchAsyncErrors(async (req, res, next) => {
    const { id } = req.params;
    const message = await Message.findById(id);

    if (!message) {
        return next(new ErrorHandler("Message not found", 400 ));
    }
    
    await message.deleteOne();
    res.status(200).json({
        success: true,
        message: "Message deleted successfully",
    });
});