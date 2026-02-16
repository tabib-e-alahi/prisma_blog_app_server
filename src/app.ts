import express from "express";
import cors from "cors";
import { postRouter } from "./modules/post/post.router";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";

const app = express();

app.use(
    cors({
        origin: [process.env.FRONEND_URL!],
        credentials: true,
    }),
);


app.all("/api/auth/*splat", toNodeHandler(auth));

app.use(express.json());

app.use("/posts", postRouter);

app.get("/test_route", (req, res) => {
    res.send("Server is ruuning Smoothly.");
});

export default app;
