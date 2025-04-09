import { Router } from "express";
import { OrderController } from "./order.controller";


const router = Router();

router.post("/create-order", OrderController.createOrder);
router.post("/get-all-orders", OrderController.getAllOrders);
router.post("/:id", OrderController.getOrderById);

export const orderRouter = router;
