import express, { Router } from "express";
import * as postController from "@controller/post-controller.js";
import { authGuard } from "@middleware/authGuard.js";
import { catchAsync } from "@common/catchAsync.js";
import upload from "@lib/multer/upload.js";

const router: Router = express.Router();

router.post(
  "/create",
  authGuard,
  upload.array("files", 20),
  catchAsync(postController.createPost),
);

router.post(
  "/delete/:postId",
  authGuard,
  catchAsync(postController.deletePost),
);

// public route
router.get("/get-posts", catchAsync(postController.fetchFeedPosts));

export default router;
