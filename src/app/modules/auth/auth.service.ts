import bcrypt from "bcrypt";
import prisma from "../../client/prisma";

import { AddressType, tokenGenerator } from "../../utils/jsonTokenGenerator";
import { sendMail } from "../../utils/nodeMailer";
import { JwtPayload } from "jsonwebtoken";
import { AppError } from "../../Error/AppError";

const userLogin = async (data: { email: string; password: string }) => {
    const user = await prisma.user.findUnique({
        where: { email: data.email },
    });

    if (!user) {
        throw new AppError(404, "Check your email");
    }

    if (!(await bcrypt.compare(data.password, user.password))) {
        throw new AppError(404, "Check your password");
    }

    if (user.isBlocked) {
        throw new AppError(404, "User blocked");
    }

    if (user.isDeleted) {
        throw new AppError(404, "User deleted");
    }

    const address = user.address ? user.address as unknown as AddressType : null;
    const token = tokenGenerator({
        userEmail: user.email,
        role: user.role,
        userName: user.name,
        mobile: user.mobile,
        profilePhoto: user.profilePhoto,
        userID: user.id,
        address: address,
        paymentMethod: user.paymentMethod
    });

    if (!token) {
        throw new AppError(404, "Something Went Wrong!! Try again.");
    }

    return { token };
};

const userResetPassLinkGenarator = async (userEmail: string) => {
    const findUser = await prisma.user.findUnique({
        where: { email: userEmail },
    });
    if (!findUser) {
        throw new AppError(500, "User not found");
    }

    const accessToken = tokenGenerator(
        {
            userEmail: userEmail,
            role: "",
            mobile,
            userName,
            profilePhoto: ""
        },
        "5min"
    );
    // { to, subject, text, html }
    await sendMail({
        to: userEmail,
        subject: "Reset pass link",
        text: "Change your pass within 5min",
        html: `<a href="http://localhost:3000/reset-password?email=${userEmail}&token=${accessToken}">Reset Link</a>
  <p>Change your pass within 5min</p>`,
    });

    return "";
};

export const AuthService = {
    userLogin,
    userResetPassLinkGenarator,
};
