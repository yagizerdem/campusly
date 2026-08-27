import { firebaseApp } from "@src/firebase.js";

import type { Request, Response, NextFunction } from "express";
import { FirebaseAuthError, getAuth } from "firebase-admin/auth";
import { AppError } from "@common/app-error.js";
import { ErrorMachineCode } from "@campusly/shared/util/error-machine-code.js";
import { firebaseAuthErrorMapper } from "@/src/lib/firebase/auth-error-mapper.js";
import { AppRoles } from "@util/app-roles.js";

export async function authGuard(
  req: Request,
  _res: Response,
  next: NextFunction,
) {
  try {
    // client shoudl send bearer firebase-id-token in the Authorization header
    const authHeader = req.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw AppError.unprocessableEntity(
        ErrorMachineCode.INVALID_TOKEN,
        "Authorization header is missing or invalid.",
      );
    }

    const firebaseIdToken = authHeader.split(" ")[1]?.trim();

    if (!firebaseIdToken) {
      throw AppError.unprocessableEntity(
        ErrorMachineCode.INVALID_TOKEN,
        "Firebase ID token is missing.",
      );
    }

    const decodedToken = await getAuth(firebaseApp).verifyIdToken(
      firebaseIdToken,
      true,
    );

    const uid = decodedToken.uid;
    req.uid = uid;
    if (decodedToken.email) {
      req.email = decodedToken.email;
    }
    if (decodedToken.email_verified) {
      req.emailVerified = decodedToken.email_verified;
    }

    const role = decodedToken.role ?? AppRoles.DEFAULT_USER;
    req.role = role;

    next();
  } catch (error) {
    if (error instanceof FirebaseAuthError) {
      throw firebaseAuthErrorMapper(error);
    }
    throw error;
  }
}
