"use client";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/animate-ui/primitives/radix/collapsible";
import { CreateChannelModal } from "@/components/modals/create-channel-modal";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { useChannels } from "@/lib/hooks";
import {
  ChevronRight,
  Hash,
  Lock,
  MoreHorizontal,
  PlusIcon,
  Users2Icon,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { Button } from "../ui/button";

export const NavChannels = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const workspaceId = searchParams.get("workspace");
  const channelId = searchParams.get("channel");

  const { channels, isLoading } = useChannels(workspaceId || undefined);

  useEffect(() => {
    if (channels && channels.length > 0 && !channelId) {
      if (workspaceId) {
        const defaultChannel =
          channels.find((c) => c.name === "general") || channels[0];
        const params = new URLSearchParams(searchParams.toString());
        params.set("channel", defaultChannel.id);
        router.replace(`?${params.toString()}`);
      }
    }
  }, [channels, channelId, workspaceId, router, searchParams]);

  if (!workspaceId) return null;

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Channels</SidebarGroupLabel>
      <SidebarMenu>
        <Collapsible asChild defaultOpen={true} className="group/collapsible">
          <SidebarMenuItem>
            <CollapsibleTrigger asChild>
              <SidebarMenuButton tooltip={"Channels"}>
                <Users2Icon />
                <div className="flex items-center gap-2 justify-between w-full">
                  <span>Channels</span>
                  <CreateChannelModal>
                    <Button
                      asChild
                      className="hover:text-foreground bg-none rounded-full"
                      variant={"ghost"}
                      size={"icon"}
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                    >
                      <PlusIcon className="w-3 h-3" />
                    </Button>
                  </CreateChannelModal>
                </div>
                <ChevronRight className="ml-auto transition-transform duration-300 group-data-[state=open]/collapsible:rotate-90" />
              </SidebarMenuButton>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <SidebarMenuSub>
                {isLoading ? (
                  <div className="px-4 py-2 text-xs text-muted-foreground">
                    Loading...
                  </div>
                ) : (
                  channels?.map((channel) => (
                    <SidebarMenuSubItem key={channel.id}>
                      <SidebarMenuSubButton
                        asChild
                        isActive={channelId === channel.id}
                      >
                        <button
                          onClick={() => {
                            const params = new URLSearchParams(
                              searchParams.toString(),
                            );
                            params.set("channel", channel.id);
                            router.push(`?${params.toString()}`);
                          }}
                          className="flex items-center gap-2"
                        >
                          {channel.type === "private" ? (
                            <Lock className="w-3 h-3" />
                          ) : (
                            <Hash className="w-3 h-3" />
                          )}
                          <span>{channel.name}</span>
                        </button>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ))
                )}
              </SidebarMenuSub>
            </CollapsibleContent>
          </SidebarMenuItem>
        </Collapsible>
        <SidebarMenuItem>
          <SidebarMenuButton className="text-sidebar-foreground/70">
            <MoreHorizontal className="text-sidebar-foreground/70" />
            <span>More</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  );
};
