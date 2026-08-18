import HttpStatusCode from "@type/http-status-code.js";
import { ErrorMachineCode } from "@type/error-machine-code.js";

export type ErrorStatus = "fail" | "error";

export class AppError extends Error {
  public readonly statusCode: HttpStatusCode;
  public readonly machineCode: ErrorMachineCode;
  public readonly status: ErrorStatus;
  public readonly isOperational: boolean;

  private constructor(
    message: string,
    statusCode: HttpStatusCode,
    machineCode: ErrorMachineCode,
    isOperational = true,
  ) {
    super(message);

    this.name = new.target.name;
    this.statusCode = statusCode;
    this.machineCode = machineCode;
    this.status = statusCode >= 400 && statusCode < 500 ? "fail" : "error";
    this.isOperational = isOperational;

    Object.setPrototypeOf(this, new.target.prototype);

    Error.captureStackTrace?.(this, new.target);
  }

  public static create(
    message: string,
    statusCode: HttpStatusCode,
    machineCode: ErrorMachineCode,
  ): AppError {
    return new AppError(message, statusCode, machineCode);
  }

  public static badRequest(
    machineCode: ErrorMachineCode,
    message = "Bad request.",
  ): AppError {
    return new AppError(message, HttpStatusCode.BAD_REQUEST, machineCode);
  }

  public static unauthorized(
    machineCode: ErrorMachineCode,
    message = "Unauthorized.",
  ): AppError {
    return new AppError(message, HttpStatusCode.UNAUTHORIZED, machineCode);
  }

  public static forbidden(
    machineCode: ErrorMachineCode,
    message = "Forbidden.",
  ): AppError {
    return new AppError(message, HttpStatusCode.FORBIDDEN, machineCode);
  }

  public static notFound(
    machineCode: ErrorMachineCode,
    message = "Resource not found.",
  ): AppError {
    return new AppError(message, HttpStatusCode.NOT_FOUND, machineCode);
  }

  public static conflict(
    machineCode: ErrorMachineCode,
    message = "Resource conflict.",
  ): AppError {
    return new AppError(message, HttpStatusCode.CONFLICT, machineCode);
  }

  public static unprocessableEntity(
    machineCode: ErrorMachineCode,
    message = "Unprocessable entity.",
  ): AppError {
    return new AppError(
      message,
      HttpStatusCode.UNPROCESSABLE_ENTITY,
      machineCode,
    );
  }

  public static tooManyRequests(
    machineCode: ErrorMachineCode,
    message = "Too many requests.",
  ): AppError {
    return new AppError(message, HttpStatusCode.TOO_MANY_REQUESTS, machineCode);
  }

  public static internalServerError(
    machineCode: ErrorMachineCode,
    message = "Internal server error.",
  ): AppError {
    return new AppError(
      message,
      HttpStatusCode.INTERNAL_SERVER_ERROR,
      machineCode,
    );
  }

  public static serviceUnavailable(
    machineCode: ErrorMachineCode,
    message = "Service unavailable.",
  ): AppError {
    return new AppError(
      message,
      HttpStatusCode.SERVICE_UNAVAILABLE,
      machineCode,
    );
  }
}
