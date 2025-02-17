import { Router } from "express";
import { AuthRouter } from "../modules/auth/auth.route";
import { UserRouter } from "../modules/user/user.router";
import { productRouter } from "../modules/product/product.router";



const router = Router();
const routeCollection = [
    {
        path: "/user",
        route: UserRouter,
    },
    {
        path: "/product",
        route: productRouter,
    },
    {
        path: "/auth",
        route: AuthRouter,
    },
];

routeCollection.map((route) => router.use(route.path, route.route));

export default router;
