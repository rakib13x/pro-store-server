import { NextFunction, Request, Response } from "express";

const noRoute = (req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({
    status: false,
    statusCode: 404,
    message: "Route not found",
  });
};

export default noRoute;
