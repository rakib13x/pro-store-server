import { Request, Response } from "express";
import catchAsync from "../../utils/tryCatch";
import sendResponse from "../../utils/sendResponse";
import { ProductService } from "./product.service";


const createProduct = catchAsync(async (req: Request, res: Response) => {
    const product = await ProductService.createProduct(req.body);

    sendResponse(res, {
        success: true,
        statusCode: 201,
        message: "Product created successfully",
        data: product,
    });
});


const getAllProducts = catchAsync(async (req: Request, res: Response) => {
    const products = await ProductService.getAllProducts();

    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "Products retrieved successfully",
        data: products,
    });
});

export const ProductController = {
    createProduct,
    getAllProducts
};
