import { Router } from "express";
import { CategoryController } from "./category.controller";

const router = Router();

router.post("/create-category", CategoryController.createCategory);
router.get("/all-categories", CategoryController.getAllCategories);
router.delete("/:id", CategoryController.deleteCategory);

export const CategoryRouter = router;