import { Router } from "express";
import { OrderController } from "./order.controller";
import { auth } from "../../middleware/auth/auth";


const router = Router();

router.post("/create-order", OrderController.createOrder);
router.get("/my-orders", auth("CUSTOMER"), OrderController.getMyOrders);
router.get("/get-all-orders", OrderController.getAllOrders);
router.get("/:id", OrderController.getOrderById);
router.post("/create-payment-intent", OrderController.createPaymentIntent);
router.post("/verify", OrderController.verifyStripePayment);
router.get("/my-orders/:id", OrderController.getMyOrderById);

export const orderRouter = router;
