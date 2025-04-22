import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { config } from "../../config";
import prisma from "../../client/prisma";
import { AppError } from "../../Error/AppError";
import catchAsync from "../../utils/tryCatch";

export type T_UserRole = "CUSTOMER" | "SUPERADMIN";

// Middleware function to authenticate and authorize the user
export const auth = (...userRoles: T_UserRole[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    console.log("Headers received:", req.headers);
    const tokenData = req.headers.authorization;
    console.log("Auth header:", tokenData);

    // Check if the Authorization header is missing or malformed
    if (!tokenData || !tokenData.startsWith("Bearer ")) {
      console.log("Token missing or malformed");
      throw new AppError(401, "You have no access to this route. Token missing or malformed.");
    }

    // Extract the token from the Authorization header
    const token = tokenData.split(" ")[1];
    console.log("Token extracted:", token.substring(0, 20) + "...");

    try {
      // Verify the JWT token using the secret key
      console.log("About to verify token with secret:", config.jwt_secrete_key?.substring(0, 3) + "...");
      const decoded = jwt.verify(token, config.jwt_secrete_key as string) as JwtPayload;
      console.log("Token decoded, user role:", decoded.role);

      const { role, userEmail, userID } = decoded;
      console.log("User email from token:", userEmail);
      console.log("User ID from token:", userID);

      // Check if user role is authorized
      if (userRoles.length && !userRoles.includes(role)) {
        throw new AppError(403, "You are not authorized to access this resource");
      }

      req.user = {
        email: userEmail,
        role: role,
        userID: userID
      };

      next();
    } catch (error: any) {
      // Log the verification error
      console.log("Token verification error:", error.message);
      throw new AppError(401, "You have no access to this route. Invalid token or expired.");
    }
  });
};