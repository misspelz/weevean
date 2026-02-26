"use client";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/animate-ui/primitives/radix/collapsible";
import { NewDMModalWrapper } from "@/components/modals/new-dm-modal";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
} from "@/components/ui/sidebar";
import { useSession } from "@/lib/auth-client";
import { useDMs } from "@/lib/hooks";
import { getUserInitials } from "@/lib/utils";
import {
  ChevronRight,
  MessagesSquareIcon,
  MoreHorizontal,
  PlusIcon,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";

const NavDmsInner = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const workspaceId = searchParams.get("workspace");
  const dmId = searchParams.get("dm");
  const { data: session } = useSession();

  const { dms, isLoading } = useDMs();

  if (!workspaceId) return null;

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Direct Messages</SidebarGroupLabel>
      <SidebarMenu>
        <Collapsible asChild defaultOpen={true} className="group/collapsible">
          <SidebarMenuItem>
            <CollapsibleTrigger asChild>
              <SidebarMenuButton tooltip={"Direct Messages"}>
                <MessagesSquareIcon />
                <div className="flex items-center gap-2 justify-between w-full">
                  <span>Direct Messages</span>
                  <NewDMModalWrapper>
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
                  </NewDMModalWrapper>
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
                  dms?.map((dm) => {
                    const isParticipant1 =
                      dm.participant1Id === session?.user?.id;
                    const otherUser = isParticipant1
                      ? dm.participant2
                      : dm.participant1;

                    return (
                      <SidebarMenu key={dm.id}>
                        <SidebarMenuSubButton asChild isActive={dmId === dm.id}>
                          <button
                            onClick={() => {
                              const params = new URLSearchParams(
                                searchParams.toString(),
                              );
                              params.set("dm", dm.id);
                              params.delete("channel"); // Drop channel view
                              router.push(`?${params.toString()}`);
                            }}
                            className="flex items-center gap-2"
                          >
                            <Avatar size="sm">
                              <AvatarImage
                                src={otherUser?.image || undefined}
                                referrerPolicy="no-referrer"
                              />
                              <AvatarFallback>
                                {getUserInitials(otherUser?.name || "User")}
                              </AvatarFallback>
                            </Avatar>
                            <span>{otherUser?.name || "Unknown"}</span>
                          </button>
                        </SidebarMenuSubButton>
                      </SidebarMenu>
                    );
                  })
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

export const NavDms = () => {
  return (
    <Suspense fallback={null}>
      <NavDmsInner />
    </Suspense>
  );
};
