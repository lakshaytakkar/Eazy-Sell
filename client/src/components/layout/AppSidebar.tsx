import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Store,
  CreditCard,
  Users,
  Settings,
  HelpCircle,
  LogOut,
  ChevronLeft,
  FileText,
  ClipboardList,
  ClipboardCheck,
  MessageSquare,
  IndianRupee,
  LifeBuoy,
  UserCircle,
  Truck,
} from "lucide-react";

const clientNavGroups = [
  {
    label: "STORE MANAGEMENT",
    items: [
      { label: "Dashboard", href: "/client/dashboard", icon: LayoutDashboard },
      { label: "Product Catalog", href: "/client/catalog", icon: ShoppingBag },
      { label: "My Launch Kit", href: "/client/launch-kit", icon: Package },
      { label: "My Store", href: "/client/store", icon: Store },
      { label: "Readiness Checklist", href: "/client/checklist", icon: ClipboardCheck },
      { label: "Order Tracking", href: "/client/orders", icon: Truck },
    ],
  },
  {
    label: "FINANCE",
    items: [
      { label: "Payments", href: "/client/payments", icon: CreditCard },
      { label: "Invoices", href: "/client/invoices", icon: FileText },
    ],
  },
  {
    label: "ACCOUNT",
    items: [
      { label: "My Profile", href: "/client/profile", icon: UserCircle },
      { label: "Support", href: "/client/support", icon: LifeBuoy },
    ],
  },
];

const adminNavGroups = [
  {
    label: "OVERVIEW",
    items: [
      { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
      { label: "Clients", href: "/admin/clients", icon: Users },
    ],
  },
  {
    label: "OPERATIONS",
    items: [
      { label: "Inventory", href: "/admin/products", icon: ShoppingBag },
      { label: "Kit Reviews", href: "/admin/reviews", icon: ClipboardList },
      { label: "Templates", href: "/admin/templates", icon: MessageSquare },
    ],
  },
  {
    label: "FINANCE",
    items: [
      { label: "Payments", href: "/admin/payments", icon: IndianRupee },
    ],
  },
];

const bottomItems = [
  { label: "Settings", href: "/admin/settings", icon: Settings },
  { label: "Help Center", href: "#", icon: HelpCircle },
];

export function AppSidebar({ userType }: { userType: 'admin' | 'client' }) {
  const [location, setLocation] = useLocation();
  const { toggleSidebar } = useSidebar();
  const { logout } = useAuth();

  const isActive = (href: string) => {
    return location === href;
  };

  const navGroups = userType === 'admin' ? adminNavGroups : clientNavGroups;

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="h-20 flex flex-row items-center justify-between px-5 border-b border-sidebar-border">
        <Link href={userType === 'client' ? '/client/dashboard' : '/admin/dashboard'}>
          <div className="flex items-center gap-2 cursor-pointer" data-testid="link-home">
            <img src="/logo.png" alt="Eazy to Sell" className="h-9 w-auto object-contain shrink-0" loading="eager" />
          </div>
        </Link>
        <button
          onClick={toggleSidebar}
          className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-muted transition-colors group-data-[collapsible=icon]:hidden"
          data-testid="button-sidebar-collapse"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
      </SidebarHeader>

      <SidebarContent className="py-2 px-3">
        {navGroups.map((group, i) => (
          <SidebarGroup key={i} className="py-2">
            <SidebarGroupLabel className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground px-2 mb-1">
              {group.label}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  const active = isActive(item.href);
                  return (
                    <SidebarMenuItem key={item.label}>
                      <SidebarMenuButton
                        asChild
                        isActive={active}
                        className={cn(
                          "h-9 text-[14px] font-medium rounded-md transition-all",
                          active && "bg-primary text-white hover:bg-primary hover:text-white"
                        )}
                      >
                        <Link href={item.href}>
                          <item.icon className="h-[18px] w-[18px]" />
                          <span>{item.label}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border py-2 px-3">
        <SidebarMenu>
          {bottomItems.map((item) => (
            <SidebarMenuItem key={item.label}>
              <SidebarMenuButton
                className="h-9 text-[14px] font-medium rounded-md"
              >
                <item.icon className="h-[18px] w-[18px]" />
                <span>{item.label}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
          <SidebarMenuItem>
              <SidebarMenuButton
                className="h-9 text-[14px] font-medium text-destructive hover:text-destructive hover:bg-destructive/10 rounded-md cursor-pointer"
                onClick={async () => { await logout(); setLocation("/login"); }}
                data-testid="button-sidebar-logout"
              >
                <LogOut className="h-[18px] w-[18px]" />
                <span>Logout</span>
              </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
