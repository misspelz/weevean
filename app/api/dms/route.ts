import { authorizedApiHandler } from "@/lib/api-handler";
import { getDMsByUser, getOrCreateDM } from "@/lib/db/queries";
import { NextResponse } from "next/server";
import { z } from "zod";

const createDMSchema = z.object({
  userId: z.uuid(),
});

export const GET = authorizedApiHandler(async (req, ctx, session) => {
  const dms = await getDMsByUser(session.user.id);

  return NextResponse.json({
    result: { data: dms },
  });
});

export const POST = authorizedApiHandler(async (req, ctx, session) => {
  const body = await req.json();
  const { userId } = createDMSchema.parse(body);

  const dm = await getOrCreateDM(session.user.id, userId);

  return NextResponse.json({
    result: { data: dm },
  });
});
