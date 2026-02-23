import { Router } from "express";
import auth, { UserRole } from "../../middleware/auth";
import { commentController } from "./comment.controller";

const router = Router();

router.get("/author/:authorId", commentController.getCommentByAuthorId);

router.get("/:commentId", commentController.getCommentById);

router.post(
    "/",
    auth(UserRole.user, UserRole.admin),
    commentController.createComment,
);

router.delete(
    "/:commentId",
    auth(UserRole.user, UserRole.admin),
    commentController.deleteComment,
);

router.patch(
    "/:commentId",
    auth(UserRole.user, UserRole.admin),
    commentController.updateComment,
);

router.patch(
    "/:commentId/moderate",
    auth(UserRole.admin),
    commentController.moderateComment,
);

export const commentRouter = router;
