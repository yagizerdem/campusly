import express, { Router, type Request, type Response } from "express";
import * as authController from "@controller/auth-controller.js";

const router: Router = express.Router();

router.get("/is-logged-in", authController.isLoggedIn);

export default router;
