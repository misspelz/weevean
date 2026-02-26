import { authorizedApiHandler } from "@/lib/api-handler";
import { AppError } from "@/lib/app-error";
import {
  createMessage,
  getChannelById,
  getMessagesByChannel,
  isWorkspaceMember,
} from "@/lib/db/queries";
import { NextResponse } from "next/server";
import { z } from "zod";

const createMessageSchema = z.object({
  content: z.string().min(1),
  parentId: z.uuid().optional(),
});

export const GET = authorizedApiHandler(async (req, ctx, session) => {
  const { channelId } = await ctx.params;

  const channel = await getChannelById(channelId);
  if (!channel) {
    return AppError.notFound("Channel not found").toResponse();
  }

  const isMember = await isWorkspaceMember(
    channel.workspaceId,
    session.user.id,
  );
  if (!isMember) {
    return AppError.forbidden("Unauthorized").toResponse();
  }

  if (channel.type === "private") {
    const isChannelMember = channel.members?.some(
      (member) => member.userId === session.user.id,
    );
    if (!isChannelMember) {
      return AppError.forbidden(
        "You do not have access to this private channel",
      ).toResponse();
    }
  }

  const messages = await getMessagesByChannel(channelId);
  const formattedMessages = messages.map((msg) => {
    const reactionGroups = msg.reactions.reduce(
      (acc, curr) => {
        if (!acc[curr.emoji]) acc[curr.emoji] = [];
        acc[curr.emoji].push(curr.userId);
        return acc;
      },
      {} as Record<string, string[]>,
    );

    const formattedReactions = Object.entries(reactionGroups).map(
      ([emoji, userIds]) => ({
        emoji,
        count: userIds.length,
        userReacted: userIds.includes(session.user.id),
      }),
    );

    return {
      ...msg,
      reactions: formattedReactions,
    };
  });

  return NextResponse.json({
    result: { data: formattedMessages },
  });
});

export const POST = authorizedApiHandler(async (req, ctx, session) => {
  const { channelId } = await ctx.params;
  const body = await req.json();
  const { content, parentId } = createMessageSchema.parse(body);

  const channel = await getChannelById(channelId);
  if (!channel) {
    return AppError.notFound("Channel not found").toResponse();
  }

  const isMember = await isWorkspaceMember(
    channel.workspaceId,
    session.user.id,
  );
  if (!isMember) {
    return AppError.forbidden("Unauthorized").toResponse();
  }

  if (channel.type === "private") {
    const isChannelMember = channel.members?.some(
      (member) => member.userId === session.user.id,
    );
    if (!isChannelMember) {
      return AppError.forbidden(
        "You do not have access to this private channel",
      ).toResponse();
    }
  }

  const [message] = await createMessage({
    channelId,
    userId: session.user.id,
    content,
    parentId,
  });

  const formattedMessage = {
    ...message,
    user: {
      id: session.user.id,
      name: session.user.name || "User",
      image: session.user.image,
    },
    reactions: [],
  };

  return NextResponse.json({
    result: { data: formattedMessage },
  });
});
