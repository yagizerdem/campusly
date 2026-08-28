import HttpStatusCode from "@campusly/shared/src/util/http-status-code.js";
import type { Request, Response } from "express";
import { ApiResponse } from "@common/api-response.js";
import { throwIfUidNotExist } from "@common/uid-validator.js";
import * as auditService from "@service/audit-service.js";

export async function getAudits(req: Request, res: Response) {
  throwIfUidNotExist(req);
  const adminUid = req.uid!;

  const audits = await auditService.getAuditLogsOfUser(
    adminUid,
    (req.query ?? {}) as Record<string, string | undefined>,
  );

  return res
    .status(HttpStatusCode.OK)
    .json(ApiResponse.success(audits, "Audits retrieved successfully."));
}
