import { Router } from "express";
import { OrderController } from "./order.controller";


const router = Router();

router.post("/create-order", OrderController.createOrder);
router.post("/get-all-orders", OrderController.getAllOrders);

export const orderRouter = router;
