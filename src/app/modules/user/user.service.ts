import prisma from "../../client/prisma";
import bcrypt from "bcrypt";
import { config } from "../../config";
import { tokenGenerator, verifyToken } from "../../utils/jsonTokenGenerator";
import { paginationHelper } from "../../utils/paginationHelper";
import { Prisma } from "@prisma/client";
import { AppError } from "../../Error/AppError";
import { JwtPayload } from "jsonwebtoken";
import { IPaginationOptions } from "../../interface/pagination.interface";
const createUser = async (data: ICreateUser) => {
  const { email, password, mobile, name, profilePhoto } = data;

  // Always set role to CUSTOMER regardless of client input
  const role = "CUSTOMER";

  if (!email || !password || !mobile || !name) {
    throw new AppError(400, "All fields are required");
  }

  const mobileNumber = Number(mobile);
  if (isNaN(mobileNumber)) {
    throw new AppError(400, "Mobile number must be a valid number");
  }

  const hashedPass = await bcrypt.hash(password, Number(config.saltRounds));

  const result = await prisma.$transaction(async (prisma) => {
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPass,
        role, // default CUSTOMER
        name,
        mobile: mobileNumber,
        profilePhoto,
      },
    });

    const token = tokenGenerator({ userEmail: user.email, role: user.role, userName: user.name, mobile: user.mobile, profilePhoto: user.profilePhoto });
    return token;
  });

  return result;
};
const getAllUser = async (
  paginationData: IPaginationOptions,
  params: Record<string, unknown>
) => {
  const { page, limit, skip } =
    paginationHelper.calculatePagination(paginationData);
  const { searchTerm, ...filterData } = params;
  let andCondtion: Prisma.UserWhereInput[] = [];

  if (Object.keys(filterData).length > 0) {
    andCondtion.push({
      AND: Object.keys(filterData)
        .filter((field) => Boolean(filterData[field])) // Exclude all falsy values
        .map((field) => {
          const value =
            filterData[field] === "true"
              ? true
              : filterData[field] === "false"
                ? false
                : filterData[field];

          return {
            [field]: {
              equals: value,
              // mode: "insensitive", // Uncomment if needed for case-insensitive search
            },
          };
        }),
    });
  }

  const searchField = ["email"];
  if (params.searchTerm) {
    andCondtion.push({
      OR: searchField.map((field) => ({
        [field]: { contains: params.searchTerm as string, mode: "insensitive" },
      })),
    });
  }
  const whereConditons: Prisma.UserWhereInput = { AND: andCondtion };

  andCondtion.push({
    AND: [{ isDeleted: false }, { role: { not: "SUPERADMIN" } }],
  });

  const result = await prisma.user.findMany({
    where: whereConditons,
    select: {
      id: true,
      email: true,
      role: true,
      isBlocked: true,
    },
    skip: skip,
    take: limit,
    orderBy: paginationData?.sort
      ? {
        [paginationData.sort.split("-")[0]]:
          paginationData.sort.split("-")[1],
      }
      : {
        createdAt: "desc",
      },
  });

  const total = await prisma.user.count({ where: whereConditons });

  return {
    meta: { page, limit, total, totalPage: Math.ceil(total / limit) },
    data: result,
  };
};

const userBlock = async (id: string) => {
  const previous = await prisma.user.findUnique({
    where: {
      id: id,
    },
  });
  const result = await prisma.user.update({
    where: { id: id },
    data: { isBlocked: !previous?.isBlocked },
    select: { isBlocked: true },
  });

  return result;
};

const userDelete = async (id: string) => {
  const previous = await prisma.user.findUnique({
    where: {
      id: id,
    },
  });
  const result = await prisma.user.update({
    where: { id: id },
    data: { isDeleted: !previous?.isDeleted },
    select: { isDeleted: true },
  });

  return result;
};
const setUserNewPassword = async (token: string, password: string) => {
  // Use the utility to decode the token
  const decoded = verifyToken(token);

  const isUserExist = await prisma.user.findUnique({
    where: { email: decoded.userEmail },
  });

  if (!isUserExist) {
    throw new AppError(404, "User not Found");
  }
  const hashedPassword = await bcrypt.hash(password, Number(config.saltRounds));

  const result = await prisma.user.update({
    where: { email: decoded.userEmail },
    data: { password: hashedPassword },
  });
  return result;
};

const changePassword = async (
  userData: JwtPayload & { userEmail: string; role: string },
  password: { password: string }
) => {
  const hashedPassword = await bcrypt.hash(
    password.password,
    Number(config.saltRounds)
  );

  const result = await prisma.user.update({
    where: { email: userData.userEmail },
    data: { password: hashedPassword },
  });
  console.log(result);
  return result;
};


const getCurrentUserService = async (userEmail: string) => {
  const user = await prisma.user.findUnique({
    where: { email: userEmail },
    select: {
      id: true,
      name: true,
      email: true,
      profilePhoto: true,
      mobile: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!user) {
    throw new AppError(404, "User not found");
  }

  return user;
};

export const UserService = {
  createUser,
  setUserNewPassword,
  getAllUser,
  userBlock,
  userDelete,
  changePassword,
  getCurrentUserService
};
