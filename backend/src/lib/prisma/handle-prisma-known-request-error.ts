import type { Response } from "express";
import { Prisma } from "@/src/generated/prisma/client.js";
import HttpStatusCode from "@campusly/shared/util/http-status-code.js";
import { ApiResponse } from "@/src/common/api-response.js";
import { ErrorMachineCode } from "@/src/util/error-machine-code.js";

export function handlePrismaKnownRequestError(
  error: Prisma.PrismaClientKnownRequestError,
  res: Response,
) {
  switch (error.code) {
    // case "P1000": {
    //   return res.status(HttpStatusCode.NOT_FOUND).json({
    //     error: "Prisma P1000 error",
    //   });
    // }
    default: {
      return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json(
        ApiResponse.from({
          success: false,
          data: null,
          machineCode: ErrorMachineCode.INTERNAL_ERROR,
          message: "Internal server error.",
          statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
        }),
      );
    }
  }
}
