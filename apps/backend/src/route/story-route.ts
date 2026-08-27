import express, { Router } from "express";
import * as storyController from "@controller/story-controller.js";
import { authGuard } from "@middleware/authGuard.js";
import { catchAsync } from "@common/catchAsync.js";
import upload from "@lib/multer/upload.js";

const router: Router = express.Router();

router.post(
  "/create",
  authGuard,
  upload.array("files", 20),
  catchAsync(storyController.createStory),
);

router.get(
  "/club/:clubId",
  authGuard,
  catchAsync(storyController.getStoriesByClubId),
);

router.get(
  "/:storyId",
  authGuard,
  catchAsync(storyController.getStoryById),
);

router.patch(
  "/update/:storyId",
  authGuard,
  catchAsync(storyController.updateStory),
);

router.delete(
  "/delete/:storyId",
  authGuard,
  catchAsync(storyController.deleteStory),
);

export default router;
