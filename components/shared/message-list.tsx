"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { format, isToday, isYesterday } from "date-fns";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef } from "react";
import { Response } from "./markdownRenderer";
import { MessageReactions } from "./message-reactions";

interface Reaction {
  emoji: string;
  count: number;
  userReacted: boolean;
}

export interface Message {
  id: string;
  content: string;
  createdAt: Date;
  user: {
    id: string;
    name: string;
    image?: string | null;
  };
  reactions: Reaction[];
  parentId?: string;
  replyCount?: number;
}

interface MessageListProps {
  messages: Message[];
  currentUserId: string;
  onReact: (messageId: string, emoji: string) => void;
  onReply?: (messageId: string) => void;
}

function formatMessageDate(date: Date): string {
  if (isToday(date)) {
    return `Today at ${format(date, "h:mm a")}`;
  }
  if (isYesterday(date)) {
    return `Yesterday at ${format(date, "h:mm a")}`;
  }
  return format(date, "MMM d, yyyy 'at' h:mm a");
}

function shouldShowDateSeparator(
  currentMessage: Message,
  previousMessage?: Message,
): boolean {
  if (!previousMessage) return true;
  const currentDate = new Date(currentMessage.createdAt).toDateString();
  const previousDate = new Date(previousMessage.createdAt).toDateString();
  return currentDate !== previousDate;
}

function shouldGroupWithPrevious(
  currentMessage: Message,
  previousMessage?: Message,
): boolean {
  if (!previousMessage) return false;
  if (currentMessage.user.id !== previousMessage.user.id) return false;

  const timeDiff =
    new Date(currentMessage.createdAt).getTime() -
    new Date(previousMessage.createdAt).getTime();
  return timeDiff < 5 * 60 * 1000; // 5 minutes
}

function DateSeparator({ date }: { date: Date }) {
  const label = isToday(date)
    ? "Today"
    : isYesterday(date)
      ? "Yesterday"
      : format(date, "MMMM d, yyyy");

  return (
    <div className="relative my-6 flex items-center justify-center">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-border" />
      </div>
      <motion.span
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative rounded-full bg-card px-3 py-1 text-xs font-medium text-muted-foreground"
      >
        {label}
      </motion.span>
    </div>
  );
}

export function MessageList({
  messages,
  currentUserId,
  onReact,
  onReply,
}: MessageListProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  return (
    <ScrollArea className="h-full" ref={scrollRef}>
      <div className="flex flex-col gap-0.5 px-4 py-4">
        <AnimatePresence initial={false}>
          {messages.map((message, index) => {
            const previousMessage = messages[index - 1];
            const showDateSeparator = shouldShowDateSeparator(
              message,
              previousMessage,
            );
            const isGrouped = shouldGroupWithPrevious(message, previousMessage);
            const isOwn = message.user?.id === currentUserId;

            return (
              <div key={message.id}>
                {showDateSeparator && (
                  <DateSeparator date={new Date(message.createdAt)} />
                )}

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className={cn(
                    "group relative flex gap-3 rounded-lg px-2 py-1 transition-colors hover:bg-secondary/50",
                    isGrouped && "mt-0.5",
                  )}
                >
                  <div className="w-10 shrink-0">
                    {!isGrouped && (
                      <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.1 }}
                      >
                        <Avatar className="h-10 w-10">
                          <AvatarImage
                            src={message.user.image || "/placeholder.svg"}
                            alt={message.user.name}
                          />
                          <AvatarFallback className="bg-primary/20 text-primary">
                            {message.user.name.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                      </motion.div>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    {!isGrouped && (
                      <div className="mb-1 flex items-baseline gap-2">
                        <span
                          className={cn(
                            "font-semibold",
                            isOwn ? "text-primary" : "text-foreground",
                          )}
                        >
                          {message.user.name}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {formatMessageDate(new Date(message.createdAt))}
                        </span>
                      </div>
                    )}

                    <div className="text-sm text-foreground/90">
                      <Response>{message.content}</Response>
                    </div>

                    {message.reactions.length > 0 && (
                      <MessageReactions
                        reactions={message.reactions}
                        onReact={(emoji) => onReact(message.id, emoji)}
                      />
                    )}

                    {(message.replyCount ?? 0) > 0 && (
                      <button
                        onClick={() => onReply?.(message.id)}
                        className="mt-2 flex items-center gap-1 text-xs text-primary hover:underline"
                      >
                        <span>
                          {message.replyCount}{" "}
                          {message.replyCount === 1 ? "reply" : "replies"}
                        </span>
                      </button>
                    )}
                  </div>

                  <div className="absolute -top-3 right-2 hidden items-center gap-1 rounded-lg border border-border bg-card p-1 shadow-lg group-hover:flex">
                    <MessageReactions
                      reactions={[]}
                      onReact={(emoji) => onReact(message.id, emoji)}
                      showQuickPicker
                    />
                  </div>
                </motion.div>
              </div>
            );
          })}
        </AnimatePresence>

        {/* Scroll anchor */}
        <div ref={bottomRef} />
      </div>
    </ScrollArea>
  );
}
