import { RequestHandler } from "express";
import { postService } from "./post.service";
import { PostStatus } from "../../generated/prism/enums";
import paginationSortingHelper from "../../helpers/paginationSortingHelper";

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

const getMyPosts: RequestHandler = async(req, res) =>{
    try {
        const user = req.user;
        if(!user){
            throw new Error("");
            
        }
    } catch (error) {
        
    }
}

export const postController = {
    createPost,
    getAllPosts,
    getPostById,
    getMyPosts
};
