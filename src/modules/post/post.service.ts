import { Post } from "../../generated/prism/client";
import { prisma } from "../../lib/prisma";

const createPost = async (
    data: Omit<Post, "id" | "createdAt" | "updatedAt">,
    userId: string,
) => {
    const result = await prisma.post.create({
        data: {
            ...data,
            authorId: userId,
        },
    });

    return result;
};

const getAllPosts = async (search: string | undefined) => {
    
    const result = await prisma.post.findMany();
    return result;
};

export const postService = {
    createPost,
    getAllPosts,
};
