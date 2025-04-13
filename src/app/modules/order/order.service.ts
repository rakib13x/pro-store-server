import { Prisma } from "@prisma/client";
import prisma from "../../client/prisma";
import { AppError } from "../../Error/AppError";
import { IPaginationOptions } from "../../interface/pagination.interface";
import { paginationHelper } from "../../utils/paginationHelper";
import { ICreateOrder } from "./order.interface";
import Stripe from "stripe";


const createOrder = async (data: ICreateOrder) => {
    const { userId, total, subTotal, shippingAddress, paymentMethod, orderItems, couponId } = data;

    // Check if user exists
    const user = await prisma.user.findUnique({
        where: { id: userId }
    });

    if (!user) {
        return {
            success: false,
            message: 'User not found',
            redirectTo: '/login',
        };
    }

    // Validate required fields
    if (!orderItems || orderItems.length === 0) {
        return {
            success: false,
            message: 'Your cart is empty',
            redirectTo: '/cart',
        };
    }

    if (!shippingAddress) {
        return {
            success: false,
            message: 'No shipping address',
            redirectTo: '/shipping-address',
        };
    }

    if (!paymentMethod) {
        return {
            success: false,
            message: 'No payment method',
            redirectTo: '/payment-method',
        };
    }

    try {
        // Create order with transaction to ensure data consistency
        const order = await prisma.$transaction(async (tx) => {
            const createdOrder = await tx.order.create({
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

            // Here you could add cart clearing logic if needed

            return createdOrder;
        });

        if (!order) throw new Error('Order not created');

        return {
            success: true,
            message: 'Order created successfully',
            redirectTo: `/order/${order.orderId}`,
            data: order
        };
    } catch (error) {
        return {
            success: false,
            message: error instanceof Error ? error.message : 'Failed to create order',
            redirectTo: '/cart'
        };
    }
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

const getOrderById = async (id: string) => {
    const order = await prisma.order.findUnique({
        where: { orderId: id },
        include: { user: true, orderItems: true },
    });

    if (!order) {
        throw new AppError(404, "Order not found");
    }

    return order;
};



const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

const createPaymentIntent = async (orderId: string) => {
    try {
        // Verify the order exists
        const order = await prisma.order.findUnique({
            where: { orderId },
        });

        if (!order) {
            throw new AppError(404, "Order not found");
        }

        // Check if payment is already completed
        if (order.paymentStatus !== "PENDING") {
            throw new AppError(400, "Payment already processed");
        }

        // Convert order total to cents (Stripe uses smallest currency unit)
        const amount = Math.round(order.total * 100);

        // Create a payment intent with explicit payment method types
        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency: "usd", // Change according to your currency
            metadata: { orderId },
            // Explicitly specify payment method types
            payment_method_types: ['card'],
            // You can also use this instead of automatic_payment_methods
            // automatic_payment_methods: { enabled: true },
        });

        // Update the order with the payment intent ID
        await prisma.order.update({
            where: { orderId },
            data: {
                transactionId: paymentIntent.id,
            },
        });

        return {
            success: true,
            message: "Payment intent created successfully",
            data: {
                clientSecret: paymentIntent.client_secret,
                paymentIntentId: paymentIntent.id,
            },
        };
    } catch (error) {
        console.error("Payment intent creation error:", error);
        if (error instanceof AppError) {
            return {
                success: false,
                message: error.message,
                data: null,
            };
        }
        return {
            success: false,
            message: error instanceof Error ? error.message : "Failed to create payment intent",
            data: null,
        };
    }
};


const verifyStripePayment = async (orderId: string, paymentIntentId: string) => {
    try {
        // Verify the order exists
        const order = await prisma.order.findUnique({
            where: { orderId },
        });

        if (!order) {
            throw new AppError(404, "Order not found");
        }

        // Retrieve the payment intent from Stripe
        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

        // Verify the payment intent is for this order
        if (!paymentIntent.metadata.orderId || paymentIntent.metadata.orderId !== orderId) {
            throw new AppError(400, "Invalid payment intent for this order");
        }

        // Check if payment was successful
        if (paymentIntent.status !== "succeeded") {
            throw new AppError(400, "Payment not successful");
        }

        // Update order status to COMPLETED if it's still PENDING
        if (order.paymentStatus === "PENDING") {
            await prisma.order.update({
                where: { orderId },
                data: {
                    paymentStatus: "COMPLETED",
                    paymentResult: {
                        id: paymentIntent.id,
                        status: paymentIntent.status,
                        update_time: new Date().toISOString(),
                        email_address: paymentIntent.receipt_email || "",
                    },
                    transactionId: paymentIntent.id,
                },
            });
        }

        return {
            success: true,
            message: "Payment verified successfully",
        };
    } catch (error) {
        if (error instanceof AppError) {
            throw error;
        }
        throw new AppError(500, error instanceof Error ? error.message : "Failed to verify payment");
    }
};


export const OrderService = {
    createOrder,
    getAllOrders,
    getOrderById,
    verifyStripePayment,
    createPaymentIntent
};
