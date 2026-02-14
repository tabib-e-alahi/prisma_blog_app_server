import { RequestHandler } from "express";
import { postService } from "./post.service";

const createPost: RequestHandler = async (req, res) => {
    try {
      const result = await postService.createPost(req.body);
      console.log(result);
      return res.status(201).json({
            success: true,
            message: "Post created successfully.",
            data
      })
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
