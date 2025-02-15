import { PrismaClient, USER_ROLE } from "@prisma/client";
import prisma from "../client/prisma";
import bcrypt from "bcrypt";
import { config } from "../config";
const superUser = {
    name: "Rakib Islam",
    email: "superadmin@gmail.com",
    mobile: 123456789,
    password: "super123", // Ideally, use a hashed password
    role: USER_ROLE.SUPERADMIN, // Ensure this matches the `USER_ROLE` enum
};

const seedSuperAdmin = async () => {
    const hashedPass = await bcrypt.hash(
        superUser.password,
        Number(config.saltRounds as string)
    );

    try {
        // Check if a super admin already exists
        const isSuperAdminExists = await prisma.user.findFirst({
            where: { role: USER_ROLE.SUPERADMIN, email: superUser.email },
        });

        // Create super admin if not exists
        if (!isSuperAdminExists) {
            await prisma.user.create({
                data: { ...superUser, password: hashedPass },
            });
        } else {
            console.log("Super admin already exists.");
        }
    } catch (error) {
        console.error("Error seeding super admin:", error);
    }
};

export default seedSuperAdmin;
