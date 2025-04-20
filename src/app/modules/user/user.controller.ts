import { JwtPayload } from "jsonwebtoken";
import { Request, Response } from "express";
import { pickField } from "../../utils/PickValidField";
import sendResponse from "../../utils/sendResponse";
import catchAsync from "../../utils/tryCatch";
import { UserService } from "./user.service";
import { jwtDecode } from "jwt-decode";


const createUser = catchAsync(async (req, res) => {
  console.log('Request body:', req.body);
  const result = await UserService.createUser(req.body);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "User Created Successfully",
    data: result,
  });
});


const currentLoggedInUser = catchAsync(async (req, res) => {
  // Retrieve the access token from cookies
  const token = req.cookies.accessToken;
  if (!token) {
    return sendResponse(res, {
      success: false,
      statusCode: 401,
      message: "Not authenticated",
      data: null,
    });
  }

  // Decode the token to get the user email
  const decoded = jwtDecode(token) as { userEmail: string };
  if (!decoded.userEmail) {
    throw new Error("Invalid token");
  }

  // Fetch full user details using the service layer
  const result = await UserService.getCurrentUserService(decoded.userEmail);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Current user fetched successfully",
    data: result,
  });
});


const getAllUser = catchAsync(async (req, res) => {
  const paginationData = pickField(req.query, ["page", "limit", "sort"]);
  const filter = pickField(req.query, ["searchTerm", "isBlocked"]);

  const result = await UserService.getAllUser(paginationData, filter);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "All user are fetched successfully",
    data: result.data,
    meta: result.meta,
  });
});

const blockUser = catchAsync(async (req, res) => {
  const result = await UserService.userBlock(req.params.id);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "User Status Changed",
    data: result,
  });
});
const deleteUser = catchAsync(async (req, res) => {
  const result = await UserService.userDelete(req.params.id);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "User delete status Changed",
    data: result,
  });
});
const setNewPassword = catchAsync(async (req, res) => {
  const data = req.body;

  const result = await UserService.setUserNewPassword(
    data?.token,
    data?.password
  );

  sendResponse(res, {
    data: result,
    statusCode: 200,
    success: true,
    message: "Password reset Successfully",
  });
});
const changePassword = catchAsync(async (req, res) => {
  const data = req.body;
  const userData = req.user as JwtPayload & { userEmail: string; role: string };
  const result = await UserService.changePassword(userData, data);

  sendResponse(res, {
    data: result,
    statusCode: 200,
    success: true,
    message: "Password Updated Successfully",
  });
});

const UpdateShippingAddress = catchAsync(async (req, res) => {
  // Use userID from request body instead of req.user.id
  const userId = req.body.userID || req.user.id;

  // Remove userID from the data before passing to service
  const { userID, ...addressData } = req.body;

  const shippingAddress = await UserService.UpdateShippingAddressService(userId, addressData);

  res.status(200).json({
    success: true,
    message: "Shipping address updated successfully",
    data: shippingAddress,
  });
});


const UpdatePaymentMethod = catchAsync(async (req, res) => {
  const userId = req.body.userID || req.user.id;
  console.log("User ID:", userId); // Log the user ID for debugging
  const { userID, ...paymentMethodData } = req.body;
  console.log("update payment method data:", req.body); // Log the payment method data for debugging
  const paymentMethod = await UserService.UpdatePaymentMethodService(userId, paymentMethodData);
  res.status(200).json({
    success: true,
    message: "Payment method updated successfully",
    data: paymentMethod,
  });
});



const getUserById = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.params;

  const user = await UserService.getUserById(userId);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "User fetched successfully",
    data: user,
  });
});

export const UserController = {
  createUser,
  getAllUser,
  blockUser,
  deleteUser,
  setNewPassword,
  changePassword,
  currentLoggedInUser,
  UpdateShippingAddress,
  UpdatePaymentMethod,
  getUserById
};
