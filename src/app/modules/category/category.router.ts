import { Router } from "express";
import { CategoryController } from "./category.controller";

const router = Router();

router.post("/create-category", CategoryController.createCategory);
router.get("/all-categories", CategoryController.getAllCategories);

export const CategoryRouter = router;