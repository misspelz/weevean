"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/animate-ui/components/radix/dropdown-menu";
import { CreateWorkspaceModal } from "@/components/modals/create-workspace-modal";
import { InviteModalWrapper } from "@/components/modals/invite-modal";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { useWorkspaces } from "@/lib/hooks";
import { ChevronsUpDown, Plus, RocketIcon, UserPlus } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo } from "react";

const AppHeader = () => {
  const isMobile = useIsMobile();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { workspaces, isLoading } = useWorkspaces();

  const workspaceId = searchParams.get("workspace");

  const activeTeam = useMemo(() => {
    if (!workspaces || workspaces.length === 0) return null;
    return workspaces.find((w) => w.id === workspaceId) || workspaces[0];
  }, [workspaces, workspaceId]);

  useEffect(() => {
    if (workspaces && workspaces.length > 0 && !workspaceId) {
      const defaultWorkspace = workspaces[0];
      const params = new URLSearchParams(searchParams.toString());
      params.set("workspace", defaultWorkspace.id);
      router.replace(`?${params.toString()}`);
    }
  }, [workspaces, workspaceId, router, searchParams]);

  if (isLoading)
    return <div className="p-4 text-sm text-muted-foreground">Loading...</div>;
  if (!activeTeam)
    return (
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <CreateWorkspaceModal>
              <SidebarMenuButton>
                <Plus className="size-4" />
                <span>Create Workspace</span>
              </SidebarMenuButton>
            </CreateWorkspaceModal>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
    );

  return (
    <SidebarHeader>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  {activeTeam.iconUrl ? (
                    <Avatar className="size-8 rounded-lg">
                      <AvatarImage src={activeTeam.iconUrl} />
                      <AvatarFallback>
                        {activeTeam.name.substring(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                  ) : (
                    <RocketIcon className="size-4" />
                  )}
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">
                    {activeTeam.name}
                  </span>
                  <span className="truncate text-xs">{"Free"}</span>
                </div>
                <ChevronsUpDown className="ml-auto" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
              align="start"
              side={isMobile ? "bottom" : "right"}
              sideOffset={4}
            >
              <DropdownMenuLabel className="text-xs text-muted-foreground">
                Workspaces
              </DropdownMenuLabel>
              {workspaces?.map((team) => (
                <DropdownMenuItem
                  key={team.id}
                  onClick={() => {
                    const params = new URLSearchParams(searchParams.toString());
                    params.set("workspace", team.id);
                    params.delete("channel");
                    router.push(`?${params.toString()}`);
                  }}
                  className="gap-2 p-2"
                >
                  <div className="flex size-6 items-center justify-center rounded-sm border">
                    {team.iconUrl ? (
                      <Avatar className="size-6 rounded-sm">
                        <AvatarImage src={team.iconUrl} />
                        <AvatarFallback>
                          {team.name.substring(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                    ) : (
                      <RocketIcon className="size-4 shrink-0" />
                    )}
                  </div>
                  {team.name}
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <CreateWorkspaceModal>
                <DropdownMenuItem
                  className="gap-2 p-2"
                  onSelect={(e) => e.preventDefault()} // Prevent closing dropdown immediately
                >
                  <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                    <Plus className="size-4" />
                  </div>
                  <div className="font-medium text-muted-foreground">
                    Add Workspace
                  </div>
                </DropdownMenuItem>
              </CreateWorkspaceModal>

              <DropdownMenuSeparator />
              <InviteModalWrapper
                workspaceId={activeTeam.id}
                workspaceName={activeTeam.name}
              >
                <DropdownMenuItem
                  className="gap-2 p-2"
                  onSelect={(e) => e.preventDefault()} // Keep open to show modal
                >
                  <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                    <UserPlus className="size-4" />
                  </div>
                  <div className="font-medium text-muted-foreground">
                    Invite to {activeTeam.name}
                  </div>
                </DropdownMenuItem>
              </InviteModalWrapper>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarHeader>
  );
};

export default function AppHeaderWrapper() {
  return (
    <Suspense fallback={null}>
      <AppHeader />
    </Suspense>
  );
}
