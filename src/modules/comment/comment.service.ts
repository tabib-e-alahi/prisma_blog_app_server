import { CommentStatus } from "../../generated/prism/enums";
import { prisma } from "../../lib/prisma";

const createComment = async (payload: {
    content: string;
    authorId: string;
    postId: string;
    parentId?: string;
}) => {
    const commentPostData = await prisma.post.findUniqueOrThrow({
        where: {
            id: payload.postId,
        },
    });
    //     if (!commentPostData) {
    //         throw new Error("No post data was found for the post id");
    //     }

    if (payload.parentId) {
        const commentParentData = await prisma.comment.findUniqueOrThrow({
            where: {
                id: payload.parentId,
            },
        });
    }

    return await prisma.comment.create({
        data: payload,
    });
};

const getCommentById = async (commentId: string) => {
    const result = await prisma.comment.findUnique({
        where: {
            id: commentId,
        },
        include: {
            post: {
                select: {
                    id: true,
                    title: true,
                },
            },
        },
    });

    return result;
};

const getCommentByAuthorId = async (authorId: string) => {
    const result = await prisma.comment.findMany({
        where: {
            authorId,
        },
        orderBy: { createdAt: "desc" },
        include: {
            post: {
                select: {
                    id: true,
                    title: true,
                },
            },
        },
    });

    return result;
};

// 1. nijar comment delete korta parbe
// login thakte hobe
// tar nijar comment kina ata check korta hobe
const deleteComment = async (commentId: string, authorId: string) => {
    const commentData = await prisma.comment.findFirst({
        where: {
            id: commentId,
            authorId,
        },
        select: {
            id: true,
        },
    });

    if (!commentData) {
        throw new Error("Your provided input is invalid!");
    }

    return await prisma.comment.delete({
        where: {
            id: commentData.id,
        },
    });
};

const updateComment = async (
    commentId: string,
    data: { content?: string; status?: CommentStatus },
    authorId: string,
) => {
    const commentData = await prisma.comment.findFirst({
        where: {
            id: commentId,
            authorId,
        },
        select: {
            id: true,
        },
    });

    if (!commentData) {
        throw new Error("Your provided input is invalid!");
    }

    return await prisma.comment.update({
        where: {
            id: commentId,
            authorId,
        },
        data,
    });
};

const moderateComment = async (
    commentId: string,
    data: { status: CommentStatus },
) => {
    const commentData = await prisma.comment.findUniqueOrThrow({
        where: {
            id: commentId,
        },
        select: {
            id: true,
            status: true,
        },
    });

    if (commentData.status === data.status) {
        throw new Error(
            `This comment '${commentData.status}' is already .`,
        );
    }

    return await prisma.comment.update({
        where: {
            id: commentId,
        },
        data,
    });
};

export const commentService = {
    createComment,
    getCommentById,
    getCommentByAuthorId,
    deleteComment,
    updateComment,
    moderateComment,
};
