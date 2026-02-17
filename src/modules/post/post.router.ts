import { Router } from "express";
import { postController } from "./post.controller";
import auth, { UserRole } from "../../middleware/auth";

const router = Router();

router.get("/", postController.getAllPosts);

router.get("/:postId", postController.getPostById);

router.get(
    "/getMyPost/my-posts",
    auth(UserRole.USER, UserRole.ADMIN),
    postController.getMyPosts,
);

router.post(
    "/",
    auth(UserRole.USER, UserRole.ADMIN),
    postController.createPost,
);

router.patch(
    "/:postId",
    auth(UserRole.USER, UserRole.ADMIN),
    postController.updatePost,
);

export const postRouter = router;
