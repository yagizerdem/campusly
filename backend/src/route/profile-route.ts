import express, { Router } from "express";
import * as profileController from "@controller/profile-controller.js";
import { authGuard } from "@middleware/authGuard.js";
import { catchAsync } from "../common/catchAsync.js";

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

export default router;
