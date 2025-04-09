import prisma from "../../client/prisma";
import { AppError } from "../../Error/AppError";
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



export const OrderService = {
    createOrder,
};
