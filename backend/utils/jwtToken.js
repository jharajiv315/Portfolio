export const generateToken = (user, message, statusCode, res) => {
  const token = user.generateJsonWebToken();

  const cookieExpiresDays = Number(process.env.COOKIE_EXPIRES || process.env.COOKIE_EXPIRE) || 7;
  const options = {
    expires: new Date(
      Date.now() + cookieExpiresDays * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === "production") {
    options.sameSite = "None";
    options.secure = true;
  }

  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    message,
    user,
    token,
  });
};
