import { auth } from "@/auth";
import { AppError } from "@/lib/app-error";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { z } from "zod";

type Session = typeof auth.$Infer.Session;

interface ApiContext {
  params: Promise<Record<string, string>>;
}

type ApiHandler<T = any> = (
  req: Request,
  ctx: ApiContext,
) => Promise<NextResponse<T>>;

type AuthorizedApiHandler<T = any> = (
  req: Request,
  ctx: ApiContext,
  session: Session,
) => Promise<NextResponse<any>>;

type ErrorResponseData = {
  error: { code: string; message: string; data?: unknown };
};

export function apiHandler<T>(
  handler: ApiHandler<T>,
): ApiHandler<T | ErrorResponseData> {
  return async (req: Request, ctx: ApiContext) => {
    try {
      return await handler(req, ctx);
    } catch (error) {
      console.error("API Error:", error);

      if (error instanceof AppError) {
        return error.toResponse();
      }

      if (error instanceof z.ZodError) {
        return AppError.badRequest("Validation Error", "bad_request", {
          details: (error as z.ZodError).flatten().fieldErrors,
        }).toResponse();
      }

      return AppError.internalServerError().toResponse();
    }
  };
}

export function authorizedApiHandler<T>(
  handler: AuthorizedApiHandler<T>,
): ApiHandler<T | ErrorResponseData> {
  return apiHandler(async (req, ctx) => {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      throw AppError.unauthorized();
    }

    return handler(req, ctx, session);
  });
}
