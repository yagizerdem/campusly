import type { AppRoles } from "@/src/util/app-roles.ts";

export {};

declare global {
  namespace Express {
    interface Request {
      uid?: string;
      email?: string;
      emailVerified?: boolean;
      role?: AppRoles;
    }
  }
}
