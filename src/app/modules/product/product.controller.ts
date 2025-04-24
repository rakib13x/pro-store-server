import { Request, Response } from "express";
import catchAsync from "../../utils/tryCatch";
import sendResponse from "../../utils/sendResponse";
import { ProductService } from "./product.service";
import { pickField } from "../../utils/PickValidField";


const createProduct = catchAsync(async (req: Request, res: Response) => {
    console.log(req.body);
    const product = await ProductService.createProduct(req.body);

    sendResponse(res, {
        success: true,
        statusCode: 201,
        message: "Product created successfully",
        data: product,
    });
});


const getAllProducts = catchAsync(async (req: Request, res: Response) => {
    const paginationData = pickField(req.query, ["page", "limit", "sort"]);
    const filter = pickField(req.query, ["searchTerm"]);
    const categoryId = req.query.categoryId as string;


    const result = await ProductService.getAllProducts(paginationData, filter, categoryId);
    console.log(categoryId, "result from product controller");

    console.log("Filtered products for categoryId", categoryId, ":", result.data);


    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "Products retrieved successfully",
        data: result.data,
        meta: result.meta,
    });
});



const getProductById = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    console.log("Product ID:", id);
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


export const getTopSellingProducts = catchAsync(async (_req: Request, res: Response) => {
    const products = await ProductService.getTopSellingProducts();
    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "Top selling products retrieved successfully",
        data: products,
    });
});



export const ProductController = {
    createProduct,
    getAllProducts,
    getProductById,
    deleteProduct,
    updateProduct,
    getTopSellingProducts
};
