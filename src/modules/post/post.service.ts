import { prisma } from "../../lib/prisma";

const createPost = async({ title, content }: { title: string; content: string }) => {
    const result = await prisma.post.create({
      data: {
            title, content
      }
    })
};

export const postService = {
    createPost,
};
