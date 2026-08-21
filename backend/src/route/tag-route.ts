import express, { Router } from "express";
import * as tagController from "@controller/tag-controller.js";
import { authGuard } from "@middleware/authGuard.js";
import { catchAsync } from "@common/catchAsync.js";

const router: Router = express.Router();

router.post("/assign-tag", authGuard, catchAsync(tagController.assignTag));

router.post(
  "/remove-assigned-tag",
  authGuard,
  catchAsync(tagController.removeAssignedTag),
);

export default router;
