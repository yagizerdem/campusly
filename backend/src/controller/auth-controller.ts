import type { Request, Response, NextFunction } from "express";
import HttpStatusCode from "@util/http-status-code.js";
import { ApiResponse } from "@common/api-response.js";

export function isLoggedIn(req: Request, res: Response) {
  return res
    .status(HttpStatusCode.OK)
    .json(ApiResponse.success("User is logged in."));
}
