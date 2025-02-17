import { Router } from "express";
import { BlogController } from "./blog.controller";

const router = Router();

router.post("/create-blog", BlogController.createBlog);
router.put("/:id", BlogController.updateBlog);
router.delete("/:id", BlogController.deleteBlog)

export const BlogRouter = router;