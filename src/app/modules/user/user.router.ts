import { Router } from "express";
import { UserController } from "./user.controller";
import { auth } from "../../middleware/auth/auth";

const router = Router();
router.post("/create-user", UserController.createUser);
router.get("/", auth("SUPERADMIN"), UserController.getAllUser);
router.get("/current-user", auth("CUSTOMER"), UserController.currentLoggedInUser);

router.patch(
  "/block/:id",
  auth("SUPERADMIN"),
  UserController.blockUser
);
router.patch("/set-pass", UserController.setNewPassword);
router.patch(
  "/update-pass",
  auth("CUSTOMER"),
  UserController.changePassword
);
router.patch(
  "/delete/:id",
  auth("SUPERADMIN"),
  UserController.deleteUser
);

export const UserRouter = router;
