import { RequestHandler } from "express";
import { commentService } from "./comment.service";
import { error } from "node:console";
import { success } from "better-auth/*";

const createComment: RequestHandler = async (req, res) => {
    try {
        const user = req.user;
        req.body.authorId = user?.id;

        const result = await commentService.createComment(req.body);

        return res.status(201).json({
            success: true,
            message: "Comment created successfully",
            data: result,
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: "Comment creation failed!",
            error: error.message,
        });
    }
};
const getCommentById: RequestHandler = async (req, res) => {
    try {
        const { commentId } = req.params;
        const result = await commentService.getCommentById(commentId as string);

        return res.status(201).json({
            success: true,
            message: "Comment Fetched successfully",
            data: result,
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: "Comment creation failed!",
            error: error.message,
        });
    }
};
const getCommentByAuthorId: RequestHandler = async (req, res) => {
    try {
        const { authorId } = req.params;
        const result = await commentService.getCommentByAuthorId(
            authorId as string,
        );

        return res.status(201).json({
            success: true,
            message: "Comment Fetched successfully",
            data: result,
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: "Comment creation failed!",
            error: error.message,
        });
    }
};

const deleteComment: RequestHandler = async (req, res) => {
    try {
        const user = req.user;
        const { commentId } = req.params;
        const result = await commentService.deleteComment(
            commentId as string,
            user?.id as string,
        );
        return res.status(201).json({
            success: true,
            message: "Comment deleted successfully",
            data: result,
        });
    } catch (error: any) {
        console.log(error);
        res.status(400).json({
            success: false,
            message: "Comment delete failed!",
            error: error,
        });
    }
};

const updateComment: RequestHandler = async (req, res) => {
    try {
        const user = req.user;
        const { commentId } = req.params;
        const result = await commentService.updateComment(
            commentId as string,
            req.body,
            user?.id as string,
        );
        return res.status(201).json({
            success: true,
            message: "Comment updated successfully",
            data: result,
        });
    } catch (error: any) {
        console.log(error);
        res.status(400).json({
            success: false,
            message: "Comment update failed!",
            error: error.message,
        });
    }
};

const moderateComment: RequestHandler = async (req, res) => {
    try {
        const { commentId } = req.params;
        const result = await commentService.moderateComment(
            commentId as string,
            req.body,
        );

        return res.status(201).json({
            success: true,
            message: "Comment status updated",
            data: result,
        });
    } catch (error: any) {
        console.log(error);
        res.status(400).json({
            success: false,
            message: "Comment status update failed!",
            error: error.message,
        });
    }
};

export const commentController = {
    createComment,
    getCommentById,
    getCommentByAuthorId,
    deleteComment,
    updateComment,
    moderateComment,
};
