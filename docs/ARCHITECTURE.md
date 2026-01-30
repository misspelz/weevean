# Weevean Architecture

This document outlines the system architecture, design patterns, and technical decisions for Weevean.

## Table of Contents

1. [System Architecture Overview](#system-architecture-overview)
2. [Application Architecture](#application-architecture)
3. [Database Schema](#database-schema)
4. [API Architecture](#api-architecture)
5. [Authentication & Authorization Flow](#authentication--authorization-flow)
6. [Data Flow](#data-flow)
7. [Design Patterns](#design-patterns)
8. [File Structure](#file-structure)
9. [Security Architecture](#security-architecture)
10. [Performance Considerations](#performance-considerations)

---

## System Architecture Overview

Weevean follows a modern serverless architecture pattern optimized for scalability and developer experience.

```
┌─────────────────────────────────────────────────────────────┐
│                         Client Layer                         │
│  (Next.js App Router + React Server Components)             │
│  - Server Components (data fetching)                        │
│  - Client Components (interactivity)                        │
└───────────────────────┬─────────────────────────────────────┘
                        │
┌───────────────────────▼─────────────────────────────────────┐
│                      API Layer (Next.js)                     │
│  - RESTful API Routes                                       │
│  - Server Actions                                           │
│  - Middleware (auth, CORS)                                  │
└───────────┬────────────────────────────┬────────────────────┘
            │                            │
┌───────────▼──────────┐    ┌───────────▼──────────┐
│   Supabase Auth      │    │   Neon Postgres      │
│  - User Management   │    │  - User Data         │
│  - Session Handling  │    │  - Workspaces        │
│  - OAuth             │    │  - Messages          │
└──────────────────────┘    │  - Channels          │
                            └──────────────────────┘
```

### Technology Choices

- **Next.js 16**: App Router for optimal performance with RSC
- **React 19**: Latest features
- **TypeScript**: Type safety across the entire stack
- **Neon Postgres**: Serverless, autoscaling database
- **Supabase Auth**: Managed authentication with row-level security
- **Vercel**: Edge-optimized hosting with zero-config deployments

---

## Application Architecture

### Rendering Strategy

Weevean uses a hybrid rendering approach:

**Server Components (Default)**:

- Initial page loads
- Data fetching from database
- SEO-critical content
- Reduces client-side JavaScript

**Client Components**:

- Interactive UI elements (modals, dropdowns, etc)
- Real-time updates (message lists)
- Form submissions
- User input handling
- Others

### Component Hierarchy

```
ChatLayout (Server Component)
├── WorkspaceRail (Client)
│   └── WorkspaceList (fetch in layout)
├── WorkspaceSidebar (Client)
│   ├── ChannelList
│   ├── DirectMessageList
│   └── UserProfile
└── MainChatArea (Client)
    ├── ChatHeader (Server/Client hybrid)
    ├── MessageList (Client)
    │   └── Message (Client)
    │       ├── MarkdownRenderer (Client)
    │       ├── ExecutableCodeBlock (Client)
    │       └── ReactionBar (Client)
    └── MessageInput (Client)
```

---

## Database Schema

### Entity Relationship Diagram

```
users (auth.users extension)
  ├─< workspace_members >─┐
  │                        │
  ├─< messages            workspaces
  │                        │
  ├─< reactions           ├─< channels
  │                        │   └─< messages
  └─< dm_messages          │       └─< reactions
                           │
                           ├─< workspace_invites
                           │
                           └─< direct_messages
                               └─< dm_messages
```

---

## API Architecture

### RESTful API Design

All APIs follow REST conventions with consistent patterns:

```
POST   /api/workspaces                    - Create workspace
GET    /api/workspaces                    - List user's workspaces
POST   /api/workspaces/:id/channels       - Create channel
POST   /api/workspaces/:id/invite         - Generate invite link
GET    /api/workspaces/:id/members        - List workspace members

POST   /api/channels/:id/messages         - Send message
GET    /api/channels/:id/messages         - Fetch messages

POST   /api/messages/:id/reactions        - Add reaction
DELETE /api/messages/:id/reactions        - Remove reaction

GET    /api/invites/:code                 - Validate invite
POST   /api/invites/:code/accept          - Accept invite

POST   /api/dms                           - Create/get DM
GET    /api/dms/:id/messages              - Fetch DM messages
POST   /api/dms/:id/messages              - Send DM message
```

### API Response Format

Consistent JSON response structure:

```typescript
// Success response
{
  success: true,
  data: { ... }
}

// Error response
{
  success: false,
  error: "Error message"
}
```

### Error Handling

Standardized HTTP status codes:

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (not authenticated)
- `403` - Forbidden (not authorized)
- `404` - Not Found
- `500` - Internal Server Error

---

## Authentication & Authorization Flow

### Authentication Flow

Weevean uses OAuth-only authentication for simplicity and security:

- **GitHub**: Sign in with your GitHub account
- **Google**: Sign in with your Google account

No passwords, no email verification, no waiting. Just click and you're in.

### Authorization Middleware

Proxy middleware (`proxy.ts`) handles:

1. Session validation on each request
2. Token refresh when expired
3. Cookie management (HTTP-only, secure)
4. Protected route enforcement

```typescript
// Protected routes
const protectedRoutes = ["/chat", "/api/workspaces", "/api/channels"];

// Public routes
const publicRoutes = ["/auth/login", "/auth/sign-up", "/invite"];
```

### Row Level Security (RLS)

Database-level authorization ensures data isolation:

---

## Data Flow

### Message Creation Flow

```
User types message → MessageInput component
                    ↓
              Form submission
                    ↓
    POST /api/channels/:id/messages
                    ↓
         Validate authentication
                    ↓
      Check workspace membership
                    ↓
        Insert into database
                    ↓
         Return new message
                    ↓
    Client updates UI optimistically
                    ↓
      Real-time sync (future: WebSockets)
```

### Workspace Invite Flow

```
Admin generates invite → POST /api/workspaces/:id/invite
                       ↓
              Create invite record
                       ↓
       Generate random code (nanoid)
                       ↓
          Return invite URL
                       ↓
          Share URL with users
                       ↓
    User visits /invite/:code
                       ↓
       Validate invite (expiry, uses)
                       ↓
      Show workspace preview
                       ↓
    User clicks "Join"
                       ↓
   POST /api/invites/:code/accept
                       ↓
    Create workspace_member record
                       ↓
     Redirect to workspace
```

---

## Design Patterns

### 1. Repository Pattern

Database queries are abstracted into `lib/db/queries.ts`:

```typescript
// Centralized data access
export async function getWorkspacesByUser(userId: string) {
  // Complex join logic hidden from API routes
}

export async function createMessage(
  channelId: string,
  userId: string,
  content: string
) {
  // Validation and insertion logic encapsulated
}
```

**Benefits**:

- Separation of concerns
- Easier to test
- Consistent query patterns
- Simplified API routes

### 2. Component Composition

Breaking down complex UIs into composable pieces:

```typescript
// Bad: One massive ChatPage component

// Good: Composed from smaller components
<ChatLayout>
  <WorkspaceRail />
  <WorkspaceSidebar />
  <MainChatArea>
    <ChatHeader />
    <MessageList />
    <MessageInput />
  </MainChatArea>
</ChatLayout>
```

### 3. Server Component + Client Component Pattern

Optimal data fetching with minimal JavaScript:

```typescript
// Server Component (data fetching)
async function ChatPage() {
  const workspaces = await getWorkspaces();
  const channels = await getChannels();

  return <ChatLayout workspaces={workspaces} channels={channels} />;
}

// Client Component (interactivity)
("use client");
function MessageInput({ channelId }: { channelId: string }) {
  const [message, setMessage] = useState("");
  // Interactive logic here
}
```

### 4. Optimistic Updates

Immediate UI feedback before server confirmation:

```typescript
async function sendMessage(content: string) {
  // 1. Update UI immediately
  addMessageToUI({ id: "temp", content, userId, createdAt: new Date() });

  // I prefer using `useOptimistic(state, updateFn)`

  try {
    // 2. Send to server
    const message = await fetch("/api/messages", { body: content });

    // 3. Replace temp with real message
    replaceMessage("temp", message);
  } catch (error) {
    // 4. Rollback on error
    removeMessage("temp");
    showError("Failed to send message");
  }
}
```

---

## File Structure

```
Weevean/
├── app/
│   ├── api/                        # API Routes
│   │   ├── workspaces/
│   │   │   ├── route.ts           # POST, GET /workspaces
│   │   │   └── [workspaceId]/
│   │   │       ├── channels/
│   │   │       │   └── route.ts   # Channel CRUD
│   │   │       ├── invite/
│   │   │       │   └── route.ts   # Generate invite
│   │   │       └── members/
│   │   │           └── route.ts   # List members
│   │   ├── channels/
│   │   │   └── [channelId]/
│   │   │       └── messages/
│   │   │           └── route.ts   # Message CRUD
│   │   ├── dms/
│   │   │   ├── route.ts           # Create/get DM
│   │   │   └── [dmId]/
│   │   │       └── messages/
│   │   │           └── route.ts   # DM messages
│   │   ├── invites/
│   │   │   └── [code]/
│   │   │       ├── route.ts       # Validate invite
│   │   │       └── accept/
│   │   │           └── route.ts   # Accept invite
│   │   └── messages/
│   │       └── [messageId]/
│   │           └── reactions/
│   │               └── route.ts   # Reaction toggle
│   ├── auth/                       # Auth pages
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── sign-up/
│   │   │   └── page.tsx
│   │   └── sign-up-success/
│   │       └── page.tsx
│   ├── chat/                       # Main app
│   │   └── page.tsx
│   ├── invite/
│   │   └── [code]/
│   │       └── page.tsx           # Invite acceptance
│   ├── layout.tsx                 # Root layout
│   ├── page.tsx                   # Landing page
│   └── globals.css                # Global styles
│
├── components/
│   ├── chat/                      # Chat components
│   │   ├── chat-header.tsx
│   │   ├── chat-layout.tsx
│   │   ├── dm-header.tsx
│   │   ├── executable-code-block.tsx
│   │   ├── invite-accept-client.tsx
│   │   ├── markdown-renderer.tsx
│   │   ├── message-input.tsx
│   │   ├── message-list.tsx
│   │   ├── workspace-rail.tsx
│   │   ├── workspace-sidebar.tsx
│   │   └── modals/
│   │       ├── create-channel-modal.tsx
│   │       ├── create-workspace-modal.tsx
│   │       └── invite-members-modal.tsx
│   └── ui/                        # shadcn/ui components
│       ├── button.tsx
│       ├── dialog.tsx
│       ├── dropdown-menu.tsx
│       ├── input.tsx
│       ├── scroll-area.tsx
│       └── ... (other shadcn components)
│
├── lib/
│   ├── db/
│   │   ├── index.ts              # Database client
│   │   ├── schema.ts             # Drizzle schema
│   │   └── queries.ts            # Data access layer
│   ├── supabase/
│   │   ├── client.ts             # Browser client
│   │   ├── server.ts             # Server client
│   │   └── proxy.ts              # Middleware helper
│   ├── code-execution/
│   │   └── runtime-manager.ts    # WASM execution (future)
│   └── utils.ts                  # Utility functions
│
├── scripts/
│   ├── 001-create-tables.sql    # Initial schema
│   └── 002-enable-rls.sql       # Security policies
│
├── docs/
│   ├── ARCHITECTURE.md           # This file
│   ├── REQUIREMENTS.md
│   ├── TECHSTACK.md
│   ├── CONTRIBUTING.md
│   └── briefs/
│       ├── LANDING_PAGE_BRIEF.md
│       └── JUNIOR_DEV_TASKS.md
│
├── proxy.ts                      # Auth middleware
├── next.config.mjs
├── package.json
├── tsconfig.json
└── tailwind.config.ts
└── README.md
```

---

## Security Architecture

### 1. Authentication Security

- **HTTP-only cookies**: Tokens not accessible via JavaScript
- **Secure flag**: Cookies only sent over HTTPS in production
- **SameSite=Lax**: CSRF protection
- **Token refresh**: Automatic renewal before expiration
- **Session validation**: Every request validates auth state

### 2. Authorization Security

- **Workspace isolation**: Users only access their workspaces
- **Role-based access**: Admin vs member permissions
- **RLS policies**: Database-enforced authorization
- **API validation**: Every endpoint checks permissions

### 3. Input Validation

- **Parameterized queries**: SQL injection prevention
- **Content sanitization**: XSS prevention in markdown
- **Rate limiting**: Prevent abuse (future enhancement)
- **Input length limits**: Prevent DoS attacks

### 4. Data Protection

- **Encrypted connections**: TLS for all traffic
- **Encrypted at rest**: Database encryption
- **Sensitive data**: No passwords stored (OAuth used - Gg/Google)
- **Audit logs**: Track invite usage and membership changes

---

## Performance Considerations

### 1. Database Optimization

- **Indexes on foreign keys**: Fast joins
- **Composite indexes**: Multi-column queries
- **Connection pooling**: Neon handles automatically
- **Query optimization**: Use EXPLAIN for slow queries

### 2. Rendering Optimization

- **Server Components**: Reduce client JavaScript
- **Code splitting**: Automatic with Next.js
- **Image optimization**: Next.js Image component
- **Font optimization**: next/font with variable fonts

### 3. Caching Strategy

- **Static pages**: Landing, auth pages
- **Revalidation**: Channel/workspace lists (future: SWR)
- **CDN caching**: Static assets on Vercel Edge
- **Client-side caching**: React Query or SWR (future)

### 4. Scalability

- **Serverless functions**: Auto-scale with traffic
- **Database scaling**: Neon autoscaling
- **Edge runtime**: Fast global response times
- **WebSocket upgrade**: Real-time at scale (future)

### 5. Bundle Optimization

- **Tree shaking**: Remove unused code
- **Dynamic imports**: Load code on demand
- **Minification**: Production builds
- **Compression**: Gzip/Brotli on Vercel

---

## Future Architectural Considerations

### Real-time Communication

Current: Polling-based updates  
Future: WebSocket connections for instant message delivery

```
┌─────────┐              ┌──────────┐              ┌──────────┐
│ Client  │◄────────────►│ WebSocket │◄────────────►│ Database │
│         │  Persistent  │  Server   │   Subscribe  │          │
└─────────┘  Connection  └──────────┘   to changes └──────────┘
```

### Microservices Consideration

Current: Monolithic Next.js app  
Future: Potential service extraction

- **Message service**: Handle high-throughput messaging
- **Notification service**: Email, push, in-app notifications
- **Search service**: Elasticsearch for advanced search (Or we build ours)
- **File service**: Upload and storage management

### Event-Driven Architecture

Future enhancement for async workflows:

```
User action → Event bus → Multiple handlers
                          ├─ Update database
                          ├─ Send notification
                          ├─ Update search index
                          └─ Emit WebSocket event
```

---

## Monitoring & Observability

### Key Metrics (Future Implementation)

- **Response times**: P50, P95, P99 for all API routes
- **Error rates**: 4xx and 5xx by endpoint
- **Database performance**: Query times, connection pool usage
- **User metrics**: Active users, messages sent, workspaces created
- **Resource usage**: Memory, CPU, bandwidth

### Logging Strategy

- **Structured logging**: JSON format for parsing
- **Log levels**: ERROR, WARN, INFO, DEBUG
- **Context**: User ID, workspace ID, request ID
- **Retention**: 30 days for debugging

---

> Note: This Design/Architecture is based on my best guess building the system from ground up on paper. Many details might change during development. I'll do my best to update all Docs relatively.

This architecture is designed for evolution. Start simple, measure, and optimize based on actual usage patterns. The foundation supports scaling to thousands of concurrent users while maintaining developer productivity and code quality.
