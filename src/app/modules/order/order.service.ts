import { Prisma } from "@prisma/client";
import prisma from "../../client/prisma";
import { AppError } from "../../Error/AppError";
import { IPaginationOptions } from "../../interface/pagination.interface";
import { paginationHelper } from "../../utils/paginationHelper";
import { ICreateOrder } from "./order.interface";


const createOrder = async (data: ICreateOrder) => {
    const { userId, total, subTotal, shippingAddress, paymentMethod, orderItems, couponId } = data;

    if (!userId || !total || !subTotal || !shippingAddress || !paymentMethod || !orderItems) {
        throw new AppError(400, "All fields are required");
    }


    const order = await prisma.order.create({
        data: {
            userId,
            total,
            subTotal,
            shippingAddress,
            paymentMethod,
            couponId,
            orderItems: {
                create: orderItems,
            },
        },
        include: {
            user: true,
            orderItems: true,
        },
    });

    return order;
};




const getAllOrders = async (
    paginationData: IPaginationOptions,
    params: Record<string, unknown>
) => {
    const { page, limit, skip } = paginationHelper.calculatePagination(paginationData);
    const { searchTerm, ...filterData } = params;

    let andCondition: Prisma.OrderWhereInput[] = [];
    // andCondition.push({
    //     isDeleted: false,
    // });

    if (Object.keys(filterData).length > 0) {
        andCondition.push({
            AND: Object.keys(filterData)
                .filter((field) => Boolean(filterData[field]))
                .map((field) => {
                    const value =
                        filterData[field] === "true"
                            ? true
                            : filterData[field] === "false"
                            ? false
                            : filterData[field];

                    return {
                        [field]: { equals: value },
                    };
                }),
        });
    }

    if (searchTerm) {
        andCondition.push({
            OR: [
                {
                    user: {
                        name: {
                            contains: searchTerm as string,
                            mode: "insensitive",
                        },
                    },
                },
            ],
        });
    }

    const whereConditions: Prisma.OrderWhereInput = {
        AND: andCondition,
    };

    const orders = await prisma.order.findMany({
        where: whereConditions,
        include: {
            user: true,
            orderItems: true,
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

    const total = await prisma.order.count({
        where: whereConditions,
    });

    return {
        data: orders,
        meta: {
            page,
            limit,
            total,
            totalPage: Math.ceil(total / limit),
        },
    };
};



export const OrderService = {
    createOrder,
    getAllOrders
};
