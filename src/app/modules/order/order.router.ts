import { Router } from "express";
import { OrderController } from "./order.controller";


const router = Router();

router.post("/create-product", OrderController.createOrder);

export const orderRouter = router;
