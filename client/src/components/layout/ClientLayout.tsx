import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { Bell, Search, Command, User, LogOut, LifeBuoy, HelpCircle, Settings, Home, ShoppingBag, Store, Package, CreditCard, ShoppingCart } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import type { LucideIcon } from "lucide-react";
import { SiWhatsapp } from "react-icons/si";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const mainNavItems: { label: string; href: string; match: string; icon: LucideIcon; subTabs?: { label: string; href: string }[] }[] = [
  { label: "Home", href: "/client/dashboard", match: "/client/dashboard", icon: Home },
  { label: "Products", href: "/client/catalog", match: "/client/catalog", icon: ShoppingBag },
  {
    label: "My Store",
    href: "/client/store/launch-kit",
    match: "/client/store",
    icon: Store,
    subTabs: [
      { label: "Launch Kit", href: "/client/store/launch-kit" },
      { label: "Store Setup", href: "/client/store/setup" },
      { label: "Readiness Checklist", href: "/client/store/checklist" },
      { label: "Preferences", href: "/client/store/preferences" },
    ],
  },
  { label: "Orders", href: "/client/orders", match: "/client/orders", icon: Package },
  {
    label: "Payments",
    href: "/client/payments/history",
    match: "/client/payments",
    icon: CreditCard,
    subTabs: [
      { label: "Payment History", href: "/client/payments/history" },
      { label: "Invoices", href: "/client/payments/invoices" },
    ],
  },
];

const mockNotifications = [
  {
    id: 1,
    title: "Launch Kit Update",
    message: "Your inventory selection has been approved.",
    time: "2 hours ago",
    read: false,
  },
  {
    id: 2,
    title: "Payment Received",
    message: "Token amount of \u20b950,000 confirmed.",
    time: "5 hours ago",
    read: true,
  },
];

interface ClientLayoutProps {
  children: ReactNode;
}

export function ClientLayout({ children }: ClientLayoutProps) {
  const [location, setLocation] = useLocation();
  const { user, logout } = useAuth();
  const hasUnread = mockNotifications.some((n) => !n.read);

  const { data: kitItems } = useQuery<any[]>({
    queryKey: ["/api/kit-items", user?.clientId],
    enabled: !!user?.clientId,
  });
  const kitCount = kitItems?.length || 0;

  const displayName = user?.name || "Partner";
  const displayRole = user?.clientName || "Partner Store";
  const initials = displayName.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);

  const handleLogout = async () => {
    await logout();
    setLocation("/login");
  };

  const activeSection = mainNavItems.find((item) => location.startsWith(item.match));
  const activeSubTabs = activeSection?.subTabs;

  return (
    <div className="flex flex-col h-screen w-full bg-background text-foreground font-sans">
      <header className="bg-card border-b shrink-0" data-testid="header">
        <div className="flex h-20 items-center justify-between px-5">
          <div className="flex items-center gap-6">
            <Link href="/client/dashboard">
              <div className="flex items-center gap-2 cursor-pointer shrink-0" data-testid="link-home">
                <img src="/logo.png" alt="Eazy to Sell" className="h-16 w-auto object-contain" loading="eager" />
              </div>
            </Link>

            <div className="h-6 w-px bg-border hidden md:block" />

            <nav className="hidden md:flex items-center gap-1" data-testid="nav-main">
              {mainNavItems.map((item) => {
                const isActive = location.startsWith(item.match);
                const Icon = item.icon;
                return (
                  <Link key={item.label} href={item.href}>
                    <button
                      className={cn(
                        "flex items-center gap-2 px-3.5 py-2.5 text-sm font-medium rounded-md transition-colors",
                        isActive
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted"
                      )}
                      data-testid={`nav-${item.label.toLowerCase().replace(/\s+/g, "-")}`}
                    >
                      <Icon className="h-4 w-4 text-primary" />
                      {item.label}
                    </button>
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="flex items-center gap-2">
            <button
              className="flex items-center gap-2 px-2.5 py-1.5 bg-card border rounded-lg shadow-sm w-48 lg:w-56 text-left hidden sm:flex"
              data-testid="button-search"
            >
              <Search className="h-4 w-4 text-muted-foreground" />
              <span className="flex-1 text-xs text-muted-foreground font-normal">Search</span>
              <div className="flex items-center gap-0.5">
                <div className="flex items-center justify-center h-4 w-4 bg-muted rounded text-muted-foreground">
                  <Command className="h-2.5 w-2.5" />
                </div>
                <div className="flex items-center justify-center h-4 w-4 bg-muted rounded">
                  <span className="text-[10px] font-semibold text-muted-foreground">K</span>
                </div>
              </div>
            </button>

            <a href="#" target="_blank" rel="noopener noreferrer" data-testid="button-whatsapp-group">
              <Button size="sm" className="bg-[#25D366] text-white border-[#25D366] hover:bg-[#128C7E] h-8 text-xs">
                <SiWhatsapp className="h-3.5 w-3.5 mr-1.5" />
                <span className="hidden sm:inline">Support</span>
              </Button>
            </a>

            <Link href="/client/store/launch-kit">
              <div className="relative cursor-pointer" data-testid="button-cart">
                <div className="flex items-center justify-center h-9 w-9 rounded-full border bg-card hover-elevate transition-colors">
                  <ShoppingCart className="h-[18px] w-[18px] text-primary" />
                </div>
                {kitCount > 0 && (
                  <div className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-[10px] font-bold min-w-[18px] h-[18px] flex items-center justify-center rounded-full ring-2 ring-card px-1" data-testid="text-cart-count">
                    {kitCount}
                  </div>
                )}
              </div>
            </Link>

            <Popover>
              <PopoverTrigger asChild>
                <div className="relative cursor-pointer" data-testid="button-notifications">
                  <div className="flex items-center justify-center h-9 w-9 rounded-full border bg-card hover-elevate transition-colors">
                    <Bell className="h-[18px] w-[18px] text-foreground" />
                  </div>
                  {hasUnread && (
                    <div className="absolute top-0 right-0 h-2 w-2 bg-primary rounded-full ring-2 ring-card" />
                  )}
                </div>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-0 rounded-lg shadow-lg" align="end">
                <div className="flex items-center justify-between gap-2 p-4 border-b">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold">Notifications</h3>
                    <div className="bg-primary text-white text-[10px] font-semibold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                      {mockNotifications.filter((n) => !n.read).length}
                    </div>
                  </div>
                </div>
                <div className="p-3 space-y-2 max-h-64 overflow-y-auto">
                  {mockNotifications.map((notification) => (
                    <div key={notification.id} className="flex gap-2.5 items-start p-2 rounded-md hover:bg-muted transition-colors">
                      <div className="flex items-center justify-center w-7 h-7 rounded-md bg-muted shrink-0">
                        <Bell className="h-3.5 w-3.5 text-muted-foreground" />
                      </div>
                      <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <h4 className="text-xs font-semibold truncate">{notification.title}</h4>
                          {!notification.read && (
                            <div className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                          )}
                        </div>
                        <p className="text-[11px] text-muted-foreground leading-relaxed">{notification.message}</p>
                        <span className="text-[10px] text-muted-foreground/70">{notification.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-3 border-t flex items-center justify-between">
                  <button className="text-xs font-semibold text-primary" data-testid="button-mark-all-read">
                    Mark as all read
                  </button>
                  <Button size="sm" variant="ghost" className="h-7 text-xs">View All</Button>
                </div>
              </PopoverContent>
            </Popover>

            <div className="h-5 w-px bg-border" />

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 outline-none rounded-lg px-1.5 py-1 hover:bg-muted transition-colors" data-testid="button-user-menu">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary text-white text-xs font-medium">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col items-start text-left hidden lg:flex">
                    <span className="text-xs font-semibold leading-tight" data-testid="text-user-name">
                      {displayName}
                    </span>
                    <span className="text-[10px] text-muted-foreground leading-tight" data-testid="text-user-role">
                      {displayRole}
                    </span>
                  </div>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{displayName}</p>
                    <p className="text-xs text-muted-foreground">{user?.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <Link href="/client/profile">
                  <DropdownMenuItem className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    My Profile
                  </DropdownMenuItem>
                </Link>
                <Link href="/client/support">
                  <DropdownMenuItem className="cursor-pointer">
                    <LifeBuoy className="mr-2 h-4 w-4" />
                    Support
                  </DropdownMenuItem>
                </Link>
                <DropdownMenuItem className="cursor-pointer">
                  <HelpCircle className="mr-2 h-4 w-4" />
                  Help Center
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive focus:text-destructive cursor-pointer" onClick={handleLogout} data-testid="button-logout">
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {activeSubTabs && (
          <div className="flex items-center gap-1 px-5 border-t bg-muted/30" data-testid="nav-sub-tabs">
            {activeSubTabs.map((tab) => {
              const isActive = location === tab.href;
              return (
                <Link key={tab.href} href={tab.href}>
                  <button
                    className={cn(
                      "relative px-5 py-3.5 text-sm font-semibold transition-all rounded-t-lg",
                      isActive
                        ? "bg-background text-primary shadow-sm border border-b-0 border-border -mb-px"
                        : "text-muted-foreground hover:text-foreground hover:bg-background/50"
                    )}
                    data-testid={`tab-${tab.label.toLowerCase().replace(/\s+/g, "-")}`}
                  >
                    {tab.label}
                    {isActive && (
                      <div className="absolute bottom-0 left-2 right-2 h-0.5 bg-primary rounded-full" />
                    )}
                  </button>
                </Link>
              );
            })}
          </div>
        )}
      </header>

      <main className="flex-1 overflow-y-auto bg-background">
        <div className="px-6 py-6 space-y-6 animate-in fade-in duration-300">
          {children}
        </div>
      </main>

      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t z-50 px-2 py-1" data-testid="nav-mobile-bottom">
        <div className="flex items-center justify-around">
          {mainNavItems.map((item) => {
            const isActive = location.startsWith(item.match);
            return (
              <Link key={item.label} href={item.href}>
                <button
                  className={cn(
                    "flex flex-col items-center gap-0.5 px-3 py-2 text-[10px] font-medium rounded-md transition-colors",
                    isActive ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  <span className="text-xs">{item.label}</span>
                </button>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
