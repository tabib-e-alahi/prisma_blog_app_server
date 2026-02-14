import { RequestHandler } from "express";
import { postService } from "./post.service";

const createPost: RequestHandler = async (req, res) => {
    try {
      const result = await postService.createPost(req.body);
      
      res.s
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
