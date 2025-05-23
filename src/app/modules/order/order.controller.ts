import { Request, Response } from "express";
import catchAsync from "../../utils/tryCatch";
import sendResponse from "../../utils/sendResponse";
import { OrderService } from "./order.service";
import { pickField } from "../../utils/PickValidField";
import prisma from "../../client/prisma";
import { AppError } from "../../Error/AppError";



const createOrder = catchAsync(async (req: Request, res: Response) => {
    console.log(req.body);
    const result = await OrderService.createOrder(req.body);


    if (!result.success) {
        return sendResponse(res, {
            success: false,
            statusCode: 400,
            message: result.message,
            redirectTo: result.redirectTo,
            data: null
        });
    }

    sendResponse(res, {
        success: true,
        statusCode: 201,
        message: "Order created successfully",
        data: result.data,
        redirectTo: result.redirectTo
    });
});


const getAllOrders = catchAsync(async (req: Request, res: Response) => {
    const paginationData = pickField(req.query, ["page", "limit", "sort"]);
    const filter = pickField(req.query, ["searchTerm"]);

    const result = await OrderService.getAllOrders(paginationData, filter);

    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "Orders retrieved successfully",
        data: result.data,
        meta: result.meta,
    });
});


const getOrderById = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    console.log("Order ID:", id);
    const order = await OrderService.getOrderById(id);

    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "Order retrieved successfully",
        data: order,
    });
});



const createPaymentIntent = catchAsync(async (req: Request, res: Response) => {

    const { orderId } = req.body;
    console.log("Order ID:", orderId);
    console.log("Request Body:", req.body);

    if (!orderId) {
        return sendResponse(res, {
            success: false,
            statusCode: 400,
            message: "Order ID is required",
            data: null,
        });
    }

    const result = await OrderService.createPaymentIntent(orderId);

    if (!result.success) {
        return sendResponse(res, {
            success: false,
            statusCode: 400,
            message: result.message,
            data: null,
        });
    }

    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "Payment intent created successfully",
        data: result.data,
    });
});


const verifyStripePayment = catchAsync(async (req: Request, res: Response) => {
    const { orderId, paymentIntentId } = req.body;

    if (!orderId || !paymentIntentId) {
        return sendResponse(res, {
            success: false,
            statusCode: 400,
            message: "Missing required parameters",
            data: null,
        });
    }

    const result = await OrderService.verifyStripePayment(orderId, paymentIntentId);

    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "Payment verified successfully",
        data: result,
    });
});



const getMyOrders = catchAsync(async (req: Request, res: Response) => {
    console.log("Request reached controller");
    const userId = req.user.userID;
    console.log("User ID:", userId);

    const paginationData = pickField(req.query, ["page", "limit", "sort"]);
    const filter = pickField(req.query, ["searchTerm"]);

    const result = await OrderService.getMyOrders(userId, paginationData, filter);

    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "User orders retrieved successfully",
        data: result.data,
        meta: result.meta,
    });
});


const getMyOrderById = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user.userId;
    const { id } = req.params;

    const order = await OrderService.getMyOrderById(userId, id);

    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "User order retrieved successfully",
        data: order,
    });
});



export const OrderController = {
    createOrder,
    getAllOrders,
    getOrderById,
    verifyStripePayment,
    createPaymentIntent,
    getMyOrders,
    getMyOrderById,
};
