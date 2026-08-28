import express, { Router } from "express";
import * as authController from "@controller/auth-controller.js";
import { authGuard } from "@middleware/authGuard.js";
import { catchAsync } from "@common/catchAsync.js";

const router: Router = express.Router();

router.get("/is-logged-in", authGuard, authController.isLoggedIn);

router.post("/register", catchAsync(authController.register));

export default router;
