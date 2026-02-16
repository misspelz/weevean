import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/animate-ui/primitives/radix/collapsible";
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
import {
  ChevronRight,
  MoreHorizontal,
  PlusIcon,
  Users2Icon,
} from "lucide-react";
import { Button } from "../ui/button";

const channels = [
  {
    title: "General",
    url: "/",
  },
  {
    title: "Announcements",
    url: "/",
  },
  {
    title: "Open Source",
    url: "/",
  },
  {
    title: "Chit Chat",
    url: "/",
  },
  {
    title: "Serious Biz",
    url: "/",
  },
  {
    title: "Promotions",
    url: "/",
  },
];
export const NavChannels = () => {
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
                  <Button
                    className="hover:text-foreground bg-none rounded-full"
                    variant={"ghost"}
                    size={"icon"}
                  >
                    <PlusIcon className="w-3 h-3" />
                  </Button>
                </div>
                <ChevronRight className="ml-auto transition-transform duration-300 group-data-[state=open]/collapsible:rotate-90" />
              </SidebarMenuButton>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <SidebarMenuSub>
                {channels.map((channel) => (
                  <SidebarMenuSubItem key={channel.title}>
                    <SidebarMenuSubButton asChild>
                      <a href={channel.url}>
                        <span>{channel.title}</span>
                      </a>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                ))}
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
