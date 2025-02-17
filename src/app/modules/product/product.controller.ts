import { Request, Response } from "express";
import catchAsync from "../../utils/tryCatch";
import sendResponse from "../../utils/sendResponse";
import { ProductService } from "./product.service";

// Create a product (now with nested category creation)
const createProduct = catchAsync(async (req: Request, res: Response) => {
    const product = await ProductService.createProduct(req.body);

    sendResponse(res, {
        success: true,
        statusCode: 201,
        message: "Product created successfully",
        data: product,
    });
});

export const ProductController = {
    createProduct,
};
