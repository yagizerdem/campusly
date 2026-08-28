import type { ErrorMachineCode } from "./error-machine-code.js";
import type HttpStatusCode from "./http-status-code.js";

export default interface IApiResponse<T> {
  readonly success: boolean;
  readonly data: T | null;
  readonly message: string | null;
  readonly machineCode: ErrorMachineCode | null;
  readonly statusCode: HttpStatusCode;
  readonly timestamp: string;
  readonly diagnostics?: string[] | undefined;
}
