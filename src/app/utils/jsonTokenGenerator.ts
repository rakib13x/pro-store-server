import jwt, { JwtPayload } from "jsonwebtoken";
import { config } from "../config";
import { AppError } from "../Error/AppError";

export type AddressType = {
  fullName: string;
  streetAddress: string;
  city: string;
  postalCode: string;
  country: string;
};

type PaymentMethodType = string;

type TokenPayloadType = {
  userEmail: string;
  role: string;
  userName: string;
  mobile: number;
  profilePhoto: any;
  userID: string;
  address?: AddressType | null | undefined;
  paymentMethod?: PaymentMethodType | null;
};

// 🔥 FIXED tokenGenerator to accept full TokenPayloadType
export const tokenGenerator = (
  data: TokenPayloadType,
  expiresIn: string | number = config.jwt_secrete_date || "1h"
) => {
  const token = jwt.sign(data, config.jwt_secrete_key as string, {
    expiresIn,
  });
  return token;
};


export const verifyToken = (token: string): JwtPayload => {
  try {
    const decoded = jwt.verify(
      token,
      config.jwt_secrete_key as string
    ) as JwtPayload;
    return decoded;
  } catch (error) {
    // Handle JWT-specific errors
    throw new AppError(401, "Invalid or expired token");
  }
};
