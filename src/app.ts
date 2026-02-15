import express from "express";
import cors from "cors";
import { postRouter } from "./modules/post/post.router";

const app = express();

app.use(
    cors({
        origin: "*",
        credentials: true,
    }),
);

app.all("/api/auth/*", toNodeHandler(auth));
app.use(express.json());



app.use("/posts", postRouter);

app.get("/test_route", (req, res) => {
    res.send("Server is ruuning Smoothly.");
});

export default app;
