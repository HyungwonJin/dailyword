import express from "express";
import morgan from "morgan";
import session from "express-session";
import MongoStore from "connect-mongo";

import globalRouter from "./router/globalRouter";
import userRouter from "./router/userRouter";
import wordRouter from "./router/wordRouter";
import apiRouter from "./router/apiRouter";
import { localsMiddleware } from "./middlewares";


const app = express();
const logger = morgan("dev");

app.set("view engine", "pug");
app.set("views", process.cwd() + "/src/views")

app.use(logger);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    saveUninitialized: false, // 로그인 하는 유저만 DB에 기록
    store: MongoStore.create({ mongoUrl: process.env.DB_URL })
}))

app.use(localsMiddleware);
app.use("/uploads", express.static("uploads"));
app.use("/static", express.static("assets"));
app.use("/", globalRouter);
app.use("/users", userRouter);
app.use("/words", wordRouter);
app.use('/api', apiRouter);

export default app;