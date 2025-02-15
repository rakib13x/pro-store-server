import { Router } from "express";
import { AuthRouter } from "../modules/auth/auth.route";
import { UserRouter } from "../modules/user/user.router";


const router = Router();
const routeCollection = [
    {
        path: "/user",
        route: UserRouter,
    },
    {
        path: "/auth",
        route: AuthRouter,
    },
];

routeCollection.map((route) => router.use(route.path, route.route));

export default router;
