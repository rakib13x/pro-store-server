import { Request, Response } from "express";
import catchAsync from "../../utils/tryCatch";
import { CategoryService } from "./category.service";
import sendResponse from "../../utils/sendResponse";

const createCategory = catchAsync(async (req: Request, res: Response) => {
    const category = await CategoryService.createCategoryIntoDb(req.body);
    sendResponse(res, {
        success: true,
        statusCode: 201,
        message: "Category created Successfully",
        data: category
    })
})

export const CategoryController = {
    createCategory
}