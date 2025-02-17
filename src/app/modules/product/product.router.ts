import { Router } from "express";
import { ProductController } from "./product.controller";


const router = Router();

router.post("/create-product", ProductController.createProduct);
router.get("/allproducts", ProductController.getAllProducts);
router.get("/:id", ProductController.getProductById);
router.delete("/:id", ProductController.deleteProduct);

export const productRouter = router;
