import { Router } from "express";
import { ReviewController } from "./review.controller";


const router = Router();


router.post("/add-review", ReviewController.addReview)


export const ReviewRouter = router;