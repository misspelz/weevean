import { authorizedApiHandler } from "@/lib/api-handler";
import { AppError } from "@/lib/app-error";
import {
  createChannel,
  getChannelsByWorkspace,
  isWorkspaceMember,
} from "@/lib/db/queries";
import { NextResponse } from "next/server";
import { z } from "zod";

const createChannelSchema = z.object({
  name: z
    .string()
    .min(1)
    .max(100)
    .regex(
      /^[a-z0-9-]+$/,
      "Channel names must be lowercase, numbers, and dashes only",
    ),
  description: z.string().optional(),
  type: z.enum(["public", "private"]).default("public"),
});

export const GET = authorizedApiHandler(async (req, ctx, session) => {
  const { workspaceId } = await ctx.params;

  const isMember = await isWorkspaceMember(workspaceId, session.user.id);
  if (!isMember) {
    return AppError.forbidden("Unauthorized").toResponse();
  }

  const channels = await getChannelsByWorkspace(workspaceId);
  return NextResponse.json({
    result: { data: channels },
  });
});

export const POST = authorizedApiHandler(async (req, ctx, session) => {
  const { workspaceId } = await ctx.params;
  const body = await req.json();
  const { name, description, type } = createChannelSchema.parse(body);

  const isMember = await isWorkspaceMember(workspaceId, session.user.id);
  if (!isMember) {
    return AppError.forbidden("Unauthorized").toResponse();
  }

  const [channel] = await createChannel({
    workspaceId,
    name,
    description,
    type,
    createdBy: session.user.id,
  });

  return NextResponse.json({
    result: { data: channel },
  });
});
