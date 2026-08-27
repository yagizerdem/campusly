import express, { Router } from "express";
import * as likeController from "@controller/like-controller.js";
import { authGuard } from "@middleware/authGuard.js";
import { catchAsync } from "@common/catchAsync.js";

const router: Router = express.Router();

router.post("/create/:postId", authGuard, catchAsync(likeController.likePost));

router.post(
  "/delete/:likeId",
  authGuard,
  catchAsync(likeController.unlikePost),
);

export default router;
