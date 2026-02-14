import { RequestHandler } from "express";

const createPost: RequestHandler = async (req, res) => {
    try {
      const result = await 
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
