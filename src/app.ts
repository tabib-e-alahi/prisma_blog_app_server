import express from "express";
import cors from "cors";
import { postRouter } from "./modules/post/post.router";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";
import { commentRouter } from "./modules/comment/comment.router";
import errorHandler from "./middleware/globalErrorHandler";
import { notFound } from "./middleware/notFound";

const app = express();

app.use(cors({
    origin: process.env.FRONEND_URL || "http://localhost:3000", // client side url
    credentials: true
}))

app.use(express.json());

app.all("/api/auth/*splat", toNodeHandler(auth));


app.use("/posts", postRouter);

app.use("/comments", commentRouter);

app.get("/test_route", (req, res) => {
    res.send("Server is ruuning Smoothly.");
});

app.use(notFound);
app.use(errorHandler);

export default app;
