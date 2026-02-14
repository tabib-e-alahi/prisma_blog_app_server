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

app.get("/test_route", (req, res)=>{
    res.send("Server is ruuning Smoothly.")
})

export default app;
