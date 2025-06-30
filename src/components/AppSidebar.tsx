
import { Package, CreditCard, Quote, ShieldCheck, FileText, BarChart3 } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar";

interface AppSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const menuItems = [
  { id: "inventory", title: "Inventory Management", icon: Package },
  { id: "spei", title: "SPEI Validation", icon: CreditCard },
  { id: "quotes", title: "Quote Generator", icon: Quote },
  { id: "validation", title: "Admin Validation", icon: ShieldCheck },
  { id: "audit", title: "Audit Logs", icon: FileText },
];

export function AppSidebar({ activeTab, setActiveTab }: AppSidebarProps) {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <Sidebar className="border-r">
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-6 w-6 text-primary" />
          {!isCollapsed && (
            <span className="font-semibold text-lg">Admin Dashboard</span>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Management</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    onClick={() => setActiveTab(item.id)}
                    isActive={activeTab === item.id}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.title}</span>
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
