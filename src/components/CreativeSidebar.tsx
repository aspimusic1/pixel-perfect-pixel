import { LayoutDashboard, Camera, FolderOpen, Calendar, Star } from "lucide-react";
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

export type CreativeView = "overview" | "portfolio" | "bookings" | "calendar" | "reviews";

const navItems: { title: string; value: CreativeView; icon: typeof Camera }[] = [
  { title: "overview", value: "overview", icon: LayoutDashboard },
  { title: "portfolio", value: "portfolio", icon: FolderOpen },
  { title: "bookings", value: "bookings", icon: Camera },
  { title: "calendar", value: "calendar", icon: Calendar },
  { title: "reviews", value: "reviews", icon: Star },
];

interface Props {
  activeView: CreativeView;
  onViewChange: (view: CreativeView) => void;
}

export default function CreativeSidebar({ activeView, onViewChange }: Props) {
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
