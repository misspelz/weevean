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
import { ChevronRight, MoreHorizontal, Users2Icon } from "lucide-react";

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
                <span>Channels</span>
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
