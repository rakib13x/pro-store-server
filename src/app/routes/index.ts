import { Router } from "express";
import { AuthRouter } from "../modules/auth/auth.route";
import { UserRouter } from "../modules/user/user.router";
import { productRouter } from "../modules/product/product.router";
import { ReviewRouter } from "../modules/review/review.route";
import { BlogRouter } from "../modules/blog/blog.route";



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
];

routeCollection.map((route) => router.use(route.path, route.route));

export default router;
