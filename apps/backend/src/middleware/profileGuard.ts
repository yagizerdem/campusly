import type { Request, Response, NextFunction } from "express";
import { AppError } from "@common/app-error.js";
import { ErrorMachineCode } from "@campusly/shared/src/util/error-machine-code.js";
import { prisma } from "@lib/prisma.js";
import type { Profile } from "@src/generated/prisma/client.js";

export async function profileGuard(allowAnonymous: boolean = false) {
  return async function (req: Request, _res: Response, next: NextFunction) {
    if (allowAnonymous) {
      return next();
    }

    if (!req.uid) {
      throw AppError.unauthorized(
        ErrorMachineCode.UNAUTHORIZED,
        "User is not authenticated.",
      );
    }

    const uid = req.uid;
    const profile: Profile | null = await prisma.profile.findFirst({
      where: {
        id: uid,
      },
    });

    if (!profile) {
      throw AppError.unauthorized(
        ErrorMachineCode.UNAUTHORIZED,
        "User profile not found.",
      );
    }

    req.profile = profile;

    next();
  };
}
