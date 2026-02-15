import { Router } from "express";
import { postController } from "./post.controller";
import auth, { UserRole } from "../../middleware/auth";

const router = Router();

router.post("/", auth(UserRole.USER, UserRole.ADMIN), postController.createPost);

export const postRouter = router;
