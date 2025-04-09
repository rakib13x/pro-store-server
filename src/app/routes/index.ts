import { Router } from "express";
import { AuthRouter } from "../modules/auth/auth.route";
import { UserRouter } from "../modules/user/user.router";
import { productRouter } from "../modules/product/product.router";
import { ReviewRouter } from "../modules/review/review.route";
import { BlogRouter } from "../modules/blog/blog.route";
import { CategoryRouter } from "../modules/category/category.router";
import { orderRouter } from "../modules/order/order.router";



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
    {
        path: "/review",
        route: ReviewRouter,
    },
    {
        path: "/blog",
        route: BlogRouter,
    },
    {
        path: "/category",
        route: CategoryRouter,
    },
    {
        path: "/order",
        route: orderRouter,
    },
];

routeCollection.map((route) => router.use(route.path, route.route));

export default router;
