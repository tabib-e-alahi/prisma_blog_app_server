import express from "express";
import cors from "cors";

const app = express();

app.use(express.json());

app.use(
    cors({
        origin: "*",
        credentials: true,
    }),
);

app.get("/test_route")

export default app;
