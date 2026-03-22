import { LayoutDashboard, Send, Users, BarChart3 } from "lucide-react";
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

export type PromoterView = "overview" | "offers" | "discover";

const navItems: { title: string; value: PromoterView; icon: typeof Send }[] = [
  { title: "overview", value: "overview", icon: LayoutDashboard },
  { title: "offers", value: "offers", icon: Send },
  { title: "discover", value: "discover", icon: Users },
];

interface Props {
  activeView: PromoterView;
  onViewChange: (view: PromoterView) => void;
}

export default function PromoterSidebar({ activeView, onViewChange }: Props) {
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
