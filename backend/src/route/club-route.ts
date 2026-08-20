import express, { Router } from "express";
import * as clubController from "@controller/club-controller.js";
import { authGuard } from "@middleware/authGuard.js";
import { catchAsync } from "@common/catchAsync.js";
import upload from "@lib/multer/upload.js";

const router: Router = express.Router();

router.post("/create", authGuard, catchAsync(clubController.createClub));

router.post("/update", authGuard, catchAsync(clubController.updateClub));

router.post(
  "/upload-logo/:clubId",
  authGuard,
  upload.single("logoImage"),
  catchAsync(clubController.uploadLogo),
);

router.post(
  "/delete-logo/:clubId",
  authGuard,
  catchAsync(clubController.deleteLogo),
);

export default router;
