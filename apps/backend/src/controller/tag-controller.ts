import type { Request, Response } from "express";
import HttpStatusCode from "@campusly/shared/src/util/http-status-code.js";
import { ApiResponse } from "@common/api-response.js";
import { throwIfUidNotExist } from "@common/uid-validator.js";
import {
  AssignTagValidator,
  RemoveAssignedTagValidator,
} from "@campusly/shared/src/dto/tag-dto.js";
import * as tagService from "@service/tag-service.js";
import { throwValidationError } from "@common/route-validation.js";

export async function assignTag(req: Request, res: Response) {
  const adminUid = req.uid!;
  throwIfUidNotExist(req);

  const { success, data, error } = await AssignTagValidator.safeParseAsync(
    req.body,
  );

  if (!success) {
    throwValidationError(req, error.issues);
  }

  const response = await tagService.assignTag(adminUid, data);

  return res
    .status(HttpStatusCode.OK)
    .json(ApiResponse.success(response, "Tag assigned successfully."));
}

export async function removeAssignedTag(req: Request, res: Response) {
  const adminUid = req.uid!;
  throwIfUidNotExist(req);

  const { success, data, error } =
    await RemoveAssignedTagValidator.safeParseAsync(req.body);

  if (!success) {
    throwValidationError(req, error.issues);
  }

  const response = await tagService.removeAssignedTag(adminUid, data);

  return res
    .status(HttpStatusCode.OK)
    .json(ApiResponse.success(response, "Tag removed successfully."));
}
