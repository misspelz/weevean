import { pgTable, text, timestamp, uuid, varchar, boolean, integer, pgEnum } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Enums
export const memberRoleEnum = pgEnum('member_role', ['admin', 'member']);
export const channelTypeEnum = pgEnum('channel_type', ['public', 'private']);

// Users table
export const users = pgTable('users', {
  id: uuid('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  displayName: varchar('display_name', { length: 100 }),
  avatarUrl: text('avatar_url'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Workspaces table
export const workspaces = pgTable('workspaces', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 100 }).notNull(),
  slug: varchar('slug', { length: 100 }).notNull().unique(),
  iconUrl: text('icon_url'),
  ownerId: uuid('owner_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Workspace members table
export const workspaceMembers = pgTable('workspace_members', {
  id: uuid('id').primaryKey().defaultRandom(),
  workspaceId: uuid('workspace_id').notNull().references(() => workspaces.id, { onDelete: 'cascade' }),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  role: memberRoleEnum('role').default('member').notNull(),
  joinedAt: timestamp('joined_at').defaultNow().notNull(),
});

// Channels table
export const channels = pgTable('channels', {
  id: uuid('id').primaryKey().defaultRandom(),
  workspaceId: uuid('workspace_id').notNull().references(() => workspaces.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 100 }).notNull(),
  description: text('description'),
  type: channelTypeEnum('type').default('public').notNull(),
  createdBy: uuid('created_by').notNull().references(() => users.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Messages table
export const messages = pgTable('messages', {
  id: uuid('id').primaryKey().defaultRandom(),
  channelId: uuid('channel_id').notNull().references(() => channels.id, { onDelete: 'cascade' }),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  content: text('content').notNull(),
  parentId: uuid('parent_id'), // Self-reference for threading
  edited: boolean('edited').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Reactions table
export const reactions = pgTable('reactions', {
  id: uuid('id').primaryKey().defaultRandom(),
  messageId: uuid('message_id').notNull().references(() => messages.id, { onDelete: 'cascade' }),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  emoji: varchar('emoji', { length: 100 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Direct messages table
export const directMessages = pgTable('direct_messages', {
  id: uuid('id').primaryKey().defaultRandom(),
  participant1Id: uuid('participant1_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  participant2Id: uuid('participant2_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// DM messages table
export const dmMessages = pgTable('dm_messages', {
  id: uuid('id').primaryKey().defaultRandom(),
  dmId: uuid('dm_id').notNull().references(() => directMessages.id, { onDelete: 'cascade' }),
  senderId: uuid('sender_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  content: text('content').notNull(),
  edited: boolean('edited').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Workspace invites table
export const workspaceInvites = pgTable('workspace_invites', {
  id: uuid('id').primaryKey().defaultRandom(),
  workspaceId: uuid('workspace_id').notNull().references(() => workspaces.id, { onDelete: 'cascade' }),
  code: varchar('code', { length: 50 }).notNull().unique(),
  createdBy: uuid('created_by').notNull().references(() => users.id, { onDelete: 'cascade' }),
  expiresAt: timestamp('expires_at'),
  maxUses: integer('max_uses'),
  uses: integer('uses').default(0).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  workspaceMembers: many(workspaceMembers),
  messages: many(messages),
  reactions: many(reactions),
  ownedWorkspaces: many(workspaces),
  dmParticipant1: many(directMessages, { relationName: 'participant1' }),
  dmParticipant2: many(directMessages, { relationName: 'participant2' }),
  dmMessages: many(dmMessages),
}));

export const workspacesRelations = relations(workspaces, ({ one, many }) => ({
  owner: one(users, {
    fields: [workspaces.ownerId],
    references: [users.id],
  }),
  members: many(workspaceMembers),
  channels: many(channels),
  invites: many(workspaceInvites),
}));

export const workspaceMembersRelations = relations(workspaceMembers, ({ one }) => ({
  workspace: one(workspaces, {
    fields: [workspaceMembers.workspaceId],
    references: [workspaces.id],
  }),
  user: one(users, {
    fields: [workspaceMembers.userId],
    references: [users.id],
  }),
}));

export const channelsRelations = relations(channels, ({ one, many }) => ({
  workspace: one(workspaces, {
    fields: [channels.workspaceId],
    references: [workspaces.id],
  }),
  creator: one(users, {
    fields: [channels.createdBy],
    references: [users.id],
  }),
  messages: many(messages),
}));

export const messagesRelations = relations(messages, ({ one, many }) => ({
  channel: one(channels, {
    fields: [messages.channelId],
    references: [channels.id],
  }),
  author: one(users, {
    fields: [messages.userId],
    references: [users.id],
  }),
  parent: one(messages, {
    fields: [messages.parentId],
    references: [messages.id],
    relationName: 'thread',
  }),
  replies: many(messages, { relationName: 'thread' }),
  reactions: many(reactions),
}));

export const reactionsRelations = relations(reactions, ({ one }) => ({
  message: one(messages, {
    fields: [reactions.messageId],
    references: [messages.id],
  }),
  user: one(users, {
    fields: [reactions.userId],
    references: [users.id],
  }),
}));

export const directMessagesRelations = relations(directMessages, ({ one, many }) => ({
  participant1: one(users, {
    fields: [directMessages.participant1Id],
    references: [users.id],
    relationName: 'participant1',
  }),
  participant2: one(users, {
    fields: [directMessages.participant2Id],
    references: [users.id],
    relationName: 'participant2',
  }),
  messages: many(dmMessages),
}));

export const dmMessagesRelations = relations(dmMessages, ({ one }) => ({
  dm: one(directMessages, {
    fields: [dmMessages.dmId],
    references: [directMessages.id],
  }),
  sender: one(users, {
    fields: [dmMessages.senderId],
    references: [users.id],
  }),
}));

export const workspaceInvitesRelations = relations(workspaceInvites, ({ one }) => ({
  workspace: one(workspaces, {
    fields: [workspaceInvites.workspaceId],
    references: [workspaces.id],
  }),
  creator: one(users, {
    fields: [workspaceInvites.createdBy],
    references: [users.id],
  }),
}));
