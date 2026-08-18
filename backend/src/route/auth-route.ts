import express, { Router, type Request, type Response } from "express";
import * as authController from "@controller/auth-controller.js";
import { authGuard } from "../middleware/authGuard.js";

const router: Router = express.Router();

router.get("/is-logged-in", authGuard, authController.isLoggedIn);

export default router;
