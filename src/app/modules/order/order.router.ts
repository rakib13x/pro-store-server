import { Router } from "express";
import { OrderController } from "./order.controller";


const router = Router();

router.post("/create-order", OrderController.createOrder);
router.post("/get-all-orders", OrderController.getAllOrders);
router.get("/:id", OrderController.getOrderById);
router.post("/create-payment-intent", OrderController.createPaymentIntent);
router.post("/verify", OrderController.verifyStripePayment);

export const orderRouter = router;
