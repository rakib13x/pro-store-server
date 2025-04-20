import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { config } from "../../config";
import prisma from "../../client/prisma";
import { AppError } from "../../Error/AppError";
import catchAsync from "../../utils/tryCatch";

// Define the allowed user roles
export type T_UserRole = "CUSTOMER" | "SUPERADMIN";

// Middleware function to authenticate and authorize the user
export const auth = (...userRoles: T_UserRole[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const tokenData = req.headers.authorization;

    // Check if the Authorization header is missing or malformed
    if (!tokenData || !tokenData.startsWith("Bearer ")) {
      throw new AppError(401, "You have no access to this route. Token missing or malformed.");
    }

    // Extract the token from the Authorization header
    const token = tokenData.split(" ")[1];

    try {
      // Verify the JWT token using the secret key
      const decoded = jwt.verify(token, config.jwt_secrete_key as string) as JwtPayload;

      const { role, userEmail } = decoded;

      // Fetch user data from the database based on the email
      const user = await prisma.user.findUnique({
        where: { email: userEmail },
      });

      // Check if the user exists in the database
      if (!user) {
        throw new AppError(401, "You have no access to this route. User not found.");
      }

      // Check if the user's role matches the required roles
      if (userRoles.length > 0 && !userRoles.includes(role as T_UserRole)) {
        throw new AppError(403, "You do not have permission to access this route.");
      }

      // Attach the decoded user data to the request object
      req.user = decoded as JwtPayload;

      // Proceed to the next middleware or route handler
      next();
    } catch (error: any) {
      // Catch errors and throw a custom error
      throw new AppError(401, "You have no access to this route. Invalid token or expired.");
    }
  });
};
