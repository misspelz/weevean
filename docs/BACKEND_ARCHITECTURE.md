# Weevean Backend Architecture (NestJS Microservices)

> **Strategy**: Build MVP with Next.js API routes, then migrate real-time features to dedicated NestJS backend in parallel.

## Table of Contents

1. [Overview](#overview)
2. [Why Separate Backend](#why-separate-backend)
3. [System Architecture](#system-architecture)
4. [Services Architecture](#services-architecture)
5. [WebSocket Gateway](#websocket-gateway)
6. [AI Processing Service](#ai-processing-service)
7. [Video Service](#video-service)
8. [Database Strategy](#database-strategy)
9. [Deployment Architecture](#deployment-architecture)
10. [Migration Path](#migration-path)
11. [File Structure](#file-structure)

---

## Overview

The Weevean backend is a **microservices architecture** built with NestJS that handles:

- Real-time WebSocket connections
- AI background processing
- Video/audio calling infrastructure
- Long-running tasks and queues

### Tech Stack

- **Framework**: NestJS (TypeScript)
- **WebSockets**: Socket.io via `@nestjs/websockets`
- **Queue**: Bull + Redis via `@nestjs/bull`
- **Video**: LiveKit or Jitsi integration
- **Database**: Shared Neon Postgres (same as Next.js)
- **Cache**: Redis (for pub/sub and sessions)
- **Deployment**: Railway, Render, or Fly.io

---

## Why Separate Backend

### What Stays in Next.js API Routes

✅ **Stateless CRUD operations**:

- Create/read/update workspaces
- Manage channels
- User profiles
- Invite codes
- Authentication flows

**Why**: Serverless is perfect for these - cheap, auto-scales, edge-deployed.

### What Moves to NestJS Backend

❌ **Stateful/Long-running operations**:

- Real-time message delivery
- WebSocket connections
- Video call signaling
- AI processing (>10s)
- File processing
- Background jobs

**Why**:

- Next.js API routes timeout at 10-60s (Higher on pro/enterprise plans)
- Serverless can't maintain persistent connections
- Cold starts hurt WebSocket UX
- Background jobs need queues

---

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Client                              │
│                    (Next.js App)                            │
└─────────────┬───────────────────────┬───────────────────────┘
              │                       │
              │ REST (CRUD)           │ WebSocket (Real-time)
              ▼                       ▼
┌─────────────────────┐   ┌──────────────────────────────────┐
│   Next.js Server    │   │     NestJS Backend               │
│   (API Routes)      │   │                                  │
│                     │   │  ┌────────────────────────────┐  │
│  • Auth             │   │  │  WebSocket Gateway         │  │
│  • CRUD Ops         │   │  │  (Real-time Messages)      │  │
│  • Invites          │   │  └────────────────────────────┘  │
│  • Profiles         │   │                                  │
└──────────┬──────────┘   │  ┌────────────────────────────┐  │
           │              │  │  AI Worker Service         │  │
           │              │  │  (Background Jobs)         │  │
           │              │  └────────────────────────────┘  │
           │              │                                  │
           │              │  ┌────────────────────────────┐  │
           │              │  │  Video Service             │  │
           │              │  │  (WebRTC Signaling)        │  │
           │              │  └────────────────────────────┘  │
           │              └─────────────┬────────────────────┘
           │                            │
           ▼                            ▼
    ┌────────────────────────────────────────────┐
    │           Shared Infrastructure            │
    │                                            │
    │  • Neon Postgres (Database)               │
    │  • Redis (Pub/Sub + Cache)                │
    │  • Vercel Blob (File Storage)             │
    │  •[Better Auth](https://www.better-auth.com/)      │
    └────────────────────────────────────────────┘
```

---

## Services Architecture

### Core Services

```typescript
// backend/src/app.module.ts
@Module({
  imports: [
    ConfigModule.forRoot(),
    DatabaseModule, // Shared Neon connection
    RedisModule, // Pub/sub + cache
    WebSocketModule, // Real-time gateway
    AiWorkerModule, // AI processing
    VideoModule, // Video calls
    QueueModule, // Bull queues
  ],
})
export class AppModule {}
```

---

## WebSocket Gateway

### Purpose

Handle all real-time features:

- Message delivery
- Typing indicators
- Presence (online/offline)
- Reactions
- Channel updates

### Redis Pub/Sub for Horizontal Scaling

Handles balancing

---

## AI Processing Service

### Purpose

Handle long-running AI operations:

- Thread summarization (30-120s) or as much as we need.
- Code analysis
- Smart search indexing
- Conversation embeddings

### Queue-Based Architecture

`@nestjs/bull` For queue management

---

## Video Service

### Architecture

```
Client A <--> NestJS WebRTC Signaling <--> Client B
                      |
                      v
              LiveKit/Jitsi Server
```

---

## Database Strategy

### Shared Database

Both Next.js and NestJS use the **same Neon Postgres database**.

### Why Shared?

- ✅ Single source of truth
- ✅ No data sync issues
- ✅ Easier to maintain
- ✅ Neon handles pooling

### Connection Pooling

- Next.js: 5-10 connections (low traffic)
- NestJS: 20-50 connections (high traffic)
- Total: Well within Neon limits

---

## Deployment Architecture

### Development

```
Frontend:  localhost:3000 (Next.js)
Backend:   localhost:4000 (NestJS)
Redis:     localhost:6379 (Docker)
Database:  Neon Cloud
```

### Production

**Option A: Single Server (Early Stage)**

```
Railway/Render Single Instance:
- NestJS backend
- Redis (managed)
- ~$20-50/month (Guessing)
```

**Option B: Microservices (Scale)**

```
Vercel:     Next.js frontend
Railway:    NestJS WebSocket service
Railway:    NestJS AI worker
Upstash:    Redis (managed)
Neon:       Postgres (managed)
LiveKit:    Video service
```

---

## Migration Path

### Phase 1: MVP (Next.js Only) - Weeks 1-8

- Build all features in Next.js API routes
- Use polling for "real-time" updates
- No video calls yet
- **Goal**: Ship fast, validate product

### Phase 2: Add WebSocket Server - Weeks 8-16

**Team A**: Continue building features in Next.js
**Team B**: Build NestJS WebSocket gateway

1. Deploy NestJS with WebSocket support
2. Update frontend to connect via Socket.io
3. Keep CRUD in Next.js (it works fine!)
4. Real-time messages now via WebSocket

### Phase 3: Add AI Workers - Weeks 16-24

1. Deploy Bull + Redis
2. Create AI processing queues
3. Move long-running AI tasks to background jobs

### Phase 4: Add Video - Weeks 24-28

1. Integrate LiveKit/Jitsi
2. Create video signaling gateway
3. Launch video calling feature

---

## File Structure

> (Best guess. Will-change)

```
backend/
├── src/
│   ├── app.module.ts                 # Root module
│   ├── main.ts                       # Bootstrap
│   │
│   ├── common/                       # Shared utilities
│   │   ├── guards/                   # Auth guards
│   │   ├── decorators/               # Custom decorators
│   │   └── filters/                  # Exception filters
│   │
│   ├── config/                       # Configuration
│   │   ├── database.config.ts
│   │   ├── redis.config.ts
│   │   └── app.config.ts
│   │
│   ├── database/                     # Database module
│   │   ├── database.module.ts
│   │   ├── schema.ts                 # Shared with frontend
│   │   └── queries.ts
│   │
│   ├── websocket/                    # Real-time gateway
│   │   ├── websocket.module.ts
│   │   ├── websocket.gateway.ts
│   │   ├── presence.service.ts
│   │   └── typing.service.ts
│   │
│   ├── ai/                           # AI processing
│   │   ├── ai.module.ts
│   │   ├── ai.processor.ts           # Bull processor
│   │   ├── ai.service.ts
│   │   └── prompts/
│   │       ├── summarize.prompt.ts
│   │       └── analyze.prompt.ts
│   │
│   ├── video/                        # Video calls
│   │   ├── video.module.ts
│   │   ├── video.gateway.ts
│   │   ├── livekit.service.ts
│   │   └── call.service.ts
│   │
│   ├── media/                        # File processing
│   │   ├── media.module.ts
│   │   ├── media.processor.ts
│   │   └── upload.service.ts
│   │
│   └── queue/                        # Queue management
│       ├── queue.module.ts
│       └── queue.config.ts
│
├── test/                             # E2E tests
├── .env.example
├── package.json
├── tsconfig.json
└── nest-cli.json
```

---

## Summary

### What This Architecture Achieves

✅ **Fast MVP**: Ship with Next.js API routes first
✅ **Real-time**: WebSocket gateway for instant updates
✅ **Scalable**: Microservices can scale independently
✅ **Reliable**: Queue system for background jobs
✅ **Cost-effective**: Only run dedicated servers for what needs them
✅ **Maintainable**: Clear separation of concerns

This approach lets us ship fast while building the robust infrastructure in parallel. No big-bang rewrites, just gradual enhancement.
