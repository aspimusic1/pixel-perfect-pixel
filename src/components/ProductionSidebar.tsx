import { LayoutDashboard, Wrench, Users, Calendar, FileText } from "lucide-react";
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

export type ProductionView = "overview" | "gigs" | "crew" | "calendar" | "documents";

const navItems: { title: string; value: ProductionView; icon: typeof Wrench }[] = [
  { title: "overview", value: "overview", icon: LayoutDashboard },
  { title: "gigs", value: "gigs", icon: Wrench },
  { title: "crew", value: "crew", icon: Users },
  { title: "calendar", value: "calendar", icon: Calendar },
  { title: "documents", value: "documents", icon: FileText },
];

interface Props {
  activeView: ProductionView;
  onViewChange: (view: ProductionView) => void;
}

export default function ProductionSidebar({ activeView, onViewChange }: Props) {
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
