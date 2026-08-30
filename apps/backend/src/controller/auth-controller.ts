import type { Request, Response } from "express";
//@ts-ignore
import HttpStatusCode from "@campusly/shared/src/util/http-status-code.js";
import { ApiResponse } from "@common/api-response.js";
import { RegisterValidator } from "@campusly/shared/src/dto/auth-dto.js";
// import { RegisterValidator } from "@packages/shared/dto/auth-dto.js";
import { firebaseApp } from "@/src/firebase.js";
import { FirebaseAuthError, getAuth, UserRecord } from "firebase-admin/auth";
import { firebaseAuthErrorMapper } from "@lib/firebase/auth-error-mapper.js";
import { AppRoles } from "@util/app-roles.js";
import { throwValidationError } from "@common/route-validation.js";

export function isLoggedIn(_: Request, res: Response) {
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
      throw throwValidationError(
        req,
        error.issues,
        "Invalid registration data.",
      );
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
