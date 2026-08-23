import express, { Router, type Request, type Response } from "express";
import * as auditController from "@controller/audit-controller.js";
import { authGuard } from "@middleware/authGuard.js";

const router: Router = express.Router();

router.get("/get-audit", authGuard, auditController.getAudits);

export default router;
