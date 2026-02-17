import { CommentStatus, Post, PostStatus } from "../../generated/prism/client";
import { PostWhereInput } from "../../generated/prism/models";
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

const getAllPosts = async ({
    search,
    tags,
    isFeatured,
    status,
    page,
    limit,
    skip,
    sortBy,
    sortOrder,
}: {
    search: string | undefined;
    tags: string[] | [];
    isFeatured: boolean | undefined;
    status: PostStatus | undefined;
    page: number;
    limit: number;
    skip: number;
    sortBy: string;
    sortOrder: string;
}) => {
    const andConditions: PostWhereInput[] = [];

    if (search) {
        andConditions.push({
            OR: [
                {
                    title: {
                        contains: search,
                        mode: "insensitive",
                    },
                },
                {
                    content: {
                        contains: search,
                        mode: "insensitive",
                    },
                },
                {
                    tags: {
                        has: search,
                    },
                },
            ],
        });
    }

    if (tags.length > 0) {
        andConditions.push({
            tags: {
                hasEvery: tags,
            },
        });
    }

    if (typeof isFeatured === "boolean") {
        andConditions.push({
            isFeatured,
        });
    }

    if (status) {
        andConditions.push({
            status,
        });
    }

    const result = await prisma.post.findMany({
        take: limit,
        skip,
        where: {
            AND: andConditions,
        },
        orderBy: { [sortBy]: sortOrder },
        include: {
            _count: {
                select: {
                    comments: true,
                },
            },
        },
    });

    const total = await prisma.post.count({
        where: {
            AND: andConditions,
        },
    });
    return {
        data: result,
        pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        },
    };
};

const getPostById = async (postId: string) => {
    return await prisma.$transaction(async (tx) => {
        await tx.post.update({
            where: {
                id: postId,
            },
            data: {
                views: {
                    increment: 1,
                },
            },
        });

        const postData = await tx.post.findUnique({
            where: {
                id: postId,
            },
            include: {
                comments: {
                    where: {
                        parentId: null, // for root comment
                        status: CommentStatus.APPROVED, // if only want to show approved comments
                    },
                    orderBy: { createdAt: "desc" },
                    // now replies of the root comment
                    include: {
                        replies: {
                            orderBy: { createdAt: "asc" },
                            include: {
                                // replies of the reples
                                replies: true,
                            },
                        },
                        _count: {
                            select: {
                                replies: true,
                            },
                        },
                    },
                },
                _count: {
                    select: {
                        comments: true,
                    },
                },
            },
        });

        return postData;
    });
};

const getMyPosts = async (authorId: string) => {
    await prisma.user.findUniqueOrThrow({
        where: {
            id: authorId,
            status: "ACTIVE", // only active user can fetched their data
        },
        select: {
            id: true,
        },
    });

    const result = await prisma.post.findMany({
        where: {
            authorId,
        },
        orderBy: {
            createdAt: "desc",
        },
        include: {
            _count: {
                select: {
                    comments: true,
                },
            },
        },
    });

    // const total = await prisma.post.aggregate({
    //     _count: {
    //         id: true
    //     },
    //     where: {
    //         authorId
    //     }
    // })

    return result;
};

//**
// user - sudhu nijar post update korta parbe, isFeatured update korta parbe na
// admin - sobar post update korta parbe.
// */

const updatePost = async (postId: string, data: Partial<Post>, authorId: string, isAdmin: boolean) => {
    const postData = await prisma.post.findUniqueOrThrow({
        where: {
            id: postId
        },
        select: {
            id: true,
            authorId: true
        }
    })

    if (!isAdmin && (postData.authorId !== authorId)) {
        throw new Error("You are not the owner/creator of the post!")
    }

    // only admin isFeatured er value change korte parbe
    if (!isAdmin) {
        delete data.isFeatured 
    }

    const result = await prisma.post.update({
        where: {
            id: postData.id
        },
        data
    })

    return result;

}

//** 
// 1. user - nijar created post delete korta parbe
// 2. admin - sobar post delete korta parbe
// */
const deletePost = async (postId: string, authorId: string, isAdmin: boolean) => {
    const postData = await prisma.post.findUniqueOrThrow({
        where: {
            id: postId
        },
        select: {
            id: true,
            authorId: true
        }
    })

    if (!isAdmin && (postData.authorId !== authorId)) {
        throw new Error("You are not the owner/creator of the post!")
    }

    return await prisma.post.delete({
        where: {
            id: postId
        }
    })

}

export const postService = {
    createPost,
    getAllPosts,
    getPostById,
    getMyPosts,
    updatePost,
    deletePost
};
