import { authorizedApiHandler } from "@/lib/api-handler";
import {
  addWorkspaceMember,
  createChannel,
  createWorkspace,
  getWorkspacesByUser,
} from "@/lib/db/queries";
import { NextResponse } from "next/server";
import { z } from "zod";

const createWorkspaceSchema = z.object({
  name: z.string().min(1).max(100),
  iconUrl: z.string().url().optional(),
});

export const POST = authorizedApiHandler(async (req, { params }, session) => {
  const body = await req.json();
  const { name, iconUrl } = createWorkspaceSchema.parse(body);

  const slug = name
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");

  const [workspace] = await createWorkspace({
    name,
    slug: `${slug}-${Date.now().toString().slice(-4)}`, // Ensure uniqueness
    ownerId: session.user.id,
    iconUrl,
  });

  // Add creator as admin member
  await addWorkspaceMember({
    workspaceId: workspace.id,
    userId: session.user.id,
    role: "admin",
  });

  // Create default channel
  await createChannel({
    workspaceId: workspace.id,
    name: "general",
    description: "General discussion",
    type: "public",
    createdBy: session.user.id,
  });

  return NextResponse.json({
    result: { data: workspace },
  });
});

export const GET = authorizedApiHandler(async (req, { params }, session) => {
  const members = await getWorkspacesByUser(session.user.id);
  // Extract workspace from member record
  const workspaces = members.map((m) => m.workspace);

  return NextResponse.json({
    result: { data: workspaces },
  });
});
