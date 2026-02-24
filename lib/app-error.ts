import { CommonErrorCode } from "@/lib/types";
import { NextResponse } from "next/server";

export class AppError extends Error {
  public readonly code: string;
  public readonly status: number;
  public readonly data?: Record<string, unknown>;

  constructor(
    message: string,
    code: CommonErrorCode | (string & {}) = "server_error",
    status: number = 500,
    data?: Record<string, unknown>,
  ) {
    super(message);
    this.name = "AppError";
    this.code = code;
    this.status = status;
    this.data = data;
  }

  static badRequest(
    message = "Bad Request",
    code: CommonErrorCode | (string & {}) = "bad_request",
    data?: Record<string, unknown>,
  ) {
    return new AppError(message, code, 400, data);
  }

  static unauthorized(
    message = "Unauthorized",
    code: CommonErrorCode | (string & {}) = "unauthorized",
    data?: Record<string, unknown>,
  ) {
    return new AppError(message, code, 401, data);
  }

  static forbidden(
    message = "Forbidden",
    code: CommonErrorCode | (string & {}) = "forbidden",
    data?: Record<string, unknown>,
  ) {
    return new AppError(message, code, 403, data);
  }

  static notFound(
    message = "The requested resource could not be found.",
    code: CommonErrorCode | (string & {}) = "not_found",
    data?: Record<string, unknown>,
  ) {
    return new AppError(message, code, 404, data);
  }

  static rateLimit(
    message = "Too Many Requests",
    code: CommonErrorCode | (string & {}) = "rate_limit",
    data?: Record<string, unknown>,
  ) {
    return new AppError(message, code, 429, data);
  }

  static internalServerError(
    message = "Internal Server Error",
    code: CommonErrorCode | (string & {}) = "server_error",
    data?: Record<string, unknown>,
  ) {
    return new AppError(message, code, 500, data);
  }

  /**
   * Checks if the error is an instance of AppError and if its code is included in the provided list.
   * If matched, returns the error's response. Otherwise returns null.
   *
   * usage:
   * const response = AppError.returnIfMatched(error, ["insufficient_credits", "unauthorized"]);
   * if (response) return response;
   */
  static returnIfMatched(
    error: unknown,
    codes: (CommonErrorCode | (string & {}))[],
  ): NextResponse | null {
    if (error instanceof AppError && codes.includes(error.code)) {
      return error.toResponse();
    }
    return null;
  }

  toResponse() {
    return NextResponse.json(
      {
        error: {
          code: this.code,
          message: this.message,
          data: this.data,
        },
      },
      { status: this.status },
    );
  }
}
