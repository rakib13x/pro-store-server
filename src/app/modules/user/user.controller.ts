import { JwtPayload } from "jsonwebtoken";
import { pickField } from "../../utils/PickValidField";
import sendResponse from "../../utils/sendResponse";
import catchAsync from "../../utils/tryCatch";
import { UserService } from "./user.service";
import { getCurrentUser } from '../../../../../fofood/src/services/authService/index';
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

export const UserController = {
  createUser,
  getAllUser,
  blockUser,
  deleteUser,
  setNewPassword,
  changePassword,
  currentLoggedInUser
};
