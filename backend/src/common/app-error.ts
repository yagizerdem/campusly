import HttpStatusCode from "@/src/util/http-status-code.js";
import { ErrorMachineCode } from "@/src/util/error-machine-code.js";

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
    cause?: unknown,
    isOperational = true,
  ) {
    super(message, { cause });

    this.name = new.target.name;
    this.statusCode = statusCode;
    this.machineCode = machineCode;
    this.status = statusCode >= 400 && statusCode < 500 ? "fail" : "error";
    this.isOperational = isOperational;

    Object.setPrototypeOf(this, new.target.prototype);

    Error.captureStackTrace?.(this, new.target);
  }

  // create app-error from object destruction syntax
  public static from({
    message,
    statusCode,
    machineCode,
    cause,
    isOperational = true,
  }: {
    message: string;
    statusCode: HttpStatusCode;
    machineCode: ErrorMachineCode;
    cause?: unknown;
    isOperational?: boolean;
  }): AppError {
    return new AppError(message, statusCode, machineCode, cause, isOperational);
  }
  public static create(
    message: string,
    statusCode: HttpStatusCode,
    machineCode: ErrorMachineCode,
    cause?: unknown,
    isOperational = true,
  ): AppError {
    return new AppError(message, statusCode, machineCode, cause, isOperational);
  }

  public static badRequest(
    machineCode: ErrorMachineCode,
    message = "Bad request.",
    cause?: unknown,
    isOperational = true,
  ): AppError {
    return new AppError(
      message,
      HttpStatusCode.BAD_REQUEST,
      machineCode,
      cause,
      isOperational,
    );
  }

  public static unauthorized(
    machineCode: ErrorMachineCode,
    message = "Unauthorized.",
    cause?: unknown,
    isOperational = true,
  ): AppError {
    return new AppError(
      message,
      HttpStatusCode.UNAUTHORIZED,
      machineCode,
      cause,
      isOperational,
    );
  }

  public static forbidden(
    machineCode: ErrorMachineCode,
    message = "Forbidden.",
    cause?: unknown,
    isOperational = true,
  ): AppError {
    return new AppError(
      message,
      HttpStatusCode.FORBIDDEN,
      machineCode,
      cause,
      isOperational,
    );
  }

  public static notFound(
    machineCode: ErrorMachineCode,
    message = "Resource not found.",
    cause?: unknown,
    isOperational = true,
  ): AppError {
    return new AppError(
      message,
      HttpStatusCode.NOT_FOUND,
      machineCode,
      cause,
      isOperational,
    );
  }

  public static conflict(
    machineCode: ErrorMachineCode,
    message = "Resource conflict.",
    cause?: unknown,
    isOperational = true,
  ): AppError {
    return new AppError(
      message,
      HttpStatusCode.CONFLICT,
      machineCode,
      cause,
      isOperational,
    );
  }

  public static unprocessableEntity(
    machineCode: ErrorMachineCode,
    message = "Unprocessable entity.",
    cause?: unknown,
    isOperational = true,
  ): AppError {
    return new AppError(
      message,
      HttpStatusCode.UNPROCESSABLE_ENTITY,
      machineCode,
      cause,
      isOperational,
    );
  }

  public static tooManyRequests(
    machineCode: ErrorMachineCode,
    message = "Too many requests.",
    cause?: unknown,
    isOperational = true,
  ): AppError {
    return new AppError(
      message,
      HttpStatusCode.TOO_MANY_REQUESTS,
      machineCode,
      cause,
      isOperational,
    );
  }

  public static internalServerError(
    machineCode: ErrorMachineCode,
    message = "Internal server error.",
    cause?: unknown,
    isOperational = true,
  ): AppError {
    return new AppError(
      message,
      HttpStatusCode.INTERNAL_SERVER_ERROR,
      machineCode,
      cause,
      isOperational,
    );
  }

  public static serviceUnavailable(
    machineCode: ErrorMachineCode,
    message = "Service unavailable.",
    cause?: unknown,
    isOperational = true,
  ): AppError {
    return new AppError(
      message,
      HttpStatusCode.SERVICE_UNAVAILABLE,
      machineCode,
      cause,
      isOperational,
    );
  }
}
