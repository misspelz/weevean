"use client";

import AppHeaderPartial from "@/components/shared/app-header-partial";
import { ChatHeader } from "@/components/shared/channels-header";
import { MessageInput } from "@/components/shared/message-input";
import { MessageList } from "@/components/shared/message-list";

const SAMPLE_MESSAGES = [
  {
    id: "1",
    content:
      "Hey team! Just pushed the new authentication flow. Let me know what you think! 🚀",
    createdAt: new Date(Date.now() - 3600000 * 5),
    user: {
      id: "user2",
      displayName: "Sarah Chen",
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    },
    reactions: [
      { emoji: "🚀", count: 3, userReacted: true },
      { emoji: "👍", count: 2, userReacted: false },
    ],
  },
  {
    id: "2",
    content:
      "Looks great! I noticed a small issue with the error handling. Here's what I suggest:\n\n```typescript\ntry {\n  await signIn(credentials);\n} catch (error) {\n  if (error instanceof AuthError) {\n    // Handle specific auth errors\n    return { error: error.message };\n  }\n  throw error;\n}\n```",
    createdAt: new Date(Date.now() - 3600000 * 4),
    user: {
      id: "user3",
      displayName: "Alex Rivera",
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
    },
    reactions: [{ emoji: "💯", count: 1, userReacted: false }],
    replyCount: 2,
  },
  {
    id: "3",
    content: "Good catch! I'll update that now.",
    createdAt: new Date(Date.now() - 3600000 * 3.5),
    user: {
      id: "user2",
      displayName: "Sarah Chen",
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    },
    reactions: [],
  },
  {
    id: "4",
    content:
      "Also, don't forget to add the **rate limiting** middleware before we deploy. We don't want any brute force attacks on the login endpoint.",
    createdAt: new Date(Date.now() - 3600000 * 2),
    user: {
      id: "user4",
      displayName: "Jamie Taylor",
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jamie",
    },
    reactions: [{ emoji: "👀", count: 1, userReacted: true }],
  },
  {
    id: "5",
    content:
      "Already on it! Using `@upstash/ratelimit` with Redis. Super easy to set up:\n\n```typescript\nimport { Ratelimit } from '@upstash/ratelimit';\nimport { Redis } from '@upstash/redis';\n\nconst ratelimit = new Ratelimit({\n  redis: Redis.fromEnv(),\n  limiter: Ratelimit.slidingWindow(5, '1 m'),\n});\n```",
    createdAt: new Date(Date.now() - 3600000),
    user: {
      id: "user2",
      displayName: "Sarah Chen",
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    },
    reactions: [
      { emoji: "🔥", count: 2, userReacted: false },
      { emoji: "🎉", count: 1, userReacted: false },
    ],
  },
  {
    id: "6",
    content:
      "Perfect! @ai can you explain how sliding window rate limiting works compared to fixed window?",
    createdAt: new Date(Date.now() - 1800000),
    user: {
      id: "user1",
      displayName: "You",
    },
    reactions: [],
  },
  {
    id: "7",
    content:
      "Great question! Here's a quick comparison:\n\n**Fixed Window:**\n- Resets at fixed intervals (e.g., every minute)\n- Can allow burst of requests at window boundaries\n- Simpler to implement\n\n**Sliding Window:**\n- Window slides with each request\n- Smoother rate limiting\n- Prevents boundary bursts\n- More memory efficient than token bucket\n\nFor auth endpoints, sliding window is usually preferred because it prevents timing attacks at window boundaries. The implementation Sarah shared is a good choice! 🎯",
    createdAt: new Date(Date.now() - 1500000),
    user: {
      id: "ai",
      displayName: "Weevean AI",
      avatarUrl: "https://api.dicebear.com/7.x/bottts/svg?seed=WeeveanAI",
    },
    reactions: [
      { emoji: "👍", count: 3, userReacted: true },
      { emoji: "🧠", count: 1, userReacted: false },
    ],
  },
  {
    id: "8",
    content:
      "Thanks AI! That makes sense. Let's go with the sliding window approach then.",
    createdAt: new Date(Date.now() - 600000),
    user: {
      id: "user1",
      displayName: "You",
    },
    reactions: [],
  },
];
export default function Home() {
  return (
    <div className="flex h-full flex-col">
      <div className="sticky top-0 z-10">
        <AppHeaderPartial>
          <ChatHeader
            channel={{
              id: "fyf8723N7n87g87B7gnHGDG",
              isPrivate: false,
              name: "Weevean",
              description: "Open source community",
              memberCount: 17,
            }}
          />
        </AppHeaderPartial>
      </div>

      <div className="flex-1 overflow-y-auto min-h-0">
        <MessageList
          messages={SAMPLE_MESSAGES}
          currentUserId={"currentUserId"}
          onReact={() => null}
          onReply={() => null}
        />
      </div>

      <div className="shrink-0">
        <MessageInput placeholder={`Message #Weevean`} onSend={() => null} />
      </div>
    </div>
  );
}
