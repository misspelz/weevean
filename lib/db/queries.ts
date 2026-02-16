import { and, desc, eq } from "drizzle-orm";
import { db } from "./index";
import {
  channels,
  directMessages,
  dmMessages,
  messages,
  reactions,
  users,
  workspaceInvites,
  workspaceMembers,
  workspaces,
} from "./schema";

export async function getUserById(userId: string) {
  return await db.query.users.findFirst({
    where: eq(users.id, userId),
  });
}

export async function getUserByEmail(email: string) {
  return await db.query.users.findFirst({
    where: eq(users.email, email),
  });
}

// Workspaces

export async function getWorkspacesByUser(userId: string) {
  return await db.query.workspaceMembers.findMany({
    where: eq(workspaceMembers.userId, userId),
    with: {
      workspace: {
        with: {
          owner: true,
        },
      },
    },
  });
}

export async function getWorkspaceById(workspaceId: string) {
  return await db.query.workspaces.findFirst({
    where: eq(workspaces.id, workspaceId),
    with: {
      owner: true,
      channels: true,
      members: {
        with: {
          user: true,
        },
      },
    },
  });
}

export async function createWorkspace(data: {
  name: string;
  slug: string;
  ownerId: string;
  iconUrl?: string;
}) {
  return await db.insert(workspaces).values(data).returning();
}

export async function addWorkspaceMember(data: {
  workspaceId: string;
  userId: string;
  role?: "admin" | "member";
}) {
  return await db.insert(workspaceMembers).values(data).returning();
}

export async function getWorkspaceMembers(workspaceId: string) {
  return await db.query.workspaceMembers.findMany({
    where: eq(workspaceMembers.workspaceId, workspaceId),
    with: {
      user: true,
    },
  });
}

export async function isWorkspaceMember(workspaceId: string, userId: string) {
  const member = await db.query.workspaceMembers.findFirst({
    where: and(
      eq(workspaceMembers.workspaceId, workspaceId),
      eq(workspaceMembers.userId, userId),
    ),
  });
  return !!member;
}

// Channels

export async function getChannelsByWorkspace(workspaceId: string) {
  return await db.query.channels.findMany({
    where: eq(channels.workspaceId, workspaceId),
    with: {
      creator: true,
    },
  });
}

export async function getChannelById(channelId: string) {
  return await db.query.channels.findFirst({
    where: eq(channels.id, channelId),
    with: {
      workspace: true,
      creator: true,
    },
  });
}

export async function createChannel(data: {
  workspaceId: string;
  name: string;
  description?: string;
  type?: "public" | "private";
  createdBy: string;
}) {
  return await db.insert(channels).values(data).returning();
}

// Messages

export async function getMessagesByChannel(channelId: string, limit = 50) {
  return await db.query.messages.findMany({
    where: eq(messages.channelId, channelId),
    with: {
      author: true,
      reactions: {
        with: {
          user: true,
        },
      },
    },
    orderBy: [desc(messages.createdAt)],
    limit,
  });
}

export async function createMessage(data: {
  channelId: string;
  userId: string;
  content: string;
  parentId?: string;
}) {
  return await db.insert(messages).values(data).returning();
}

export async function updateMessage(messageId: string, content: string) {
  return await db
    .update(messages)
    .set({ content, edited: true, updatedAt: new Date() })
    .where(eq(messages.id, messageId))
    .returning();
}

export async function deleteMessage(messageId: string) {
  return await db.delete(messages).where(eq(messages.id, messageId));
}

// Reactions

export async function addReaction(data: {
  messageId: string;
  userId: string;
  emoji: string;
}) {
  return await db.insert(reactions).values(data).returning();
}

export async function removeReaction(
  messageId: string,
  userId: string,
  emoji: string,
) {
  return await db
    .delete(reactions)
    .where(
      and(
        eq(reactions.messageId, messageId),
        eq(reactions.userId, userId),
        eq(reactions.emoji, emoji),
      ),
    );
}

export async function getOrCreateDM(
  participant1Id: string,
  participant2Id: string,
) {
  // Check if DM exists (in either direction)
  const existingDM = await db.query.directMessages.findFirst({
    where: and(
      eq(directMessages.participant1Id, participant1Id),
      eq(directMessages.participant2Id, participant2Id),
    ),
  });

  if (existingDM) return existingDM;

  // Check reverse direction
  const reverseDM = await db.query.directMessages.findFirst({
    where: and(
      eq(directMessages.participant1Id, participant2Id),
      eq(directMessages.participant2Id, participant1Id),
    ),
  });

  if (reverseDM) return reverseDM;

  // Create new DM
  const [newDM] = await db
    .insert(directMessages)
    .values({ participant1Id, participant2Id })
    .returning();

  return newDM;
}

export async function getDMsByUser(userId: string) {
  return await db.query.directMessages.findMany({
    where: and(
      eq(directMessages.participant1Id, userId),
      eq(directMessages.participant2Id, userId),
    ),
    with: {
      participant1: true,
      participant2: true,
    },
  });
}

export async function getDMMessages(dmId: string, limit = 50) {
  return await db.query.dmMessages.findMany({
    where: eq(dmMessages.dmId, dmId),
    with: {
      sender: true,
    },
    orderBy: [desc(dmMessages.createdAt)],
    limit,
  });
}

export async function createDMMessage(data: {
  dmId: string;
  senderId: string;
  content: string;
}) {
  return await db.insert(dmMessages).values(data).returning();
}

// Workspace Invites

export async function createWorkspaceInvite(data: {
  workspaceId: string;
  code: string;
  createdBy: string;
  expiresAt?: Date;
  maxUses?: number;
}) {
  return await db.insert(workspaceInvites).values(data).returning();
}

export async function getInviteByCode(code: string) {
  return await db.query.workspaceInvites.findFirst({
    where: eq(workspaceInvites.code, code),
    with: {
      workspace: true,
      creator: true,
    },
  });
}

export async function incrementInviteUses(inviteId: string) {
  const invite = await db.query.workspaceInvites.findFirst({
    where: eq(workspaceInvites.id, inviteId),
  });

  if (!invite) return null;

  return await db
    .update(workspaceInvites)
    .set({ uses: invite.uses + 1 })
    .where(eq(workspaceInvites.id, inviteId))
    .returning();
}
