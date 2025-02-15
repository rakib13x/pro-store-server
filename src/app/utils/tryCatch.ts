import { NextFunction, Request, RequestHandler, Response } from "express";

// Modify the return type to be more specific and ensure the async handler returns a Promise
const catchAsync = (fn: RequestHandler): RequestHandler => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      await fn(req, res, next); // Ensure that the function is awaited
    } catch (err) {
      next(err); // Pass the error to the next middleware
    }
  };
};

export default catchAsync;
