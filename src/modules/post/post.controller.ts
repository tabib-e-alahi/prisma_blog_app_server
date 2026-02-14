import { RequestHandler } from "express";

const createPost: RequestHandler = async (req, res) => {
    console.log("Controller");
};

export const postController = {
    createPost,
};
