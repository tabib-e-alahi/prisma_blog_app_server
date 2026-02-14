import { prisma } from "../../lib/prisma";

const createPost = async({ title, content }: { title: String; content: string }) => {
    const result = await prisma.post.create({
      title: title as string,

    })
};

export const postService = {
    createPost,
};
