# Weevean Requirements

This document outlines the functional and non-functional requirements for Weevean, a real-time chat platform for developer communities.

## Table of Contents

1. [Introduction](#introduction)
2. [Functional Requirements](#functional-requirements)
3. [Non-Functional Requirements](#non-functional-requirements)
4. [User Stories](#user-stories)
5. [API Requirements](#api-requirements)
6. [Data Requirements](#data-requirements)
7. [AI Integration (Core Feature)](#ai-integration-core-feature)
8. [Future Enhancements](#future-enhancements)

---

## Introduction

### Purpose

Weevean is designed to provide developer communities with a modern, efficient communication platform that understands their unique needs. Unlike general-purpose chat tools, Weevean is optimized for technical discussions with features like markdown support, code formatting, and workspace organization.

### Scope

**In Scope (MVP)**:

- Multi-tenant workspace management
- Channel-based communication
- Direct messaging
- User authentication and authorization
- Message formatting with markdown
- Emoji reactions
- Workspace invitations
- Basic threading
- AI assistant integration (core feature)

**Out of Scope (MVP)**:

- Code execution (browser-based)
- File uploads/attachments
- Video/audio calls
- Mobile native apps
- Advanced search
- Integrations (GitHub, Slack, etc.)
- Custom emoji
- Message editing/deletion

### Target Audience

- Development teams (5-100 members)
- Open source communities
- Tech startups
- Developer-focused organizations
- Remote development teams

---

## Functional Requirements

### 1. User Management

#### FR-1.1: User Registration

- Users must be able to create accounts using GitHub or Google
- Display name is optional during registration

#### FR-1.2: User Authentication

- Users must be able to log in with GitHub or Google
- System must maintain authenticated sessions
- Sessions must persist across browser refreshes
- Users must be able to log out

#### FR-1.3: User Profile

- Users must have a display name (defaults to email)
- Users can optionally set an avatar URL
- Users can set their status (online, away, busy, offline)
- Profile information must be editable

### 2. Workspace Management

#### FR-2.1: Workspace Creation

- Authenticated users must be able to create workspaces
- Workspace must have:
  - Unique name
  - URL-friendly slug (auto-generated from name)
  - Optional icon URL
- Creator automatically becomes workspace owner/admin
- A default "general" channel must be created automatically

#### FR-2.2: Workspace Navigation

- Users must be able to view all workspaces they're a member of
- Workspace list must be displayed in a left sidebar rail
- Users must be able to switch between workspaces
- Active workspace must be visually indicated

#### FR-2.3: Workspace Membership

- Workspace owners can invite users via invite links
- Users can be members of multiple workspaces
- Members can view workspace name, icon, and member count
- Members have roles: "admin" or "member"

#### FR-2.4: Workspace Invitations

- Admins can generate invite links
- Invite links can have:
  - Expiration date (optional)
  - Maximum use count (optional)
- Invite links must be unique and secure
- Users accessing invite link must see workspace preview
- Authenticated users can accept invites
- Invite usage must be tracked

### 3. Channel Management

#### FR-3.1: Channel Creation

- Workspace members must be able to create channels
- Channels must have:
  - Name (lowercase, no spaces, auto-formatted)
  - Optional description
  - Visibility (public or private)
- Public channels visible to all workspace members
- Private channels require explicit invitation (future enhancement)

#### FR-3.2: Channel Navigation

- Channels must be listed in workspace sidebar
- Channels organized by type: public channels, private channels
- Channel list shows channel name prefixed with #
- Active channel must be visually highlighted
- Users can click channel to switch to it

#### FR-3.3: Channel Membership

- All workspace members automatically join public channels
- Channel members can view channel description
- Channel members can view member count

### 4. Messaging

#### FR-4.1: Send Messages

- Users must be able to send messages in channels
- Users must be able to send direct messages to other workspace members
- Messages support markdown formatting
- Message input must support:
  - Multi-line text
  - Auto-expanding textarea
  - Keyboard shortcuts (Shift+Enter for new line, Enter to send)

#### FR-4.2: View Messages

- Messages must display in chronological order (oldest first)
- Message list must be scrollable
- Each message must show:
  - Sender's display name
  - Sender's avatar (or default)
  - Message content (rendered markdown)
  - Timestamp (relative or absolute)
  - Reactions (if any)
- Messages sent today show time only (e.g., "2:30 PM")
- Messages from previous days show date and time

#### FR-4.3: Message Threading

- Users can reply to messages (parent message)
- Threaded replies show indented or with visual connection
- Clicking thread shows reply chain
- Thread parent shows reply count

#### FR-4.4: Message Reactions

- Users can add emoji reactions to any message
- Multiple users can use same emoji (counts displayed)
- Users can remove their own reactions
- Common emojis available in quick picker:
  - 👍 :thumbsup:
  - ❤️ :heart:
  - 😂 :joy:
  - 🎉 :tada:
  - 🚀 :rocket:
  - 👀 :eyes:

### 5. Direct Messaging

#### FR-5.1: Start DM

- Users can initiate DMs with any workspace member
- DM conversations are workspace-scoped
- DM list shows in sidebar under "Direct Messages"
- DM entry shows other user's name and status

#### FR-5.2: DM Conversations

- DM interface same as channel interface
- DMs support all message features (markdown, reactions)
- DM header shows other user's profile info

### 6. Search & Discovery

#### FR-6.1: Member Directory (Basic)

- Users can view list of all workspace members
- Member list shows name, status, and avatar
- Clicking member opens DM conversation

### 7. AI Integration (Core Feature)

#### FR-7.1: AI Assistant Access

**Priority**: P0 (Critical)

- Users must be able to invoke AI assistant in any channel or DM
- AI must be triggered with @mention or /ai command
- AI must have access to conversation context (last 20 messages or context/token based chunking)
- AI responses must cite source messages when relevant
- Users must be able to ask follow-up questions

#### FR-7.2: Conversation Context

**Priority**: P0 (Critical)

- AI must understand current channel/DM context
- AI must be able to search recent messages for relevant information
- AI must provide answers with message references/links
- Context window: last 20 messages or 4000 tokens
- Workspace admins can configure context depth

#### FR-7.3: Code Assistance

**Priority**: P1 (High)

- AI must detect code blocks in messages
- AI must be able to analyze code and suggest improvements
- AI must answer technical questions about code
- AI must support Python, JavaScript, TypeScript initially
- AI must provide code examples when helpful

#### FR-7.4: Thread Summarization

**Priority**: P2 (Medium)

- Users can request AI summary of long threads
- Summary triggered by /summarize command or button
- Summary must include key points and action items
- Summary must link back to important messages
- Summary must be dismissible/expandable

#### FR-7.5: AI Configuration

**Priority**: P1 (High)

- Workspace admins can enable/disable AI features
- Admins can choose AI provider (OpenAI, Anthropic, etc.)
- Self-hosted deployments support custom API keys
- AI usage must be rate-limited per workspace
- Privacy: opt-out of AI at workspace level

---

## Non-Functional Requirements

### 1. Performance

#### NFR-1.1: Response Time

- API responses must complete within 500ms (P95)
- Message sending must feel instant (optimistic updates)
- Page load must complete within 2 seconds on 3G connection
- Initial chat view must render within 1 second

#### NFR-1.2: Scalability

- System must support 1000+ concurrent users
- Single workspace must support 500+ members
- Single channel must support 100+ active users
- Database must handle 10,000+ messages per day

#### NFR-1.3: Efficiency

- Initial JavaScript bundle must be < 200KB (gzipped)
- Lighthouse performance score must be > 90
- First Contentful Paint must be < 1.5s
- Time to Interactive must be < 3.5s

### 2. Security

#### NFR-2.1: Authentication

### Weevean uses OAuth-only authentication for simplicity and security:

- **GitHub**: Sign in with your GitHub account
- **Google**: Sign in with your Google account

No passwords, no email verification, no waiting. Just click and you're in.

#### NFR-2.2: Authorization

- All API endpoints must validate user authentication
- Workspace data access must be restricted to members
- Private channels must enforce member-only access
- Database must use Row Level Security (RLS) policies

#### NFR-2.3: Data Protection

- All connections must use TLS 1.2 or higher
- Database must encrypt data at rest
- Sensitive data must not appear in logs
- User data must not be shared with third parties

#### NFR-2.4.1: Input Validation

- All user input must be validated server-side
- SQL injection must be prevented via parameterized queries
- XSS attacks must be prevented via content sanitization
- Rate limiting must prevent API abuse

#### NFR-2.4.2: AI Privacy & Security

- AI prompts must not include sensitive data (passwords, tokens)
- AI responses must be logged for audit purposes
- AI provider APIs must use zero-data-retention mode
- User data must never be used for AI model training
- Workspace admins can disable AI entirely

### 3. Usability

#### NFR-3.1: User Interface

- Interface must be responsive (mobile, tablet, desktop)
- UI must follow consistent design system
- Loading states must be clearly indicated
- Error messages must be helpful and actionable

#### NFR-3.2: Accessibility

- UI must meet WCAG 2.2 Level AA standards
- All interactive elements must be keyboard accessible
- Screen readers must be able to navigate the interface
- Color contrast must meet accessibility guidelines

#### NFR-3.3: Browser Support

- Must support latest 2 versions of Chrome, Firefox, Safari, Edge
- Must gracefully degrade on older browsers
- Must work with JavaScript enabled (no-JS fallback not required)

### 4. Reliability

#### NFR-4.1: Availability

- System must maintain 99.5% uptime (excluding planned maintenance)
- Planned maintenance must be announced 24 hours in advance
- Database backups must run daily
- Recovery Time Objective (RTO): 4 hours
- Recovery Point Objective (RPO): 1 hour

#### NFR-4.2: Error Handling

- All errors must be logged with context
- Users must see friendly error messages
- Critical errors must trigger alerts
- Failed API requests must retry with exponential backoff

### 5. Maintainability

#### NFR-5.1: Code Quality

- Code must follow TypeScript strict mode
- Code must have consistent formatting (Prettier)
- Code must be linted (ESLint)
- Components must be modular and reusable

#### NFR-5.2: Documentation

- All public APIs must be documented
- Complex logic must have inline comments
- README must include setup instructions
- Architecture decisions must be documented

#### NFR-5.3: Testing

- Unit tests for critical business logic
- Integration tests for API endpoints
- E2E tests for critical user flows (future)
- Test coverage target: 70%+ (future)

### 6. Deployment

#### NFR-6.1: Environment Management

- Must support development, staging, and production environments
- Environment variables must be used for configuration
- Secrets must never be committed to version control (I'll FIGHT you!)
- Database migrations must be versioned and reversible

#### NFR-6.2: Deployment Process

- Deployments must be automated via CI/CD
- Zero-downtime deployments required for production
- Rollback must be possible within 5 minutes
- Health checks must validate deployment success

---

## User Stories

### Epic 1: Getting Started

**US-1.1**: As a new user, I want to create an account so I can access the platform.

- **Acceptance Criteria**:
  - Can sign up with GitHub or Google

**US-1.2**: As a registered user, I want to log in so I can access my workspaces.

- **Acceptance Criteria**:
  - Can log in with GitHub or Google

### Epic 2: Workspace Management

**US-2.1**: As a user, I want to create a workspace so my team can collaborate.

- **Acceptance Criteria**:
  - Can create workspace with unique name
  - Workspace appears in my workspace list
  - Automatically become workspace admin
  - Default "general" channel is created

**US-2.2**: As a workspace admin, I want to invite members so they can join.

- **Acceptance Criteria**:
  - Can generate invite link from workspace menu
  - Can set expiration and usage limits
  - Can copy link to clipboard
  - Can share link externally

**US-2.3**: As a user, I want to join a workspace via invite link.

- **Acceptance Criteria**:
  - Can open invite link while logged in
  - See workspace name and member count
  - Can accept or decline invite
  - After accepting, workspace appears in my list

**US-2.4**: As a user, I want to switch between workspaces easily.

- **Acceptance Criteria**:
  - See all my workspaces in left rail
  - Can click workspace to switch to it
  - Active workspace is visually highlighted
  - Switching workspace updates channels and messages

### Epic 3: Channel Communication

**US-3.1**: As a workspace member, I want to create channels to organize conversations.

- **Acceptance Criteria**:
  - Can create channel from sidebar
  - Can set channel name and description
  - Channel appears in channel list
  - Can choose public or private visibility

**US-3.2**: As a channel member, I want to send messages to communicate with my team.

- **Acceptance Criteria**:
  - Can type message in input box
  - Can press Enter to send (Shift+Enter for new line)
  - Message appears immediately in chat
  - Can format message with markdown

**US-3.3**: As a channel member, I want to see all messages in chronological order.

- **Acceptance Criteria**:
  - Messages display oldest to newest
  - Each message shows sender, time, and content
  - Can scroll through message history
  - Markdown is rendered properly

**US-3.4**: As a user, I want to react to messages with emojis.

- **Acceptance Criteria**:
  - Can click reaction button on any message
  - Can select emoji from picker
  - My reaction appears immediately
  - Can see other users' reactions
  - Can remove my reaction by clicking it again

### Epic 4: Direct Messaging

**US-4.1**: As a workspace member, I want to send DMs to other members.

- **Acceptance Criteria**:
  - Can start DM from member list
  - DM conversation opens in main area
  - Can send messages same as channels
  - DM appears in "Direct Messages" sidebar section

**US-4.2**: As a user, I want to see my DM conversations in the sidebar.

- **Acceptance Criteria**:
  - All my DMs listed under "Direct Messages"
  - DM shows other person's name and status
  - Clicking DM switches to that conversation
  - Active DM is visually highlighted

### Epic 5: User Experience

**US-5.1**: As a developer, I want to share code snippets with syntax highlighting.

- **Acceptance Criteria**:
  - Can write code in markdown code blocks
  - Code is syntax highlighted
  - Language can be specified (js, py, etc.)
  - Code is displayed in monospace font

**US-5.2**: As a user, I want to see when messages were sent.

- **Acceptance Criteria**:
  - Today's messages show time only
  - Older messages show date and time
  - Times display in my local timezone
  - Hovering shows full timestamp

**US-5.3**: As a user, I want to see who's in a workspace.

- **Acceptance Criteria**:
  - Can click member count in sidebar
  - See list of all workspace members
  - See each member's name and status
  - Can click member to start DM

### Epic 6: AI Assistant

**US-6.1**: As a developer, I want AI help with code questions.

- **Acceptance Criteria**:
  - Can @mention AI in any channel
  - Can ask questions about code in previous messages
  - AI provides answers with code examples
  - AI cites relevant messages when answering
  - AI understands programming languages (Python, JS, TS)

**US-6.2**: As a team member, I want AI to summarize long discussions.

- **Acceptance Criteria**:
  - Can trigger summary with /summarize command
  - AI reads entire thread and generates summary
  - Summary shows key points and decisions
  - Summary links to important messages
  - Summary is collapsible/expandable

**US-6.3**: As a workspace admin, I want to control AI features.

- **Acceptance Criteria**:
  - Can enable/disable AI in workspace settings
  - Can choose AI provider (OpenAI, Anthropic, local)
  - Can set AI usage limits per user
  - Can view AI usage analytics
  - Can export AI interaction logs

**US-6.4**: As a privacy-conscious user, I want transparency about AI.

- **Acceptance Criteria**:
  - Clear indication when AI is used
  - Can see what context AI received
  - Understand data is not used for training
  - Can opt-out of AI features
  - AI privacy policy is accessible

---

## API Requirements

### Authentication Endpoints

[Better Auth](https://www.better-auth.com/)

### Workspace Endpoints

#### POST /api/workspaces

```typescript
Request: {
  name: string
  iconUrl?: string
}
Response: {
  success: boolean
  data: {
    id: string
    name: string
    slug: string
    ownerId: string
  }
}
```

#### GET /api/workspaces

```typescript
Response: {
  success: boolean;
  data: Array<{
    id: string;
    name: string;
    slug: string;
    iconUrl?: string;
    memberCount: number;
  }>;
}
```

#### POST /api/workspaces/:workspaceId/invite

```typescript
Request: {
  expiresAt?: Date
  maxUses?: number
}
Response: {
  success: boolean
  data: {
    code: string
    url: string
    expiresAt?: Date
  }
}
```

### Channel Endpoints

#### POST /api/workspaces/:workspaceId/channels

```typescript
Request: {
  name: string
  description?: string
  isPrivate: boolean
}
Response: {
  success: boolean
  data: {
    id: string
    name: string
    workspaceId: string
  }
}
```

#### GET /api/channels/:channelId/messages

```typescript
Query: {
  limit?: number
  before?: string // cursor
}
Response: {
  success: boolean
  data: Array<{
    id: string
    userId: string
    content: string
    createdAt: Date
    user: {
      displayName: string
      avatarUrl?: string
    }
    reactions: Array<{
      emoji: string
      count: number
      userReacted: boolean
    }>
  }>
}
```

#### POST /api/channels/:channelId/messages

```typescript
Request: {
  content: string
  parentId?: string
}
Response: {
  success: boolean
  data: {
    id: string
    content: string
    createdAt: Date
  }
}
```

### Direct Message Endpoints

#### POST /api/dms

```typescript
Request: {
  workspaceId: string
  otherUserId: string
}
Response: {
  success: boolean
  data: {
    id: string
    otherUser: {
      id: string
      displayName: string
      avatarUrl?: string
    }
  }
}
```

#### GET /api/dms/:dmId/messages

```typescript
Response: {
  success: boolean;
  data: Array<{
    id: string;
    senderId: string;
    content: string;
    createdAt: Date;
  }>;
}
```

### Reaction Endpoints

#### POST /api/messages/:messageId/reactions

```typescript
Request: {
  emoji: string;
}
Response: {
  success: boolean;
}
```

#### DELETE /api/messages/:messageId/reactions

```typescript
Query: {
  emoji: string;
}
Response: {
  success: boolean;
}
```

### AI Assistant Endpoints

#### POST /api/ai/chat

```typescript
Request: {
  workspaceId: string
  channelId?: string
  dmId?: string
  message: string
  contextMessages?: string[] // IDs of messages for context
}
Response: {
  success: boolean
  data: {
    response: string
    citations?: Array<{
      messageId: string
      excerpt: string
    }>
    model: string
    tokensUsed: number
  }
}
```

#### POST /api/ai/summarize

```typescript
Request: {
  messageIds: string[]
  format?: 'brief' | 'detailed'
}
Response: {
  success: boolean
  data: {
    summary: string
    keyPoints: string[]
    actionItems?: string[]
  }
}
```

#### GET /api/ai/config

```typescript
Response: {
  success: boolean;
  data: {
    enabled: boolean;
    provider: "openai" | "anthropic" | "custom";
    rateLimit: {
      requests: number;
      window: string;
    }
  }
}
```

---

## Data Requirements

### Data Retention

- **Messages**: Retained indefinitely (workspace owner can delete)
- **User accounts**: Retained until user deletes account
- **Invite links**: Deleted after expiration or max uses reached
- **Session data**: Deleted after 7 days of inactivity

### Data Volume Estimates

**Per Workspace**:

- Average members: 20-50
- Average channels: 5-15
- Messages per day: 100-500

**System-wide**:

- Total users: 1,000-10,000 (year 1)
- Total workspaces: 100-1,000 (year 1)
- Total messages: 100K-1M (year 1)

### Data Privacy

- User email addresses must not be publicly visible
- Private channels must enforce access control
- DMs must only be visible to participants
- Deleted users' data must be anonymized (not deleted)

### Data Migration

- Database schema changes must use migrations
- Migrations must be reversible
- Data must not be lost during migrations
- Downtime window: < 5 minutes per migration

---

## Future Enhancements

### Phase 2: Advanced Messaging

- **Message editing**: Edit sent messages (with "edited" indicator)
- **Message deletion**: Delete messages (with "deleted" indicator)
- **Message search**: Full-text search across all messages
- **Advanced threading**: Better UI for viewing thread conversations
- **Read receipts**: See who has read messages
- **Typing indicators**: See when others are typing

### Phase 3: Rich Content

- **File uploads**: Share images, documents, and other files
- **Image previews**: Inline image display
- **Link unfurling**: Auto-expand links with previews
- **GIF support**: Integrated GIF picker
- **Custom emoji**: Upload and use custom emoji
- **Voice messages**: Record and send audio messages

### Phase 4: Code Execution

- **In-browser code execution**: Run Python/JavaScript snippets
- **Language support**: Python, JavaScript, TypeScript initially
- **Safety**: Client-side WASM execution for security
- **Output display**: Show code output inline
- **Execution time**: Display runtime metrics
- **AI + Code**: AI can suggest fixes when code fails

### Phase 5: Advanced AI Features

- **Semantic search**: AI-powered message search across workspace
- **Smart replies**: AI-suggested responses based on context
- **Sentiment analysis**: Detect tone in conversations
- **Auto-categorization**: AI suggests channels for messages
- **Meeting summarization**: Auto-summarize voice/video calls
- **Code generation**: AI generates code from natural language
- **Documentation search**: AI searches linked documentation
- **Multi-language support**: AI translates messages

### Phase 6: Integrations

- **GitHub**: Link PRs, issues, commits in messages
- **GitLab**: Similar to GitHub integration
- **Linear**: Link issues and project updates
- **Notion**: Embed Notion pages
- **Calendar**: Schedule meetings from chat
- **Webhooks**: Send/receive messages via webhooks

### Phase 7: Enterprise Features

- **Single Sign-On (SSO)**: SAML/OAuth integration
- **Advanced permissions**: Custom role definitions
- **Audit logs**: Track all user actions
- **Data export**: Export all workspace data
- **Analytics**: Usage statistics and insights
- **SLA guarantees**: 99.9% uptime commitment

### Phase 8: Mobile & Desktop

- **Progressive Web App**: Installable web app
- **Push notifications**: Native mobile notifications
- **Offline mode**: View cached messages offline
- **Native iOS app**: Native experience on iPhone/iPad
- **Native Android app**: Native experience on Android
- **Desktop apps**: Electron-based Mac/Windows/Linux apps

### Phase 9: Communication

- **Voice calls**: One-on-one voice conversations
- **Video calls**: One-on-one video conversations
- **Screen sharing**: Share screen during calls
- **Channel calls**: Multi-person audio/video in channels
- **Call recording**: Record calls for later playback

### Phase 10: Performance & Scale

- **WebSocket support**: Real-time message delivery
- **Message pagination**: Efficient loading of message history
- **Virtual scrolling**: Handle thousands of messages
- **CDN for media**: Fast image/file delivery worldwide
- **Database sharding**: Horizontal scaling for large deployments
- **Redis caching**: Reduce database load

---

## Success Metrics

### User Engagement

- Daily Active Users (DAU)
- Monthly Active Users (MAU)
- Messages sent per day
- Average session duration
- Retention rate (D1, D7, D30)

### Performance

- API response time (P50, P95, P99)
- Page load time
- Error rate (< 1%)
- Uptime (> 99.5%)

### Business

- Number of workspaces created
- Average workspace size
- Conversion to paid plans (future)
- Customer satisfaction score

---

This requirements document serves as the foundation for development. As Weevean evolves, requirements will be refined based on user feedback and usage patterns. Regular reviews ensure alignment with user needs and technical capabilities.
