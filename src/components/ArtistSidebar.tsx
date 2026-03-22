import { Inbox, BarChart3, Calendar, Bot, LayoutDashboard, Settings } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const navItems = [
  { title: "overview", url: "/dashboard", icon: LayoutDashboard },
  { title: "offers", url: "/dashboard/offers", icon: Inbox },
  { title: "calendar", url: "/dashboard/calendar", icon: Calendar },
  { title: "bookkeeping", url: "/dashboard/bookkeeping", icon: BarChart3 },
  { title: "ai agent", url: "/dashboard/agent", icon: Bot },
];

export default function ArtistSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

  return (
    <Sidebar collapsible="icon" className="border-r border-border bg-sidebar">
      <SidebarContent className="pt-20">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors text-sm"
                      activeClassName="bg-accent text-foreground font-medium"
                    >
                      <item.icon className="w-4 h-4 shrink-0" />
                      {!collapsed && <span className="lowercase">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
