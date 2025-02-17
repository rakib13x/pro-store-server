import { Router } from "express";
import { ReviewController } from "./review.controller";


const router = Router();


router.post("/add-review", ReviewController.addReview);
router.put("/:id", ReviewController.updateReview)


export const ReviewRouter = router;