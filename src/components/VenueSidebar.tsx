import { LayoutDashboard, MapPin, Image, CalendarDays, Save } from "lucide-react";
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

export type VenueView = "overview" | "details" | "photos" | "availability";

const navItems: { title: string; value: VenueView; icon: typeof MapPin }[] = [
  { title: "overview", value: "overview", icon: LayoutDashboard },
  { title: "details", value: "details", icon: MapPin },
  { title: "photos", value: "photos", icon: Image },
  { title: "availability", value: "availability", icon: CalendarDays },
];

interface Props {
  activeView: VenueView;
  onViewChange: (view: VenueView) => void;
}

export default function VenueSidebar({ activeView, onViewChange }: Props) {
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
