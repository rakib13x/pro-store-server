import { Request, Response } from "express";
import catchAsync from "../../utils/tryCatch";
import sendResponse from "../../utils/sendResponse";
import { OrderService } from "./order.service";
import { pickField } from "../../utils/PickValidField";



const createOrder = catchAsync(async (req: Request, res: Response) => {
    console.log(req.body);
    const order = await OrderService.createOrder(req.body);

    sendResponse(res, {
        success: true,
        statusCode: 201,
        message: "Order created successfully",
        data: order,
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


export const OrderController = {
    createOrder,
    getAllOrders,
    getOrderById
};
