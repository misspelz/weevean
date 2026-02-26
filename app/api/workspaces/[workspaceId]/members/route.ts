import { authorizedApiHandler } from "@/lib/api-handler";
import { getWorkspaceMembers } from "@/lib/db/queries";
import { NextResponse } from "next/server";

export const GET = authorizedApiHandler(async (req, ctx, session) => {
  const { workspaceId } = await ctx.params;

  const members = await getWorkspaceMembers(workspaceId);

  return NextResponse.json({
    result: { data: members },
  });
});
