import { authorizedApiHandler } from "@/lib/api-handler";
import { AppError } from "@/lib/app-error";
import { db } from "@/lib/db";
import { createDMMessage, getDMMessages } from "@/lib/db/queries";
import { directMessages } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { z } from "zod";

const createMessageSchema = z.object({
  content: z.string().min(1),
});

export const GET = authorizedApiHandler(async (req, ctx, session) => {
  const { dmId } = await ctx.params;

  // Verify access
  const dm = await db.query.directMessages.findFirst({
    where: eq(directMessages.id, dmId),
  });

  if (!dm) {
    return AppError.notFound("DM not found").toResponse();
  }

  if (
    dm.participant1Id !== session.user.id &&
    dm.participant2Id !== session.user.id
  ) {
    return AppError.forbidden("Unauthorized").toResponse();
  }

  const messages = await getDMMessages(dmId);
  return NextResponse.json({
    result: { data: messages },
  });
});

export const POST = authorizedApiHandler(async (req, ctx, session) => {
  const { dmId } = await ctx.params;
  const body = await req.json();
  const { content } = createMessageSchema.parse(body);

  // Verify access
  const dm = await db.query.directMessages.findFirst({
    where: eq(directMessages.id, dmId),
  });

  if (!dm) {
    return AppError.notFound("DM not found").toResponse();
  }

  if (
    dm.participant1Id !== session.user.id &&
    dm.participant2Id !== session.user.id
  ) {
    return AppError.forbidden("Unauthorized").toResponse();
  }

  const [message] = await createDMMessage({
    dmId,
    senderId: session.user.id,
    content,
  });

  const formattedMessage = {
    ...message,
    sender: {
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
