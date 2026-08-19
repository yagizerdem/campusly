import express, { Router } from "express";
import * as clubController from "@controller/club-controller.js";
import { authGuard } from "@middleware/authGuard.js";
import { catchAsync } from "@common/catchAsync.js";

const router: Router = express.Router();

router.post("/club-create", authGuard, catchAsync(clubController.createClub));

router.post("/club-update", authGuard, catchAsync(clubController.updateClub));

export default router;
