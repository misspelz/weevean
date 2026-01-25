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
} from "@/components/ui/sidebar";
import { getUserInitials } from "@/lib/utils";
import { ChevronRight, MessagesSquareIcon, MoreHorizontal } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

const dms = [
  {
    name: "Lucius Emmanuel",
    url: "/",
  },
  {
    name: "Alex Harmozi",
    url: "/",
  },
  {
    name: "Elon Musk",
    url: "/",
  },
  {
    name: "Linus Torvalds",
    url: "/",
  },
];
export const NavDms = () => {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Direct DMs</SidebarGroupLabel>
      <SidebarMenu>
        <Collapsible asChild defaultOpen={true} className="group/collapsible">
          <SidebarMenuItem>
            <CollapsibleTrigger asChild>
              <SidebarMenuButton tooltip={"DMs"}>
                <MessagesSquareIcon />
                <span>DMs</span>
                <ChevronRight className="ml-auto transition-transform duration-300 group-data-[state=open]/collapsible:rotate-90" />
              </SidebarMenuButton>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <SidebarMenuSub>
                {dms.map((dm) => (
                  <SidebarMenu key={dm.name}>
                    <SidebarMenuSubButton asChild>
                      <a className="flex gap-1 items-center" href={dm.url}>
                        <Avatar size="sm">
                          <AvatarImage src="" />
                          <AvatarFallback>
                            {getUserInitials(dm.name)}
                          </AvatarFallback>
                        </Avatar>
                        <span>{dm.name}</span>
                      </a>
                    </SidebarMenuSubButton>
                  </SidebarMenu>
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
