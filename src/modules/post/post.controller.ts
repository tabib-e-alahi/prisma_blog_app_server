import { RequestHandler } from "express";
import { postService } from "./post.service";

const createPost: RequestHandler = async (req, res) => {
    try {
        if (!req.user) {
            throw new Error("Unauthorized Access");
        }
        const result = await postService.createPost(req.body, req.user.);
        console.log(result);
        return res.status(201).json({
            success: true,
            message: "Post created successfully.",
            data: result,
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: "Post creation failed.",
            error: error.message,
        });
    }
};

export const postController = {
    createPost,
};
