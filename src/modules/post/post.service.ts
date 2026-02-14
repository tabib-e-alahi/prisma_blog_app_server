import { Post } from "../../generated/prism/client";
import { prisma } from "../../lib/prisma";

const createPost = async (data: Post) => {
    const result = await prisma.post.create({
        data,
    });

    return result.send()
};

export const postService = {
    createPost,
};
