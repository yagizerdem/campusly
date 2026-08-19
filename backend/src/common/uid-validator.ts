import type { Request } from "express";
import { AppError } from "./app-error.js";
import HttpStatusCode from "../util/http-status-code.js";
import { ErrorMachineCode } from "../util/error-machine-code.js";

export function throwIfUidNotExist(req: Request) {
  if (!req.uid) {
    throw AppError.from({
      machineCode: ErrorMachineCode.UID_NOT_FOUND,
      message: "UID is not found in the request object.",
      statusCode: HttpStatusCode.BAD_REQUEST,
      isOperational: true,
    });
  }
}
