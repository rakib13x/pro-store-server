import { Request, Response } from "express";
import catchAsync from "../../utils/tryCatch";
import { CategoryService } from "./category.service";
import sendResponse from "../../utils/sendResponse";
import { pickField } from "../../utils/PickValidField";

const createCategory = catchAsync(async (req: Request, res: Response) => {
    console.log("Received body:", req.body);
    const { name, image } = req.body;
    // Save category with the image URL
    const category = await CategoryService.createCategoryIntoDb(req.body);

    sendResponse(res, {
        success: true,
        statusCode: 201,
        message: "Category created Successfully",
        data: category
    })
})


const getAllCategories = catchAsync(async (req: Request, res: Response) => {
    const paginationData = pickField(req.query, ["page", "limit", "sort"]);
    const filter = pickField(req.query, ["searchTerm"]);

    const result = await CategoryService.getAllCategories(paginationData, filter);

    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "All categories retrieved successfully",
        data: result.data,
        meta: result.meta,
    });
});

export const CategoryController = {
    createCategory,
    getAllCategories
}