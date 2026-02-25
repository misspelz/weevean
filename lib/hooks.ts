import { Message } from "@/components/shared/message-list";
import { fetcher } from "@/lib/utils";
import useSWR from "swr";
import { ChannelWithCreator, WorkspaceWithOwner } from "./types";

export function useWorkspaces() {
  const { data, error, isLoading, mutate } = useSWR<WorkspaceWithOwner[]>(
    "/api/workspaces",
    fetcher,
  );

  return {
    workspaces: data,
    isLoading,
    isError: error,
    mutate,
  };
}

export function useChannels(workspaceId?: string) {
  const { data, error, isLoading, mutate } = useSWR<ChannelWithCreator[]>(
    workspaceId ? `/api/workspaces/${workspaceId}/channels` : null,
    fetcher,
  );

  return {
    channels: data,
    isLoading,
    isError: error,
    mutate,
  };
}

export function useMessages(channelId?: string) {
  // Poll every 3 seconds for new messages for now.
  // We'll replace this with WebSockets later.
  const { data, error, isLoading, mutate } = useSWR<Message[]>(
    channelId ? `/api/channels/${channelId}/messages` : null,
    fetcher,
    {
      refreshInterval: 3000,
    },
  );

  return {
    messages: data,
    isLoading,
    isError: error,
    mutate,
  };
}
