import express, { Router } from "express";
import * as commentController from "@controller/comment-controller.js";
import { authGuard } from "@middleware/authGuard.js";
import { catchAsync } from "@common/catchAsync.js";

const router: Router = express.Router();

router.post(
  "/create/:postId",
  authGuard,
  catchAsync(commentController.createComment),
);

router.post(
  "/update/:commentId",
  authGuard,
  catchAsync(commentController.updateComment),
);

router.post(
  "/delete/:commentId",
  authGuard,
  catchAsync(commentController.deleteComment),
);

export default router;
