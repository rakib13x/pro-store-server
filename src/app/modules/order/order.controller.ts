import { Request, Response } from "express";
import catchAsync from "../../utils/tryCatch";
import sendResponse from "../../utils/sendResponse";
import { OrderService } from "./order.service";



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


export const OrderController = {
    createOrder,
};
