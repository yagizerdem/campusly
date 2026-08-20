import type { ErrorRequestHandler } from "express";
import { ApiResponse } from "@common/api-response.js";
import { AppError } from "@common/app-error.js";
import { ErrorMachineCode } from "@util/error-machine-code.js";
import HttpStatusCode from "@campusly/shared/util/http-status-code.js";
import { Prisma } from "@/src/generated/prisma/client.js";
import { handlePrismaKnownRequestError } from "@lib/prisma/handle-prisma-known-request-error.js";
import { FirebaseAppError } from "firebase-admin/app";

export const globalErrorHandler: ErrorRequestHandler = (
  error: unknown,
  _req,
  res,
  next,
) => {
  console.log(error);

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

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    handlePrismaKnownRequestError(error, res);
    return;
  }

  if (error instanceof FirebaseAppError) {
  }
  res
    .status(HttpStatusCode.INTERNAL_SERVER_ERROR)
    .json(
      ApiResponse.internalServerError(
        ErrorMachineCode.INTERNAL_ERROR,
        "Internal server error.",
      ),
    );
};
