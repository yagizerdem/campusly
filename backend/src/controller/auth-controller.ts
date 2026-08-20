import type { Request, Response, NextFunction } from "express";
//@ts-ignore
import HttpStatusCode from "@campusly/shared/util/http-status-code.js";
import { ApiResponse } from "@common/api-response.js";
import { RegisterValidator } from "@packages/shared/dto/auth-dto.js";
import { AppError } from "@common/app-error.js";
import { ErrorMachineCode } from "@util/error-machine-code.js";
import { firebaseApp } from "../firebase.js";
import { FirebaseAuthError, getAuth, UserRecord } from "firebase-admin/auth";
import { firebaseAuthErrorMapper } from "@lib/firebase/auth-error-mapper.js";
import { AppRoles } from "@util/app-roles.js";

export function isLoggedIn(req: Request, res: Response) {
  return res
    .status(HttpStatusCode.OK)
    .json(ApiResponse.success("User is logged in."));
}

export async function register(req: Request, res: Response) {
  try {
    const { success, data, error } = await RegisterValidator.safeParseAsync(
      req.body,
    );

    if (!success) {
      throw AppError.from({
        machineCode: ErrorMachineCode.VALIDATION_ERROR,
        message: "Validation error",
        statusCode: HttpStatusCode.BAD_REQUEST,
        isOperational: true,
        diagnostic: {
          path: req.path,
          details: error.issues.map((issue) => ({
            machineCode: ErrorMachineCode.VALIDATION_ERROR,
            message: `${issue.path.join(".")}: ${issue.message}`,
          })),
        },
      });
    }

    const auth = getAuth(firebaseApp);

    const userRecord: UserRecord = await auth.createUser({
      email: data.email,
      password: data.password,
    });

    await auth.setCustomUserClaims(userRecord.uid, {
      role: AppRoles.DEFAULT_USER,
    });

    return res.status(HttpStatusCode.CREATED).json(
      ApiResponse.success(
        {
          uid: userRecord.uid,
          email: userRecord.email,
        },
        "User registered successfully.",
      ),
    );
  } catch (err) {
    if (err instanceof FirebaseAuthError) {
      throw firebaseAuthErrorMapper(err);
    }

    throw err;
  }
}
