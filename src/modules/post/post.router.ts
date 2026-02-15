import { Router } from "express";
import { postController } from "./post.controller";
import auth from "../../middleware/auth";

const router = Router();

router.post("/", auth("USER"), postController.createPost);

export const postRouter = router;
