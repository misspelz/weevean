import { authorizedApiHandler } from "@/lib/api-handler";
import { AppError } from "@/lib/app-error";
import {
  addWorkspaceMember,
  getInviteByCode,
  incrementInviteUses,
  isWorkspaceMember,
} from "@/lib/db/queries";
import { NextResponse } from "next/server";

export const GET = authorizedApiHandler(async (req, ctx, session) => {
  const { code } = await ctx.params;

  const invite = await getInviteByCode(code);
  if (!invite) {
    return AppError.notFound("Invalid or expired invite code.").toResponse();
  }

  if (invite.expiresAt && new Date(invite.expiresAt) < new Date()) {
    return AppError.badRequest("This invite code has expired.").toResponse();
  }
  if (invite.maxUses && invite.uses >= invite.maxUses) {
    return AppError.badRequest(
      "This invite code has reached its maximum number of uses.",
    ).toResponse();
  }

  const isMember = await isWorkspaceMember(invite.workspaceId, session.user.id);

  return NextResponse.json({
    result: {
      data: {
        workspaceName: invite.workspace.name,
        workspaceIcon: invite.workspace.iconUrl,
        alreadyMember: isMember,
        workspaceId: invite.workspaceId,
      },
    },
  });
});

export const POST = authorizedApiHandler(async (req, ctx, session) => {
  const { code } = await ctx.params;

  const invite = await getInviteByCode(code);
  if (!invite) {
    return AppError.notFound("Invalid or expired invite code.").toResponse();
  }

  if (invite.expiresAt && new Date(invite.expiresAt) < new Date()) {
    return AppError.badRequest("This invite code has expired.").toResponse();
  }

  if (invite.maxUses && invite.uses >= invite.maxUses) {
    return AppError.badRequest(
      "This invite code has reached its maximum number of uses.",
    ).toResponse();
  }

  const isMember = await isWorkspaceMember(invite.workspaceId, session.user.id);

  if (!isMember) {
    await addWorkspaceMember({
      workspaceId: invite.workspaceId,
      userId: session.user.id,
      role: "member",
    });

    await incrementInviteUses(invite.id);
  }

  return NextResponse.json({
    result: { data: { workspaceId: invite.workspaceId } },
  });
});
