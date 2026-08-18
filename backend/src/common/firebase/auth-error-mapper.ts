import type { FirebaseAppError } from "firebase-admin";
import { AppError } from "@common/app-error.js";
import { ErrorMachineCode } from "@/src/util/error-machine-code.js";
import HttpStatusCode from "@/src/util/http-status-code.js";

export function firebaseAuthErrorMapper(error: FirebaseAppError): never {
  switch (error.code) {
    case "auth/claims-too-large": {
      throw AppError.from({
        message: error.message || "The custom claims payload is too large.",
        statusCode: HttpStatusCode.BAD_REQUEST,
        machineCode: ErrorMachineCode.FIREBASE_ERROR,
        cause: error,
        isOperational: true,
      });
    }

    case "auth/email-already-exists": {
      throw AppError.from({
        message: error.message || "The provided email is already in use.",
        statusCode: HttpStatusCode.CONFLICT,
        machineCode: ErrorMachineCode.FIREBASE_ERROR,
        cause: error,
        isOperational: true,
      });
    }

    case "auth/id-token-expired": {
      throw AppError.from({
        message: error.message || "The Firebase ID token has expired.",
        statusCode: HttpStatusCode.UNAUTHORIZED,
        machineCode: ErrorMachineCode.FIREBASE_ERROR,
        cause: error,
        isOperational: true,
      });
    }

    case "auth/id-token-revoked": {
      throw AppError.from({
        message: error.message || "The Firebase ID token has been revoked.",
        statusCode: HttpStatusCode.UNAUTHORIZED,
        machineCode: ErrorMachineCode.FIREBASE_ERROR,
        cause: error,
        isOperational: true,
      });
    }

    case "auth/insufficient-permission": {
      throw AppError.from({
        message:
          error.message ||
          "The Firebase Admin SDK credential has insufficient permissions.",
        statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
        machineCode: ErrorMachineCode.FIREBASE_ERROR,
        cause: error,
        isOperational: false,
      });
    }

    case "auth/internal-error": {
      throw AppError.from({
        message:
          error.message ||
          "Firebase Authentication encountered an internal error.",
        statusCode: HttpStatusCode.BAD_GATEWAY,
        machineCode: ErrorMachineCode.FIREBASE_ERROR,
        cause: error,
        isOperational: false,
      });
    }

    case "auth/invalid-argument": {
      throw AppError.from({
        message:
          error.message ||
          "An invalid argument was provided to Firebase Authentication.",
        statusCode: HttpStatusCode.BAD_REQUEST,
        machineCode: ErrorMachineCode.FIREBASE_ERROR,
        cause: error,
        isOperational: true,
      });
    }

    case "auth/invalid-claims": {
      throw AppError.from({
        message: error.message || "The provided custom claims are invalid.",
        statusCode: HttpStatusCode.BAD_REQUEST,
        machineCode: ErrorMachineCode.FIREBASE_ERROR,
        cause: error,
        isOperational: true,
      });
    }

    case "auth/invalid-continue-uri": {
      throw AppError.from({
        message: error.message || "The continue URL is invalid.",
        statusCode: HttpStatusCode.BAD_REQUEST,
        machineCode: ErrorMachineCode.FIREBASE_ERROR,
        cause: error,
        isOperational: true,
      });
    }

    case "auth/invalid-creation-time": {
      throw AppError.from({
        message: error.message || "The creation time is invalid.",
        statusCode: HttpStatusCode.BAD_REQUEST,
        machineCode: ErrorMachineCode.FIREBASE_ERROR,
        cause: error,
        isOperational: true,
      });
    }

    case "auth/invalid-credential": {
      throw AppError.from({
        message:
          error.message ||
          "The Firebase Admin SDK credential is invalid for this operation.",
        statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
        machineCode: ErrorMachineCode.FIREBASE_ERROR,
        cause: error,
        isOperational: false,
      });
    }

    case "auth/invalid-disabled-field": {
      throw AppError.from({
        message: error.message || "The disabled field must be a boolean.",
        statusCode: HttpStatusCode.BAD_REQUEST,
        machineCode: ErrorMachineCode.FIREBASE_ERROR,
        cause: error,
        isOperational: true,
      });
    }

    case "auth/invalid-display-name": {
      throw AppError.from({
        message: error.message || "The provided display name is invalid.",
        statusCode: HttpStatusCode.BAD_REQUEST,
        machineCode: ErrorMachineCode.FIREBASE_ERROR,
        cause: error,
        isOperational: true,
      });
    }

    case "auth/invalid-dynamic-link-domain": {
      throw AppError.from({
        message:
          error.message ||
          "The provided dynamic link domain is invalid or unauthorized.",
        statusCode: HttpStatusCode.BAD_REQUEST,
        machineCode: ErrorMachineCode.FIREBASE_ERROR,
        cause: error,
        isOperational: true,
      });
    }

    case "auth/invalid-email": {
      throw AppError.from({
        message: error.message || "The provided email address is invalid.",
        statusCode: HttpStatusCode.BAD_REQUEST,
        machineCode: ErrorMachineCode.FIREBASE_ERROR,
        cause: error,
        isOperational: true,
      });
    }

    case "auth/invalid-email-verified": {
      throw AppError.from({
        message: error.message || "The emailVerified field must be a boolean.",
        statusCode: HttpStatusCode.BAD_REQUEST,
        machineCode: ErrorMachineCode.FIREBASE_ERROR,
        cause: error,
        isOperational: true,
      });
    }

    case "auth/invalid-hash-algorithm": {
      throw AppError.from({
        message: error.message || "The hash algorithm is invalid.",
        statusCode: HttpStatusCode.BAD_REQUEST,
        machineCode: ErrorMachineCode.FIREBASE_ERROR,
        cause: error,
        isOperational: true,
      });
    }

    case "auth/invalid-hash-block-size": {
      throw AppError.from({
        message: error.message || "The hash block size is invalid.",
        statusCode: HttpStatusCode.BAD_REQUEST,
        machineCode: ErrorMachineCode.FIREBASE_ERROR,
        cause: error,
        isOperational: true,
      });
    }

    case "auth/invalid-hash-derived-key-length": {
      throw AppError.from({
        message: error.message || "The hash derived key length is invalid.",
        statusCode: HttpStatusCode.BAD_REQUEST,
        machineCode: ErrorMachineCode.FIREBASE_ERROR,
        cause: error,
        isOperational: true,
      });
    }

    case "auth/invalid-hash-key": {
      throw AppError.from({
        message: error.message || "The hash key is invalid.",
        statusCode: HttpStatusCode.BAD_REQUEST,
        machineCode: ErrorMachineCode.FIREBASE_ERROR,
        cause: error,
        isOperational: true,
      });
    }

    case "auth/invalid-hash-memory-cost": {
      throw AppError.from({
        message: error.message || "The hash memory cost is invalid.",
        statusCode: HttpStatusCode.BAD_REQUEST,
        machineCode: ErrorMachineCode.FIREBASE_ERROR,
        cause: error,
        isOperational: true,
      });
    }

    case "auth/invalid-hash-parallelization": {
      throw AppError.from({
        message: error.message || "The hash parallelization value is invalid.",
        statusCode: HttpStatusCode.BAD_REQUEST,
        machineCode: ErrorMachineCode.FIREBASE_ERROR,
        cause: error,
        isOperational: true,
      });
    }

    case "auth/invalid-hash-rounds": {
      throw AppError.from({
        message: error.message || "The hash rounds value is invalid.",
        statusCode: HttpStatusCode.BAD_REQUEST,
        machineCode: ErrorMachineCode.FIREBASE_ERROR,
        cause: error,
        isOperational: true,
      });
    }

    case "auth/invalid-hash-salt-separator": {
      throw AppError.from({
        message: error.message || "The hash salt separator is invalid.",
        statusCode: HttpStatusCode.BAD_REQUEST,
        machineCode: ErrorMachineCode.FIREBASE_ERROR,
        cause: error,
        isOperational: true,
      });
    }

    case "auth/invalid-id-token": {
      throw AppError.from({
        message: error.message || "The Firebase ID token is invalid.",
        statusCode: HttpStatusCode.UNAUTHORIZED,
        machineCode: ErrorMachineCode.FIREBASE_ERROR,
        cause: error,
        isOperational: true,
      });
    }

    case "auth/invalid-last-sign-in-time": {
      throw AppError.from({
        message: error.message || "The last sign-in time is invalid.",
        statusCode: HttpStatusCode.BAD_REQUEST,
        machineCode: ErrorMachineCode.FIREBASE_ERROR,
        cause: error,
        isOperational: true,
      });
    }

    case "auth/invalid-page-token": {
      throw AppError.from({
        message: error.message || "The Firebase page token is invalid.",
        statusCode: HttpStatusCode.BAD_REQUEST,
        machineCode: ErrorMachineCode.FIREBASE_ERROR,
        cause: error,
        isOperational: true,
      });
    }

    case "auth/invalid-password": {
      throw AppError.from({
        message: error.message || "The provided password is invalid.",
        statusCode: HttpStatusCode.BAD_REQUEST,
        machineCode: ErrorMachineCode.FIREBASE_ERROR,
        cause: error,
        isOperational: true,
      });
    }

    case "auth/invalid-password-hash": {
      throw AppError.from({
        message: error.message || "The password hash is invalid.",
        statusCode: HttpStatusCode.BAD_REQUEST,
        machineCode: ErrorMachineCode.FIREBASE_ERROR,
        cause: error,
        isOperational: true,
      });
    }

    case "auth/invalid-password-salt": {
      throw AppError.from({
        message: error.message || "The password salt is invalid.",
        statusCode: HttpStatusCode.BAD_REQUEST,
        machineCode: ErrorMachineCode.FIREBASE_ERROR,
        cause: error,
        isOperational: true,
      });
    }

    case "auth/invalid-phone-number": {
      throw AppError.from({
        message: error.message || "The provided phone number is invalid.",
        statusCode: HttpStatusCode.BAD_REQUEST,
        machineCode: ErrorMachineCode.FIREBASE_ERROR,
        cause: error,
        isOperational: true,
      });
    }

    case "auth/invalid-photo-url": {
      throw AppError.from({
        message: error.message || "The provided photo URL is invalid.",
        statusCode: HttpStatusCode.BAD_REQUEST,
        machineCode: ErrorMachineCode.FIREBASE_ERROR,
        cause: error,
        isOperational: true,
      });
    }

    case "auth/invalid-provider-data": {
      throw AppError.from({
        message: error.message || "The provider data is invalid.",
        statusCode: HttpStatusCode.BAD_REQUEST,
        machineCode: ErrorMachineCode.FIREBASE_ERROR,
        cause: error,
        isOperational: true,
      });
    }

    case "auth/invalid-provider-id": {
      throw AppError.from({
        message: error.message || "The provider ID is invalid.",
        statusCode: HttpStatusCode.BAD_REQUEST,
        machineCode: ErrorMachineCode.FIREBASE_ERROR,
        cause: error,
        isOperational: true,
      });
    }

    case "auth/invalid-oauth-responsetype": {
      throw AppError.from({
        message: error.message || "The OAuth response type is invalid.",
        statusCode: HttpStatusCode.BAD_REQUEST,
        machineCode: ErrorMachineCode.FIREBASE_ERROR,
        cause: error,
        isOperational: true,
      });
    }

    case "auth/invalid-session-cookie-duration": {
      throw AppError.from({
        message: error.message || "The session cookie duration is invalid.",
        statusCode: HttpStatusCode.BAD_REQUEST,
        machineCode: ErrorMachineCode.FIREBASE_ERROR,
        cause: error,
        isOperational: true,
      });
    }

    case "auth/invalid-uid": {
      throw AppError.from({
        message: error.message || "The provided UID is invalid.",
        statusCode: HttpStatusCode.BAD_REQUEST,
        machineCode: ErrorMachineCode.FIREBASE_ERROR,
        cause: error,
        isOperational: true,
      });
    }

    case "auth/invalid-user-import": {
      throw AppError.from({
        message: error.message || "The provided user import record is invalid.",
        statusCode: HttpStatusCode.BAD_REQUEST,
        machineCode: ErrorMachineCode.FIREBASE_ERROR,
        cause: error,
        isOperational: true,
      });
    }

    case "auth/maximum-user-count-exceeded": {
      throw AppError.from({
        message:
          error.message ||
          "The maximum allowed number of users to import has been exceeded.",
        statusCode: HttpStatusCode.BAD_REQUEST,
        machineCode: ErrorMachineCode.FIREBASE_ERROR,
        cause: error,
        isOperational: true,
      });
    }

    case "auth/missing-android-pkg-name": {
      throw AppError.from({
        message: error.message || "The Android package name is missing.",
        statusCode: HttpStatusCode.BAD_REQUEST,
        machineCode: ErrorMachineCode.FIREBASE_ERROR,
        cause: error,
        isOperational: true,
      });
    }

    case "auth/missing-continue-uri": {
      throw AppError.from({
        message: error.message || "The continue URL is missing.",
        statusCode: HttpStatusCode.BAD_REQUEST,
        machineCode: ErrorMachineCode.FIREBASE_ERROR,
        cause: error,
        isOperational: true,
      });
    }

    case "auth/missing-hash-algorithm": {
      throw AppError.from({
        message: error.message || "The password hash algorithm is missing.",
        statusCode: HttpStatusCode.BAD_REQUEST,
        machineCode: ErrorMachineCode.FIREBASE_ERROR,
        cause: error,
        isOperational: true,
      });
    }

    case "auth/missing-ios-bundle-id": {
      throw AppError.from({
        message: error.message || "The iOS bundle ID is missing.",
        statusCode: HttpStatusCode.BAD_REQUEST,
        machineCode: ErrorMachineCode.FIREBASE_ERROR,
        cause: error,
        isOperational: true,
      });
    }

    case "auth/missing-uid": {
      throw AppError.from({
        message: error.message || "The UID is required.",
        statusCode: HttpStatusCode.BAD_REQUEST,
        machineCode: ErrorMachineCode.FIREBASE_ERROR,
        cause: error,
        isOperational: true,
      });
    }

    case "auth/missing-oauth-client-secret": {
      throw AppError.from({
        message: error.message || "The OAuth client secret is missing.",
        statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
        machineCode: ErrorMachineCode.FIREBASE_ERROR,
        cause: error,
        isOperational: false,
      });
    }

    case "auth/operation-not-allowed": {
      throw AppError.from({
        message:
          error.message ||
          "The requested authentication operation is not enabled.",
        statusCode: HttpStatusCode.FORBIDDEN,
        machineCode: ErrorMachineCode.FIREBASE_ERROR,
        cause: error,
        isOperational: true,
      });
    }

    case "auth/phone-number-already-exists": {
      throw AppError.from({
        message: error.message || "The phone number is already in use.",
        statusCode: HttpStatusCode.CONFLICT,
        machineCode: ErrorMachineCode.FIREBASE_ERROR,
        cause: error,
        isOperational: true,
      });
    }

    case "auth/project-not-found": {
      throw AppError.from({
        message:
          error.message ||
          "The Firebase project associated with the credential was not found.",
        statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
        machineCode: ErrorMachineCode.FIREBASE_ERROR,
        cause: error,
        isOperational: false,
      });
    }

    case "auth/reserved-claims": {
      throw AppError.from({
        message: error.message || "The custom claims contain reserved fields.",
        statusCode: HttpStatusCode.BAD_REQUEST,
        machineCode: ErrorMachineCode.FIREBASE_ERROR,
        cause: error,
        isOperational: true,
      });
    }

    case "auth/session-cookie-expired": {
      throw AppError.from({
        message: error.message || "The Firebase session cookie has expired.",
        statusCode: HttpStatusCode.UNAUTHORIZED,
        machineCode: ErrorMachineCode.FIREBASE_ERROR,
        cause: error,
        isOperational: true,
      });
    }

    case "auth/session-cookie-revoked": {
      throw AppError.from({
        message: error.message || "The Firebase session cookie was revoked.",
        statusCode: HttpStatusCode.UNAUTHORIZED,
        machineCode: ErrorMachineCode.FIREBASE_ERROR,
        cause: error,
        isOperational: true,
      });
    }

    case "auth/too-many-requests": {
      throw AppError.from({
        message: error.message || "Too many Firebase Authentication requests.",
        statusCode: HttpStatusCode.TOO_MANY_REQUESTS,
        machineCode: ErrorMachineCode.FIREBASE_ERROR,
        cause: error,
        isOperational: true,
      });
    }

    case "auth/uid-already-exists": {
      throw AppError.from({
        message: error.message || "The UID is already in use.",
        statusCode: HttpStatusCode.CONFLICT,
        machineCode: ErrorMachineCode.FIREBASE_ERROR,
        cause: error,
        isOperational: true,
      });
    }

    case "auth/unauthorized-continue-uri": {
      throw AppError.from({
        message:
          error.message ||
          "The continue URL domain is not authorized for this Firebase project.",
        statusCode: HttpStatusCode.FORBIDDEN,
        machineCode: ErrorMachineCode.FIREBASE_ERROR,
        cause: error,
        isOperational: true,
      });
    }

    case "auth/user-disabled": {
      throw AppError.from({
        message: error.message || "The Firebase user account is disabled.",
        statusCode: HttpStatusCode.FORBIDDEN,
        machineCode: ErrorMachineCode.FIREBASE_ERROR,
        cause: error,
        isOperational: true,
      });
    }

    case "auth/user-not-found": {
      throw AppError.from({
        message: error.message || "The Firebase user was not found.",
        statusCode: HttpStatusCode.NOT_FOUND,
        machineCode: ErrorMachineCode.FIREBASE_ERROR,
        cause: error,
        isOperational: true,
      });
    }

    default: {
      throw AppError.from({
        message:
          error.message || "An unknown Firebase Authentication error occurred.",
        statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
        machineCode: ErrorMachineCode.FIREBASE_ERROR,
        cause: error,
        isOperational: false,
      });
    }
  }
}
