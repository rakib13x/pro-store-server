import { NextFunction, Request, Response } from "express";
import { Prisma } from "@prisma/client";
import { AppError } from "../Error/AppError";

const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = 500; // Default to internal server error
  let message = "Something went wrong"; // Default message
  let errorDetails = err; // Default error details

  if (err instanceof AppError) {
    // Handle custom AppError
    statusCode = err.statusCode;
    message = err.message;
    errorDetails = err;
  } else if (err instanceof Prisma.PrismaClientKnownRequestError) {
    // Handle known Prisma errors
    statusCode = 400;
    if (err.code === "P2002") {
      // Unique constraint violation
      const fields = Array.isArray(err.meta?.target)
        ? (err.meta?.target as string[]).join(", ")
        : "field";
      message = `Duplicate value for ${fields}.`;
    } else if (err.code === "P2025") {
      // Record not found
      message = "The requested record was not found.";
    } else {
      message = "A database error occurred.";
    }
    errorDetails = {
      code: err.code,
      meta: err.meta,
    };
  } else if (err instanceof Prisma.PrismaClientValidationError) {
    // Handle Prisma validation errors
    statusCode = 400;
    message = "Validation error occurred. Check your input.";
  } else if (err instanceof Error) {
    // Handle general JavaScript errors
    message = err.message || "Internal Server Error";
    if (process.env.NODE_ENV === "development") {
      errorDetails = { stack: err.stack };
    }
  }

  // Send response in desired structure
  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
    err: errorDetails,
  });
};

export default errorHandler;
