import { authorizedApiHandler } from "@/lib/api-handler";
import { AppError } from "@/lib/app-error";
import { createWorkspaceInvite, isWorkspaceMember } from "@/lib/db/queries";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";

const createInviteSchema = z.object({
  expiresInDays: z.number().int().min(1).max(30).optional().default(7),
  maxUses: z.number().int().min(1).optional(),
});

export const POST = authorizedApiHandler(async (req, ctx, session) => {
  const { workspaceId } = await ctx.params;
  const body = await req.json().catch(() => ({}));
  const { expiresInDays, maxUses } = createInviteSchema.parse(body);

  const isMember = await isWorkspaceMember(workspaceId, session.user.id);
  if (!isMember) {
    return AppError.forbidden(
      "You do not have permission to invite users to this workspace.",
    ).toResponse();
  }

  const code = uuidv4().split("-")[0];

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + expiresInDays);

  const [invite] = await createWorkspaceInvite({
    workspaceId,
    code,
    createdBy: session.user.id,
    expiresAt,
    maxUses,
  });

  return NextResponse.json({
    result: { data: invite },
  });
});
