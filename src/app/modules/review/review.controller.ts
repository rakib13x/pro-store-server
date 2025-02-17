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

export const ReviewController = {
    addReview,
};
