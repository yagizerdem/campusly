import type { Request, Response, NextFunction } from "express";
import HttpStatusCode from "@campusly/shared/util/http-status-code.js";
import { ApiResponse } from "@common/api-response.js";
import { throwIfUidNotExist } from "@common/uid-validator.js";
import { CreatePostValidator } from "@packages/shared/dto/post-dto.js";
import { AppError } from "@common/app-error.js";
import { ErrorMachineCode } from "@util/error-machine-code.js";

export async function createPost(req: Request, res: Response) {
  const adminUid = req.uid!;
  throwIfUidNotExist(req);

  //   const { success, data, error } = await CreatePostValidator.safeParseAsync(
  //     req.body,
  //   );

  //   if (!success) {
  //     throw AppError.from({
  //       machineCode: ErrorMachineCode.VALIDATION_ERROR,
  //       message: "Validation error",
  //       statusCode: HttpStatusCode.BAD_REQUEST,
  //       isOperational: true,
  //       diagnostic: {
  //         path: req.path,
  //         details: error.issues.map((issue) => ({
  //           machineCode: ErrorMachineCode.VALIDATION_ERROR,
  //           message: `${issue.path.join(".")}: ${issue.message}`,
  //         })),
  //       },
  //     });
  //   }

  const files = req.files as Express.Multer.File[];

  //   const post = await postService.createPost(adminUid, data);

  return res
    .status(HttpStatusCode.OK)
    .json(ApiResponse.ok("Post created successfully", null));
}
