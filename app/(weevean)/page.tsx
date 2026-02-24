"use client";

import AppHeaderPartial from "@/components/shared/app-header-partial";
import { ChatHeader } from "@/components/shared/channels-header";
import { MessageInput } from "@/components/shared/message-input";
import { MessageList } from "@/components/shared/message-list";
import { useSession } from "@/lib/auth-client";
import { useChannels, useMessages } from "@/lib/hooks";
import { fetcher } from "@/lib/utils";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

export default function Home() {
  const searchParams = useSearchParams();
  const channelId = searchParams.get("channel");
  const workspaceId = searchParams.get("workspace");

  const {
    messages,
    isLoading: isLoadingMessages,
    mutate,
  } = useMessages(channelId || undefined);
  const { channels } = useChannels(workspaceId || undefined);

  const { data: session } = useSession();

  const [messageDraft, setMessageDraft] = useState("");

  useEffect(() => {
    setMessageDraft("");
  }, [channelId]);

  const activeChannel = useMemo(() => {
    return channels?.find((c) => c.id === channelId);
  }, [channels, channelId]);

  const handleSend = async (content: string) => {
    if (!channelId || !messages || !session?.user) return;

    const optimisticMessage = {
      id: "optimistic-" + Date.now(),
      content,
      createdAt: new Date(),
      user: {
        id: session.user.id,
        name: session.user.name,
        image: session.user.image,
      },
      reactions: [],
      replyCount: 0,
    };

    setMessageDraft("");

    try {
      await mutate(
        async () => {
          const newMessage = await fetcher<typeof optimisticMessage>(
            `/api/channels/${channelId}/messages`,
            {
              method: "POST",
              body: JSON.stringify({ content }),
            },
            "Failed to send message",
          );
          return [newMessage, ...messages];
        },
        {
          optimisticData: [optimisticMessage, ...messages],
          rollbackOnError: true,
          revalidate: false,
        },
      );
    } catch (error) {
      console.error("Failed to send message", error);
      setMessageDraft(content);
    }
  };

  if (!channelId) {
    return (
      <div className="flex h-full items-center justify-center text-muted-foreground">
        Select a channel to start chatting
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <div className="sticky top-0 z-10">
        <AppHeaderPartial>
          <ChatHeader
            channel={{
              id: activeChannel?.id || channelId,
              isPrivate: activeChannel?.type === "private",
              name: activeChannel?.name || "Channel",
              description: activeChannel?.description || "",
              memberCount: 0, // TODO: fetch member count
            }}
          />
        </AppHeaderPartial>
      </div>

      <div className="flex-1 overflow-y-auto min-h-0">
        {isLoadingMessages ? (
          <div className="flex h-full items-center justify-center">
            Loading messages...
          </div>
        ) : (
          <MessageList
            messages={isLoadingMessages ? [] : [...(messages || [])].reverse()}
            currentUserId={session?.user?.id || ""}
            onReact={() => null}
            onReply={() => null}
          />
        )}
      </div>

      <div className="shrink-0">
        <MessageInput
          value={messageDraft}
          onChange={setMessageDraft}
          placeholder={`Message #${activeChannel?.name || "channel"}`}
          onSend={handleSend}
        />
      </div>
    </div>
  );
}
