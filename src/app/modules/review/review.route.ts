import { Router } from "express";
import { ReviewController } from "./review.controller";


const router = Router();


router.post("/add-review", ReviewController.addReview);
router.put("/:id", ReviewController.updateReview);
router.delete("/:id", ReviewController.deleteReview);



export const ReviewRouter = router;