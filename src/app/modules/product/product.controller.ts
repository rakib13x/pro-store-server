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


const getProductById = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params; // Assuming your route is like /products/:id
    const product = await ProductService.getProductById(id);

    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "Product retrieved successfully",
        data: product,
    });
});

const deleteProduct = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const deletedProduct = await ProductService.deleteProduct(id);

    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "Product deleted successfully",
        data: deletedProduct,
    });
});


const updateProduct = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const product = await ProductService.updateProduct(id, req.body);

    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "Product updated successfully",
        data: product,
    });
});


export const ProductController = {
    createProduct,
    getAllProducts,
    getProductById,
    deleteProduct,
    updateProduct
};
