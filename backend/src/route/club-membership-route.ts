import express, { Router } from "express";
import * as clubMembershipController from "@controller/club-membership-controller.js";
import { authGuard } from "@middleware/authGuard.js";
import { catchAsync } from "@common/catchAsync.js";

const router: Router = express.Router();

router.post(
  "/join-club-req/:clubId",
  authGuard,
  catchAsync(clubMembershipController.sendJoinClubRequest),
);

router.post(
  "/approve-membership/:joinRequestId",
  authGuard,
  catchAsync(clubMembershipController.approveJoinClubRequest),
);

router.post(
  "/reject-membership/:joinRequestId",
  authGuard,
  catchAsync(clubMembershipController.rejectJoinClubRequest),
);

export default router;
