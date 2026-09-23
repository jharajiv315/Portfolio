import ErrorHandler from "./error.js";

const createRateLimiter = ({ windowMs = 15 * 60 * 1000, max = 100, message = "Too many requests. Please try again later." }) => {
  const requests = new Map();

  // Periodic cleanup to prevent unbounded memory growth
  const timer = setInterval(() => {
    const now = Date.now();
    for (const [ip, record] of requests.entries()) {
      if (now - record.startTime > windowMs) {
        requests.delete(ip);
      }
    }
  }, 5 * 60 * 1000);

  if (timer.unref) {
    timer.unref();
  }

  return (req, res, next) => {
    const ip =
      req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
      req.socket?.remoteAddress ||
      "unknown-ip";

    const now = Date.now();
    const record = requests.get(ip);

    if (!record || now - record.startTime > windowMs) {
      requests.set(ip, { startTime: now, count: 1 });
      return next();
    }

    if (record.count >= max) {
      const retryAfterSec = Math.ceil((record.startTime + windowMs - now) / 1000);
      res.setHeader("Retry-After", retryAfterSec);
      return next(new ErrorHandler(`${message} (Retry after ${retryAfterSec}s)`, 429));
    }

    record.count += 1;
    next();
  };
};

// Brute-force protection for Authentication: 10 attempts per 15 minutes
export const authLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: "Too many authentication attempts from this IP. Please try again in 15 minutes.",
});

// Spam protection for Contact Inquiries: 5 messages per 10 minutes
export const messageLimiter = createRateLimiter({
  windowMs: 10 * 60 * 1000,
  max: 5,
  message: "Too many messages sent from this IP. Please wait a few minutes before submitting again.",
});
