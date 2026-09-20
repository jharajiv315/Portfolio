class ErrorHandler extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
    }
}

export const errorMiddleware = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal Server Error";

    // PostgreSQL unique constraint violation
    if (err.code === "23505") {
        const message = err.detail || "Duplicate field value entered";
        err = new ErrorHandler(message, 400);
    }

    // PostgreSQL not null violation
    if (err.code === "23502") {
        const message = `Missing required field: ${err.column || ""}`;
        err = new ErrorHandler(message, 400);
    }

    // PostgreSQL invalid syntax / input type
    if (err.code === "22P02") {
        const message = "Invalid input format entered";
        err = new ErrorHandler(message, 400);
    }

    // Connection refused
    if (err.code === "ECONNREFUSED") {
        const message = "Could not connect to the database";
        err = new ErrorHandler(message, 500);
    }

    if (err.name === "JsonWebTokenError") {
        const message = "Invalid Token. Please try again";
        err = new ErrorHandler(message, 400);
    }

    if (err.name === "TokenExpiredError") {
        const message = "Invalid Token. Please try to login again";
        err = new ErrorHandler(message, 400);
    }

    const errorMessage = err.errors
        ? Object.values(err.errors).map((error) => error.message).join(", ")
        : err.message;

    res.status(err.statusCode).json({
        success: false,
        message: errorMessage,
    });
};

export default ErrorHandler;