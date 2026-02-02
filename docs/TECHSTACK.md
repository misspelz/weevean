# Weevean Tech Stack

This document details the technology choices for Weevean, including rationale, alternatives considered, and key considerations.

## Table of Contents

1. [Overview](#overview)
2. [Frontend Stack](#frontend-stack)
3. [Backend Stack](#backend-stack)
4. [Database & Storage](#database--storage)
5. [Authentication & Authorization](#authentication--authorization)
6. [Deployment & Infrastructure](#deployment--infrastructure)
7. [Development Tools](#development-tools)
8. [AI Integration](#ai-integration)
9. [Future Considerations](#future-considerations)

---

## Overview

Weevean uses a modern, serverless-first architecture optimized for developer productivity, performance, and scalability. The stack is chosen to minimize operational overhead while maximizing development velocity.

### Core Principles

1. **Developer Experience**: Tools should enhance, not hinder, development
2. **Type Safety**: TypeScript everywhere for catching errors early
3. **Serverless**: No server management, automatic scaling
4. **Modern**: Use latest stable versions of technologies
5. **Open Source**: Prefer open-source tools and libraries

---

## Frontend Stack

### React 19.2

**Purpose**: UI library for building user interfaces

**Why React**:

- Massive ecosystem and community support
- Component-based architecture promotes reusability
- Excellent performance with concurrent rendering
- Server Components reduce client JavaScript
- Industry standard with abundant resources

**Alternatives Considered**:

- **Vue 3**: Good DX but smaller ecosystem
- **Svelte**: Great performance but less mature ecosystem
- **Solid.js**: Excellent performance but smaller community

**Version**: 19.2

- Activity component for show/hide UI states
- useEffectEvent for non-reactive Effect logic

### Next.js 16

**Purpose**: React framework with server-side rendering and routing

**Why Next.js**:

- App Router with React Server Components
- Built-in API routes (no separate backend needed)
- Automatic code splitting and optimization
- Excellent developer experience
- Vercel deployment integration
- File-based routing reduces boilerplate

**Alternatives Considered**:

- **Remix**: Great DX but less mature ecosystem
- **Create React App**: Too basic, no SSR
- **Vite + React Router**: More manual configuration

**Key Features Used**:

- App Router (not Pages Router)
- Server Components for data fetching
- Server Actions for mutations
- API Routes for REST endpoints
- Middleware for authentication

### TypeScript 5.x

**Purpose**: Type-safe JavaScript

**Why TypeScript**:

- Catch errors at compile time, not runtime
- Excellent IDE support with autocomplete
- Self-documenting code with types
- Easier refactoring with confidence
- Industry standard for large codebases

**Configuration**:

```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitReturns": true
  }
}
```

### Tailwind CSS v4

**Purpose**: Utility-first CSS framework

**Why Tailwind**:

- Rapid UI development with utility classes
- Consistent design system out of the box
- No CSS naming conflicts
- Excellent performance (purges unused styles)
- Easy to customize with config
- Works great with component libraries

> We love OSS and encourage supporting tailwindcss

**Alternatives Considered**:

- **Styled Components**: Runtime overhead, harder to optimize
- **CSS Modules**: More boilerplate, less utility
- **Plain CSS**: Too much manual work, no conventions

**Key Features**:

- v4 CSS-first configuration
- Custom design tokens in globals.css
- Responsive modifiers (md:, lg:)
- Dark mode support (future)

### shadcn/ui

**Purpose**: Component library built on Radix UI

**Why shadcn/ui**:

- Copy-paste components (not installed via npm)
- Full control over component code
- Built on Radix UI primitives (accessible)
- Customizable with Tailwind
- No runtime JavaScript for most components
- Actively maintained

**Alternatives Considered**:

- **Chakra UI**: More opinionated, harder to customize
- **Material UI**: Heavy, opinionated design
- **Radix UI**: Lower level, more work to style

---

## Backend Stack

### Next.js API Routes

**Purpose**: Serverless API endpoints

**Why API Routes**:

- Colocated with frontend (monorepo benefits)
- Automatic deployment with frontend
- TypeScript support end-to-end
- Serverless (auto-scaling)
- No separate backend service to manage

**Alternatives Considered**:

- **Express.js**: Requires separate deployment
- **Fastify**: Same deployment complexity
- **tRPC**: Great for TypeScript but overkill for REST

### Neon Serverless Driver

**Purpose**: Database client for Neon Postgres

**Why Neon Driver**:

- Low-latency HTTP queries
- WebSocket support for connection pooling
- Designed for serverless/edge environments
- No cold start issues
- TypeScript-first API

### Vercel AI SDK

**Purpose**: AI integration and streaming responses

**Why Vercel AI SDK**:

- Unified interface for multiple AI providers
- Built-in streaming support
- Automatic request/response handling
- Type-safe API
- Edge-compatible
- Zero vendor lock-in (swap providers easily)

**Alternatives Considered**:

- **OpenAI SDK directly**: Vendor lock-in, manual streaming
- **LangChain**: Overcomplex for simple chat use cases
- **Custom implementation**: Reinventing the wheel

---

## Database & Storage

### Neon Postgres

**Purpose**: Serverless PostgreSQL database

**Why Neon**:

- Serverless with autoscaling (no manual provisioning)
- Branch-like database copies (perfect for dev/staging)
- Instant startup (no cold starts)
- Separation of compute and storage
- PostgreSQL-compatible (standard SQL)
- Great developer experience

**Alternatives Considered**:

- **Supabase Postgres**: Great but less serverless-optimized
- **PlanetScale**: MySQL not Postgres, less feature-rich
- **AWS RDS**: Manual management, cold starts
- **MongoDB**: NoSQL not ideal for relational data

**Key Features**:

- Automatic backups
- Point-in-time recovery
- Connection pooling built-in
- WebSocket connections for long-lived queries

### Database Schema (SQL)

**Why SQL over NoSQL**:

- Data is highly relational (users → workspaces → channels → messages)
- Need for complex joins and transactions
- Strong consistency requirements
- ACID guarantees for critical operations
- Better query optimization

---

## Authentication & Authorization

### [Better Auth](https://www.better-auth.com/)

Weevean uses OAuth-only authentication for simplicity and security:

- **GitHub**: Sign in with your GitHub account
- **Google**: Sign in with your Google account

**Purpose**: User authentication and session management

**Why OAuth**:

- No passwords, no email verification, no waiting. Just click and you're in (OAuth Only)
- Row Level Security (RLS) integration
- Session management with refresh tokens
- HTTP-only cookie support

**Alternatives Considered**:

- **NextAuth.js**: Great but more manual setup
- **Auth0**: Expensive, vendor lock-in
- **Clerk**: Opinionated UI, higher cost
- **Custom auth**: Too much security complexity

**Security Features**:

- HTTP-only cookies (XSS protection)
- Automatic token refresh
- CSRF protection

---

## Deployment & Infrastructure

### Vercel

**Purpose**: Hosting and deployment platform

**Why Vercel**:

- Zero-config deployment for Next.js
- Automatic HTTPS and custom domains
- Edge network for global performance
- Preview deployments for every PR
- Built-in analytics
- Serverless functions included
- Created by Next.js team (first-class support)

**Alternatives Considered**:

- **Netlify**: Good but less Next.js-optimized
- **AWS Amplify**: More complex, AWS lock-in
- **Railway**: Simpler but less edge-optimized
- **Self-hosted**: Too much operational overhead

### Environment Variables

**Management**:

- Stored in Vercel dashboard
- Different values per environment (dev/staging/prod)
- Encrypted at rest
- Injected at build and runtime

---

## Development Tools

### Package Management

**pnpm**

- Just too good

**Alternatives**: yarn, npm (both fine choices)

### Code Quality

#### ESLint

- Catch code issues before runtime
- Enforce consistent code style
- TypeScript integration

#### Prettier

- Consistent code formatting
- Auto-format on save
- No bike-shedding on style

---

## AI Integration

### Architecture Overview

Weevean uses the Vercel AI SDK to provide AI-powered features without vendor lock-in. The architecture supports multiple providers and graceful fallbacks.

### AI Provider Strategy

**Default (Cloud Deployment)**:

- Use Vercel AI Gateway for zero-config setup
- Automatic load balancing across providers
- Built-in rate limiting and caching
- No API keys needed from users

**Self-Hosted**:

- Bring your own API keys
- Choose your provider (OpenAI, Anthropic, local models)
- Full control over costs and data

### Cost Control

**Strategies**:

- Rate limiting: 20 requests/user/hour
- Context window limits: max 20 messages (Or chunked based on token weight)
- Model selection: Use GPT-3.5 for simple queries, GPT-4/5 for complex
- Caching: Cache similar queries for 1 hour
- Workspace quotas: Admin-configurable usage limits

### Privacy & Security

**Data Handling**:

- AI receives only necessary context (last 20 messages)
- Zero-data-retention mode enabled for all providers
- No data used for model training

**User Control**:

- Workspace-level AI disable switch
- Per-user opt-out option
- Full audit logs of AI interactions
- Transparent about what AI can see

### Future Enhancements

- **Semantic search**: Vector embeddings for message search
- **Function calling**: AI can create channels, invite users, etc.
- **Image understanding**: Analyze screenshots/diagrams
- **Voice integration**: Transcribe and summarize voice messages
- **Custom fine-tuning**: Train on workspace-specific patterns

---

## Future Considerations

### Real-time Communication

**Current**: HTTP polling for updates. Thinking of Swr at the moment
**Future**: WebSocket upgrade

**Options**:

- **Supabase Realtime**: Built-in, works with RLS
- **Pusher**: Managed WebSockets
- **Socket.io**: Self-hosted, more control
- **Ably**: Enterprise-grade, expensive

**When to upgrade**: When active users > 500

### Code Execution

**Client-side WASM** (planned):

- **Pyodide**: Python in browser
- **QuickJS-WASM**: JavaScript isolation
- **Vercel Sandbox**: Used with AIs but I think we can consider this too (Python)
- Zero security risk (runs in browser sandbox)

### File Storage

**Options** (when needed):

- **Vercel Blob**: Simple, integrated with Vercel
- **Supabase Storage**: Integrated with auth
- **AWS S3**: Industry standard, more setup
- **Cloudinary**: Images with transformations

### Search

**Current**: Basic SQL queries  
**Future**: Advanced search (This would be interesting)

**Options**:

- **We do it ourselves**: More control, easier fine tunning, better privacy.
- **Typesense**: Open source, self-hosted
- **Algolia**: Managed, expensive
- **Meilisearch**: Open source, fast
- **Elasticsearch**: Enterprise, complex

**Trigger**: When messages > 100k

### Analytics

**Options**:

- **Vercel Analytics**: Built-in, basic
- **PostHog**: Open source, full-featured
- **Mixpanel**: Product analytics
- **Plausible**: Privacy-focused

### Monitoring

**When needed** (at scale):

- **Sentry**: Error tracking
- **LogRocket**: Session replay
- **DataDog**: Infrastructure monitoring
- **Vercel Monitoring**: Built-in metrics

---

## Technology Decision Matrix

| Requirement    | Current Solution | Why Chosen                           | Alternatives          |
| -------------- | ---------------- | ------------------------------------ | --------------------- |
| UI Framework   | React 19         | Industry standard, huge ecosystem    | Vue, Svelte           |
| Meta-framework | Next.js 16       | Best React framework, RSC support    | Remix, CRA            |
| Language       | TypeScript       | Type safety, better DX               | JavaScript            |
| Styling        | Tailwind CSS     | Fast development, consistent         | CSS-in-JS             |
| Components     | shadcn/ui        | Customizable, accessible             | Chakra, MUI           |
| Database       | Neon Postgres    | Serverless, autoscaling              | Supabase, PlanetScale |
| Auth           | Better Auth      | Full-featured, secure                | NextAuth.             |
| Hosting        | Vercel           | Zero-config, edge network            | Netlify, Railway      |
| DB Client      | Drizzle ORM      | Headless ORM                         | Neon Driver           |
| AI Integration | Vercel AI SDK    | Multi-provider, streaming, type-safe | OpenAI SDK, LangChain |

---

This tech stack is designed for rapid iteration while maintaining production-quality standards. Choices prioritize developer experience, performance, and scalability, with clear upgrade paths as the application grows.
