import express, { Router } from "express";
import * as clubEventController from "@controller/club-event-controller.js";
import { catchAsync } from "@common/catchAsync.js";
import upload from "@lib/multer/upload.js";
import { authGuard } from "@middleware/authGuard.js";

const router: Router = express.Router();

router.post(
  "/create",
  authGuard,
  upload.array("files", 20),
  catchAsync(clubEventController.createClubEvent),
);

router.get(
  "/club/:clubId",
  authGuard,
  catchAsync(clubEventController.getClubEventsByClubId),
);

router.get(
  "/event/:clubEventId",
  authGuard,
  catchAsync(clubEventController.getClubEventById),
);

router.post(
  "/update/:clubEventId",
  authGuard,
  catchAsync(clubEventController.updateClubEvent),
);

router.post(
  "/delete/:clubEventId",
  authGuard,
  catchAsync(clubEventController.deleteClubEvent),
);

router.get("/feed", catchAsync(clubEventController.fetchClubEventsForFeed));

router.get(
  "/images/:clubEventId",
  catchAsync(clubEventController.fetchClubEventImages),
);

export default router;
