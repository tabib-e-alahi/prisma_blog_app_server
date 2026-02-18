import { NextFunction, RequestHandler } from "express";
import { postService } from "./post.service";
import { PostStatus } from "../../generated/prism/enums";
import paginationSortingHelper from "../../helpers/paginationSortingHelper";
import { UserRole } from "../../middleware/auth";

const createPost: RequestHandler = async (req, res, next: NextFunction) => {
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
        next(error);
    }
};

const getAllPosts: RequestHandler = async (req, res) => {
    try {
        //* searching post by title, content or any one of the tag
        const search =
            typeof req.query.search === "string" ? req.query.search : undefined;

        //* GETTING post by tags
        const tags = req.query.tags
            ? (req.query.tags as string).split(",")
            : [];

        //* filtering posts by isFatured value
        const isFeatured = req.query.isFeatured
            ? req.query.isFeatured === "true"
                ? true
                : req.query.isFeatured === "false"
                  ? false
                  : undefined
            : undefined;

        //* filtering posts by status
        const status = req.query.status as PostStatus | undefined;

        const { page, limit, skip, sortBy, sortOrder } =
            paginationSortingHelper(req.query);

        const result = await postService.getAllPosts({
            search,
            tags,
            isFeatured,
            status,
            page,
            limit,
            skip,
            sortBy,
            sortOrder,
        });

        return res.status(201).json({
            success: true,
            message: "Post data retrieved successfully",
            result,
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: "Post data fetching failed",
            error: error.message,
        });
    }
};

const getPostById: RequestHandler = async (req, res) => {
    try {
        const { postId } = req.params;
        if (!postId) {
            throw new Error("Post Id is required!");
        }
        const result = await postService.getPostById(postId as string);
        return res.status(201).json({
            success: true,
            message: "Post data retrieved successfully",
            result,
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: "Could nor retrieve post by id",
            error: error.message,
        });
    }
};

const getMyPosts: RequestHandler = async (req, res) => {
    try {
        const user = req.user;
        if (!user) {
            throw new Error("You are not authorized.");
        }
        const result = await postService.getMyPosts(user.id as string);
        return res.status(201).json({
            success: true,
            message: "Post fetched successfully.",
            data: result,
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: "Post fetched failed.",
            error: error.message,
        });
    }
};

const updatePost: RequestHandler = async (req, res) => {
    try {
        const user = req.user;
        if (!user) {
            throw new Error("You are unauthorized!");
        }

        const { postId } = req.params;
        const isAdmin = user.role === UserRole.ADMIN;
        const result = await postService.updatePost(
            postId as string,
            req.body,
            user.id,
            isAdmin,
        );
        return res.status(200).json({
            success: true,
            message: "Post data updated",
            data: result,
        });
    } catch (error: any) {
        return res.status(400).json({
            success: false,
            message: "Post update failed!",
            error: error.message,
        });
    }
};

const deletePost: RequestHandler = async (req, res) => {
    try {
        const user = req.user;
        if (!user) {
            throw new Error("You are unauthorized!");
        }

        const { postId } = req.params;
        const isAdmin = user.role === UserRole.ADMIN;
        const result = await postService.deletePost(
            postId as string,
            user.id,
            isAdmin,
        );
        return res.status(200).json({
            success: true,
            message: "Post data deleted",
            data: result,
        });
    } catch (error: any) {
        return res.status(400).json({
            success: false,
            message: "Post delete failed!",
            error: error.message,
        });
    }
};

const getStats: RequestHandler = async (req, res) => {
    try {
        const result = await postService.getStats();
        res.status(200).json(result);
    } catch (e) {
        const errorMessage =
            e instanceof Error ? e.message : "Stats fetched failed!";
        res.status(400).json({
            error: errorMessage,
            details: e,
        });
    }
};

export const postController = {
    createPost,
    getAllPosts,
    getPostById,
    getMyPosts,
    updatePost,
    deletePost,
    getStats,
};
