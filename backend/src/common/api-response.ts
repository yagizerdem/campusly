import HttpStatusCode from "@/src/util/http-status-code.js";
import { ErrorMachineCode } from "@/src/util/error-machine-code.js";

export class ApiResponse<T> {
  public readonly success: boolean;
  public readonly data: T | null;
  public readonly error: string | null;
  public readonly machineCode: ErrorMachineCode | null;
  public readonly statusCode: HttpStatusCode;
  public readonly timestamp: string;

  private constructor(
    success: boolean,
    statusCode: HttpStatusCode,
    data: T | null,
    error: string | null,
    machineCode: ErrorMachineCode | null,
  ) {
    this.success = success;
    this.statusCode = statusCode;
    this.data = data;
    this.error = error;
    this.machineCode = machineCode;
    this.timestamp = new Date().toISOString();
  }

  public static success<T>(data: T): ApiResponse<T> {
    return new ApiResponse<T>(true, HttpStatusCode.OK, data, null, null);
  }

  public static ok<T>(data: T): ApiResponse<T> {
    return ApiResponse.success(data);
  }

  public static created<T>(data: T): ApiResponse<T> {
    return new ApiResponse<T>(true, HttpStatusCode.CREATED, data, null, null);
  }

  public static noContent(): ApiResponse<null> {
    return new ApiResponse<null>(
      true,
      HttpStatusCode.NO_CONTENT,
      null,
      null,
      null,
    );
  }

  public static error<T = null>(
    statusCode: HttpStatusCode,
    machineCode: ErrorMachineCode,
    message: string,
  ): ApiResponse<T> {
    return new ApiResponse<T>(false, statusCode, null, message, machineCode);
  }

  public static badRequest(
    machineCode: ErrorMachineCode,
    message = "Bad request.",
  ): ApiResponse<null> {
    return ApiResponse.error(HttpStatusCode.BAD_REQUEST, machineCode, message);
  }

  public static unauthorized(
    machineCode: ErrorMachineCode,
    message = "Unauthorized.",
  ): ApiResponse<null> {
    return ApiResponse.error(HttpStatusCode.UNAUTHORIZED, machineCode, message);
  }

  public static forbidden(
    machineCode: ErrorMachineCode,
    message = "Forbidden.",
  ): ApiResponse<null> {
    return ApiResponse.error(HttpStatusCode.FORBIDDEN, machineCode, message);
  }

  public static notFound(
    machineCode: ErrorMachineCode,
    message = "Resource not found.",
  ): ApiResponse<null> {
    return ApiResponse.error(HttpStatusCode.NOT_FOUND, machineCode, message);
  }

  public static conflict(
    machineCode: ErrorMachineCode,
    message = "Resource conflict.",
  ): ApiResponse<null> {
    return ApiResponse.error(HttpStatusCode.CONFLICT, machineCode, message);
  }

  public static unprocessableEntity(
    machineCode: ErrorMachineCode,
    message = "Unprocessable entity.",
  ): ApiResponse<null> {
    return ApiResponse.error(
      HttpStatusCode.UNPROCESSABLE_ENTITY,
      machineCode,
      message,
    );
  }

  public static internalServerError(
    machineCode: ErrorMachineCode,
    message = "Internal server error.",
  ): ApiResponse<null> {
    return ApiResponse.error(
      HttpStatusCode.INTERNAL_SERVER_ERROR,
      machineCode,
      message,
    );
  }
}
