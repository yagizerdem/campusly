import type { AppRoles } from "@/src/util/app-roles.ts";
import type { Profile } from "@src/generated/prisma/client.js";

export {};

declare global {
  namespace Express {
    interface Request {
      uid?: string;
      email?: string;
      emailVerified?: boolean;
      role?: AppRoles;
      profile?: Profile;
    }
  }
}
