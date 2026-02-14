import { RequestHandler } from "express";

const createPost: RequestHandler = async (req, res) => {
    try {

    } catch (error) {
      return res.status(500).json({
            success: false,
      })
    }
};

export const postController = {
    createPost,
};
