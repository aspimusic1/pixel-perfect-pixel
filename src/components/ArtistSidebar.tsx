import { Inbox, BarChart3, Calendar, Bot, LayoutDashboard } from "lucide-react";
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

export type ArtistView = "overview" | "offers" | "calendar" | "bookkeeping" | "agent";

const navItems: { title: string; value: ArtistView; icon: typeof Inbox }[] = [
  { title: "overview", value: "overview", icon: LayoutDashboard },
  { title: "offers", value: "offers", icon: Inbox },
  { title: "calendar", value: "calendar", icon: Calendar },
  { title: "bookkeeping", value: "bookkeeping", icon: BarChart3 },
  { title: "ai agent", value: "agent", icon: Bot },
];

interface Props {
  activeView: ArtistView;
  onViewChange: (view: ArtistView) => void;
}

export default function ArtistSidebar({ activeView, onViewChange }: Props) {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

  return (
    <Sidebar collapsible="icon" className="border-r border-border bg-sidebar">
      <SidebarContent className="pt-20">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.value}>
                  <SidebarMenuButton
                    onClick={() => onViewChange(item.value)}
                    isActive={activeView === item.value}
                    className="cursor-pointer"
                  >
                    <item.icon className="w-4 h-4 shrink-0" />
                    {!collapsed && <span className="lowercase">{item.title}</span>}
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
