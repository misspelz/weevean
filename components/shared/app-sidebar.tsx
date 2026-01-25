import { Sidebar, SidebarContent, SidebarRail } from "@/components/ui/sidebar";
import AppHeader from "./app-header";
import { NavChannels } from "./nav-channels";
import { NavDms } from "./nav-dms";
import { NavFooter } from "./nav-footer";

const AppSideBar = () => {
  return (
    <>
      <Sidebar collapsible="icon">
        <AppHeader />
        <SidebarContent>
          <NavChannels />
          <NavDms />
        </SidebarContent>
        <NavFooter />
        <SidebarRail />
      </Sidebar>
    </>
  );
};

export default AppSideBar;
