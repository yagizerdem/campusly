import express, { Router } from "express";
import * as profileController from "@controller/profile-controller.js";
import { authGuard } from "@middleware/authGuard.js";

const router: Router = express.Router();

router.get("/is-profile-exist", authGuard, profileController.isProfileExist);

router.post("/create-profile", authGuard, profileController.createProfile);

export default router;
