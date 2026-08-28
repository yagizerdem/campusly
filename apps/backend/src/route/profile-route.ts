import express, { Router } from "express";
import * as profileController from "@controller/profile-controller.js";
import { authGuard } from "@middleware/authGuard.js";
import { catchAsync } from "@common/catchAsync.js";
import upload from "@lib/multer/upload.js";

const router: Router = express.Router();

router.get(
  "/is-profile-exist",
  authGuard,
  catchAsync(profileController.isProfileExist),
);

router.post(
  "/create-profile",
  authGuard,
  catchAsync(profileController.createProfile),
);

router.post(
  "/update-profile-metadata",
  authGuard,
  catchAsync(profileController.updateProfileMetaData),
);

router.post(
  "/upload-profile-image",
  authGuard,
  upload.single("profileImage"),
  catchAsync(profileController.uploadProfileImage),
);

router.post(
  "/delete-profile-image",
  authGuard,
  catchAsync(profileController.deleteProfileImage),
);

export default router;
