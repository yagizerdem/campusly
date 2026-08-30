import { ErrorMachineCode } from "@campusly/shared/src/util/error-machine-code.js";
import { AppError } from "./app-error.js";
import HttpStatusCode from "@campusly/shared/src/util/http-status-code.js";
import type { Request } from "express";

export function getRequiredRouteParam(
  value: string | string[] | undefined,
  name: string,
) {
  if (typeof value !== "string" || value.length === 0) {
    throw AppError.from({
      machineCode: ErrorMachineCode.VALIDATION_ERROR,
      message: `${name} is required and must be a string.`,
      statusCode: HttpStatusCode.BAD_REQUEST,
      isOperational: true,
    });
  }

  return value;
}

export function throwValidationError(
  req: Request,
  issues: { path: PropertyKey[]; message: string }[],
  message = "Validation error",
): never {
  throw AppError.from({
    machineCode: ErrorMachineCode.VALIDATION_ERROR,
    message: message,
    statusCode: HttpStatusCode.BAD_REQUEST,
    isOperational: true,
    diagnostic: {
      path: req.path,
      details: issues.map((issue) => ({
        machineCode: ErrorMachineCode.VALIDATION_ERROR,
        message: `${issue.path.join(".")}: ${issue.message}`,
      })),
    },
  });
}
