import express from "express";
const app = express();
const port = 3000;
import cors from "cors";
import errorHandler from "./app/middleware/globalErrorHandler";
import noRoute from "./app/utils/noRoute";
import router from "./app/routes";
import helmet from "helmet";
import morgan from "morgan";

// CORS options
const corsOptions = {
    origin: ["*", "http://localhost:4000"],
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
    optionsSuccessStatus: 204,
};

// middlewares
app.use(morgan("dev"));
app.use(helmet());

app.use(cors(corsOptions));
app.use(express.json());

app.use("/api/v1", router);
app.get("/", (req, res) => {
    res.send("Hello World!");
});
app.use(errorHandler);
app.use(noRoute);

export default app;


