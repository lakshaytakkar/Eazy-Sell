import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
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
  ClipboardList
} from "lucide-react";

const clientNavGroups = [
  {
    label: "STORE MANAGEMENT",
    items: [
      { label: "Dashboard", href: "/client/dashboard", icon: LayoutDashboard },
      { label: "Product Catalog", href: "/client/catalog", icon: ShoppingBag },
      { label: "My Launch Kit", href: "/client/launch-kit", icon: Package },
      { label: "My Store", href: "/client/store", icon: Store },
    ],
  },
  {
    label: "FINANCE",
    items: [
      { label: "Payments", href: "/client/payments", icon: CreditCard },
      { label: "Invoices", href: "/client/invoices", icon: FileText },
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
    ],
  },
];

const bottomItems = [
  { label: "Settings", href: "#", icon: Settings },
  { label: "Help Center", href: "#", icon: HelpCircle },
];

export function AppSidebar({ userType }: { userType: 'admin' | 'client' }) {
  const [location] = useLocation();
  const { toggleSidebar } = useSidebar();

  const isActive = (href: string) => {
    return location === href;
  };

  const navGroups = userType === 'admin' ? adminNavGroups : clientNavGroups;

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="h-20 flex flex-row items-center justify-between px-5 border-b border-sidebar-border">
        <Link href={userType === 'client' ? '/client/dashboard' : '/admin/dashboard'}>
          <div className="flex items-center gap-3 cursor-pointer" data-testid="link-home">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary shrink-0">
              <span className="text-white font-bold text-sm">ETS</span>
            </div>
            <span className="text-foreground text-[15px] font-semibold tracking-tight leading-none group-data-[collapsible=icon]:hidden">
              Eazy to Sell
            </span>
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
            <Link href="/login">
                <SidebarMenuButton
                className="h-9 text-[14px] font-medium text-destructive hover:text-destructive hover:bg-destructive/10 rounded-md"
                >
                <LogOut className="h-[18px] w-[18px]" />
                <span>Logout</span>
                </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
