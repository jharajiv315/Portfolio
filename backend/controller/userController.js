import { v2 as cloudinary } from "cloudinary";
import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import { User } from "../models/userSchema.js";
import ErrorHandler from "../middlewares/error.js";
import { generateToken } from "../utils/jwtToken.js";
import crypto from "crypto";
import { sendEmail } from "../utils/sendEmail.js";

export const register = catchAsyncErrors(async (req, res, next) => {
  const existingUsers = await User.find();
  if (existingUsers && existingUsers.length > 0) {
    return next(
      new ErrorHandler(
        "Registration is closed. Administrator account is already configured.",
        403
      )
    );
  }

  if (!req.files || Object.keys(req.files).length === 0) {
    return next(new ErrorHandler("Avatar and Resume are Required!", 400));
  }
  const { avatar, resume } = req.files;

  if (!avatar) {
    return next(new ErrorHandler("Avatar is Required!", 400));
  }

  if (!resume) {
    return next(new ErrorHandler("Resume is Required!", 400));
  }

  // POSTING AVATAR TO CLOUDINARY
  const cloudinaryResponseForAvatar = await cloudinary.uploader.upload(
    avatar.tempFilePath,
    { folder: "PORTFOLIO AVATAR" }
  );
  if (!cloudinaryResponseForAvatar || cloudinaryResponseForAvatar.error) {
    console.error(
      "Cloudinary Error:",
      cloudinaryResponseForAvatar.error || "Unknown Cloudinary error"
    );
    return next(new ErrorHandler("Failed to upload avatar to Cloudinary", 500));
  }

  // POSTING RESUME TO CLOUDINARY
  const cloudinaryResponseForResume = await cloudinary.uploader.upload(
    resume.tempFilePath,
    { folder: "PORTFOLIO RESUME", resource_type: "auto" }
  );
  if (!cloudinaryResponseForResume || cloudinaryResponseForResume.error) {
    console.error(
      "Cloudinary Error:",
      cloudinaryResponseForResume.error || "Unknown Cloudinary error"
    );
    return next(new ErrorHandler("Failed to upload resume to Cloudinary", 500));
  }

  const {
    fullName,
    email,
    phone,
    aboutMe,
    password,
    portfolioURL,
    githubURL,
    instagramURL,
    twitterURL,
    facebookURL,
    linkedInURL,
  } = req.body;

  const user = await User.create({
    fullName,
    email,
    phone,
    aboutMe,
    password,
    portfolioURL,
    githubURL,
    instagramURL,
    twitterURL,
    facebookURL,
    linkedInURL,
    avatar: {
      public_id: cloudinaryResponseForAvatar.public_id,
      url: cloudinaryResponseForAvatar.secure_url,
    },
    resume: {
      public_id: cloudinaryResponseForResume.public_id,
      url: cloudinaryResponseForResume.secure_url,
    },
  });

  generateToken(user, "Registered!", 201, res);
});

export const login = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new ErrorHandler("Provide Email And Password!", 400));
  }

  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new ErrorHandler("Invalid Email Or Password!", 404));
  }

  const isPasswordMatched = await user.comparePassword(password);
  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid Email Or Password", 401));
  }

  generateToken(user, "Login Successfully!", 200, res);
});

export const logout = catchAsyncErrors(async (req, res, next) => {
  const cookieOptions = {
    httpOnly: true,
    expires: new Date(0),
  };
  if (process.env.NODE_ENV === "production") {
    cookieOptions.sameSite = "None";
    cookieOptions.secure = true;
  }

  res
    .status(200)
    .cookie("token", "", cookieOptions)
    .json({
      success: true,
      message: "Logged Out Successfully!",
    });
});

export const getUser = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  res.status(200).json({
    success: true,
    user,
  });
});

export const updateProfile = catchAsyncErrors(async (req, res, next) => {
  const newUserData = {
    fullName: req.body.fullName,
    email: req.body.email,
    phone: req.body.phone,
    aboutMe: req.body.aboutMe,
    githubURL: req.body.githubURL,
    instagramURL: req.body.instagramURL,
    portfolioURL: req.body.portfolioURL,
    facebookURL: req.body.facebookURL,
    twitterURL: req.body.twitterURL,
    linkedInURL: req.body.linkedInURL,
  };

  if (req.files && req.files.avatar) {
    const avatar = req.files.avatar;
    const user = await User.findById(req.user.id);
    const profileImageId = user?.avatar?.public_id;
    if (profileImageId && profileImageId !== "default_avatar") {
      try {
        await cloudinary.uploader.destroy(profileImageId);
      } catch (err) {
        console.warn("Could not delete previous avatar:", err.message);
      }
    }
    try {
      const newProfileImage = await cloudinary.uploader.upload(
        avatar.tempFilePath,
        {
          folder: "PORTFOLIO AVATAR",
        }
      );
      newUserData.avatar = {
        public_id: newProfileImage.public_id,
        url: newProfileImage.secure_url,
      };
    } catch (err) {
      console.error("Cloudinary avatar upload error:", err);
      return next(
        new ErrorHandler(
          `Cloudinary Avatar Upload Failed: ${err.message}. Please check your Cloudinary API credentials.`,
          500
        )
      );
    }
  }

  if (req.files && req.files.resume) {
    const resume = req.files.resume;
    const user = await User.findById(req.user.id);
    const resumeFileId = user?.resume?.public_id;
    if (resumeFileId && resumeFileId !== "default_resume") {
      try {
        await cloudinary.uploader.destroy(resumeFileId, { resource_type: "raw" });
      } catch (err) {
        try {
          await cloudinary.uploader.destroy(resumeFileId, { resource_type: "image" });
        } catch (e) {
          console.warn("Could not delete previous resume:", e.message);
        }
      }
    }
    try {
      const newResume = await cloudinary.uploader.upload(resume.tempFilePath, {
        folder: "PORTFOLIO RESUME",
        resource_type: "auto",
      });
      newUserData.resume = {
        public_id: newResume.public_id,
        url: newResume.secure_url,
      };
    } catch (err) {
      console.error("Cloudinary resume upload error:", err);
      return next(
        new ErrorHandler(
          `Cloudinary Resume Upload Failed: ${err.message}. Please check your Cloudinary API credentials.`,
          500
        )
      );
    }
  }

  const user = await User.findByIdAndUpdate(req.user.id, newUserData);
  res.status(200).json({
    success: true,
    message: "Profile Updated!",
    user,
  });
});

export const updatePassword = catchAsyncErrors(async (req, res, next) => {
  const { currentPassword, newPassword, confirmNewPassword } = req.body;
  const user = await User.findById(req.user.id).select("+password");

  if (!currentPassword || !newPassword || !confirmNewPassword) {
    return next(new ErrorHandler("Please Fill All Fields.", 400));
  }

  const isPasswordMatched = await user.comparePassword(currentPassword);
  if (!isPasswordMatched) {
    return next(new ErrorHandler("Incorrect Current Password!", 400));
  }

  if (newPassword !== confirmNewPassword) {
    return next(
      new ErrorHandler("New Password And Confirm New Password Do Not Match!", 400)
    );
  }

  user.password = newPassword;
  await user.save();

  res.status(200).json({
    success: true,
    message: "Password Updated!",
  });
});

export const getUserForPortfolio = catchAsyncErrors(async (req, res, next) => {
  // In PostgreSQL, retrieves the public portfolio owner data with strict field whitelisting
  const users = await User.find();
  const rawUser = users[0] || null;
  let user = null;

  if (rawUser) {
    user = {
      _id: rawUser._id || rawUser.id,
      id: rawUser.id,
      fullName: rawUser.fullName,
      email: rawUser.email,
      aboutMe: rawUser.aboutMe,
      avatar: rawUser.avatar,
      resume: rawUser.resume,
      portfolioURL: rawUser.portfolioURL,
      githubURL: rawUser.githubURL,
      instagramURL: rawUser.instagramURL,
      twitterURL: rawUser.twitterURL,
      linkedinURL: rawUser.linkedInURL,
      facebookURL: rawUser.facebookURL,
    };
  }

  res.status(200).json({
    success: true,
    user,
  });
});

// FORGOT PASSWORD
export const forgotPassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new ErrorHandler("User Not Found!", 404));
  }

  const resetToken = user.getResetPasswordToken();
  await user.save();

  const resetPasswordUrl = `${process.env.DASHBOARD_URL}/password/reset/${resetToken}`;

  const message = `Your Reset Password Token is:- \n\n ${resetPasswordUrl} \n\n If you've not requested this email, please ignore it.`;

  try {
    await sendEmail({
      email: user.email,
      subject: `Personal Portfolio Dashboard Password Recovery`,
      message,
    });
    res.status(200).json({
      success: true,
      message: `Email sent to ${user.email} successfully`,
    });
  } catch (error) {
    user.resetPasswordToken = null;
    user.resetPasswordExpire = null;
    await user.save();
    return next(new ErrorHandler(error.message, 500));
  }
});

// RESET PASSWORD
export const resetPassword = catchAsyncErrors(async (req, res, next) => {
  const { token } = req.params;
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(
      new ErrorHandler(
        "Reset password token is invalid or has been expired.",
        400
      )
    );
  }

  if (req.body.password !== req.body.confirmPassword) {
    return next(new ErrorHandler("Password & Confirm Password do not match", 400));
  }

  user.password = req.body.password;
  user.resetPasswordToken = null;
  user.resetPasswordExpire = null;
  await user.save();

  generateToken(user, "Reset Password Successfully!", 200, res);
});