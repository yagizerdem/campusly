import HttpStatusCode from "@campusly/shared/util/http-status-code.js";
import { ErrorMachineCode } from "@/src/util/error-machine-code.js";

export class ApiResponse<T> {
  public readonly success: boolean;
  public readonly data: T | null;
  public readonly message: string | null;
  public readonly machineCode: ErrorMachineCode | null;
  public readonly statusCode: HttpStatusCode;
  public readonly timestamp: string;

  private constructor(
    success: boolean,
    statusCode: HttpStatusCode,
    data: T | null,
    message: string | null,
    machineCode: ErrorMachineCode | null,
  ) {
    this.success = success;
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
    this.machineCode = machineCode;
    this.timestamp = new Date().toISOString();
  }

  public static from<T>({
    success,
    statusCode,
    data,
    message,
    machineCode,
  }: {
    success: boolean;
    statusCode: HttpStatusCode;
    data: T | null;
    message: string | null;
    machineCode: ErrorMachineCode | null;
  }): ApiResponse<T> {
    return new ApiResponse<T>(success, statusCode, data, message, machineCode);
  }

  public static success<T>(
    data: T | null = null,
    message: string = "",
  ): ApiResponse<T> {
    return new ApiResponse<T>(true, HttpStatusCode.OK, data, message, null);
  }

  public static ok<T>(
    message: string = "",
    data: T | null = null,
  ): ApiResponse<T> {
    return new ApiResponse<T>(true, HttpStatusCode.OK, data, message, null);
  }

  public static created<T>(
    message: string = "",
    data: T | null = null,
  ): ApiResponse<T> {
    return new ApiResponse<T>(
      true,
      HttpStatusCode.CREATED,
      data,
      message,
      null,
    );
  }

  public static noContent(message: string = ""): ApiResponse<null> {
    return new ApiResponse<null>(
      true,
      HttpStatusCode.NO_CONTENT,
      null,
      message,
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
