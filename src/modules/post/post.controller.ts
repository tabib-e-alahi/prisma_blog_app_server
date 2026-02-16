import { RequestHandler } from "express";
import { postService } from "./post.service";

const createPost: RequestHandler = async (req, res) => {
    try {
        if (!req.user) {
            throw new Error("Unauthorized Access");
        }
        const result = await postService.createPost(req.body, req.user.id);
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

const getAllPosts: RequestHandler = async (req, res) => {
    try {
        const search =
            typeof req.query.search === "string" ? req.query.search : undefined;

        const tags = req.query.tags
            ? (req.query.tags as string).split(",")
            : [];

        const isFeatured = req.query.isFeatured
            ? req.query.isFeatured === "true"
                ? true
                : req.query.isFeatured === "false"
                  ? false
                  : undefined
            : undefined;

        const result = await postService.getAllPosts({
            search,
            tags,
            isFeatured,
        });

        return res.status(201).json({
            success: true,
            message: "Post data retrieved successfully",
            totalPost: result.length,
            data: result,
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: "Post data fetching failed",
            error: error.message,
        });
    }
};

export const postController = {
    createPost,
    getAllPosts,
};
