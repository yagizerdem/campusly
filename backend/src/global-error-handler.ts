import type { ErrorRequestHandler } from "express";
import { ApiResponse } from "@common/api-response.js";
import { AppError } from "@common/app-error.js";
import { ErrorMachineCode } from "@util/error-machine-code.js";
import HttpStatusCode from "@util/http-status-code.js";

export const globalErrorHandler: ErrorRequestHandler = (
  error: unknown,
  _req,
  res,
  next,
) => {
  if (res.headersSent) {
    next(error);
    return;
  }

  if (error instanceof AppError && error.isOperational) {
    res
      .status(error.statusCode)
      .json(
        ApiResponse.error(error.statusCode, error.machineCode, error.message),
      );
    return;
  }

  console.error("Unhandled application error:", error);

  res
    .status(HttpStatusCode.INTERNAL_SERVER_ERROR)
    .json(
      ApiResponse.internalServerError(
        ErrorMachineCode.INTERNAL_ERROR,
        "Internal server error.",
      ),
    );
};
