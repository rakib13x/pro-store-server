// review.controller.ts
import { Request, Response } from "express";
import catchAsync from "../../utils/tryCatch";
import sendResponse from "../../utils/sendResponse";
import { ReviewService } from "./review.service";

const addReview = catchAsync(async (req: Request, res: Response) => {
    const review = await ReviewService.addReview(req.body);

    sendResponse(res, {
        success: true,
        statusCode: 201,
        message: "Review added successfully",
        data: review,
    });
});


const updateReview = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const review = await ReviewService.updateReview(id, req.body);

    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "Review updated successfully",
        data: review,
    });
});

const deleteReview = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params; // Expects route: /reviews/:id
    const review = await ReviewService.deleteReview(id);

    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "Review deleted successfully",
        data: review,
    });
});

export const ReviewController = {
    addReview,
    updateReview,
    deleteReview
};
