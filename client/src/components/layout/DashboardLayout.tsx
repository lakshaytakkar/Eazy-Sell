import { ReactNode, useState } from "react";
import { Link, useLocation } from "wouter";
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Package, 
  Store, 
  CreditCard, 
  Users, 
  Settings, 
  LogOut, 
  Menu,
  ChevronRight,
  ClipboardList,
  Search,
  Bell,
  PanelLeftClose,
  PanelLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

type UserType = 'admin' | 'client';

interface DashboardLayoutProps {
  children: ReactNode;
  userType: UserType;
}

export function DashboardLayout({ children, userType }: DashboardLayoutProps) {
  const [location] = useLocation();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const isActive = (path: string) => location === path;

  const clientLinks = [
    { href: '/client/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/client/catalog', label: 'Product Catalog', icon: ShoppingBag },
    { href: '/client/launch-kit', label: 'My Launch Kit', icon: Package },
    { href: '/client/store', label: 'My Store', icon: Store },
    { href: '/client/payments', label: 'Payments', icon: CreditCard },
  ];

  const adminLinks = [
    { href: '/admin/dashboard', label: 'Overview', icon: LayoutDashboard },
    { href: '/admin/clients', label: 'Clients', icon: Users },
    { href: '/admin/products', label: 'Inventory', icon: ShoppingBag },
    { href: '/admin/reviews', label: 'Reviews', icon: ClipboardList },
    { href: '/admin/settings', label: 'Settings', icon: Settings },
  ];

  const links = userType === 'admin' ? adminLinks : clientLinks;

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-card border-r border-border text-card-foreground">
      <div className={cn("h-16 flex items-center px-4 border-b border-border/50 transition-all duration-300", sidebarCollapsed ? "justify-center" : "justify-between")}>
         {!sidebarCollapsed ? (
             <div className="flex items-center gap-2">
                <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-bold font-display text-xl">
                    E
                </div>
                <span className="font-display font-bold text-lg tracking-tight">
                    {userType === 'admin' ? 'Admin' : 'Partner'}
                </span>
             </div>
         ) : (
            <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-bold font-display text-xl">
                E
            </div>
         )}
      </div>

      <div className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
        {links.map((link) => {
          const Icon = link.icon;
          const active = isActive(link.href);
          
          return (
            <Link key={link.href} href={link.href}>
              <a className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group relative",
                active 
                  ? "bg-primary/10 text-primary-foreground font-semibold" 
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
                sidebarCollapsed && "justify-center px-2"
              )}>
                <Icon className={cn("h-5 w-5 transition-colors", active ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground")} />
                {!sidebarCollapsed && <span>{link.label}</span>}
                
                {/* Active Indicator Line */}
                {active && !sidebarCollapsed && (
                    <div className="absolute left-0 top-2 bottom-2 w-1 bg-primary rounded-r-full" />
                )}
              </a>
            </Link>
          );
        })}
      </div>

      <div className="p-4 border-t border-border/50 space-y-4">
        {!sidebarCollapsed && (
            <div className="p-3 bg-muted/30 rounded-lg border border-border/50 flex items-center gap-3">
                 <Avatar className="h-9 w-9 border-2 border-background shadow-sm">
                    <AvatarFallback className="bg-primary/20 text-primary font-bold text-xs">
                    {userType === 'admin' ? 'AD' : 'RS'}
                    </AvatarFallback>
                </Avatar>
                <div className="overflow-hidden">
                    <p className="text-sm font-medium truncate leading-none mb-1">
                        {userType === 'admin' ? 'Admin User' : 'Rahul Sharma'}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                        {userType === 'admin' ? 'admin@eazy.com' : 'Jaipur Store'}
                    </p>
                </div>
            </div>
        )}

        <Link href="/login">
          <Button variant="ghost" className={cn("w-full text-muted-foreground hover:text-destructive hover:bg-destructive/10", sidebarCollapsed ? "justify-center px-0" : "justify-start")} size="sm">
            <LogOut className={cn("h-4 w-4", !sidebarCollapsed && "mr-2")} />
            {!sidebarCollapsed && "Sign Out"}
          </Button>
        </Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-muted/10 flex font-sans">
      {/* Desktop Sidebar */}
      <aside className={cn(
        "hidden md:block fixed inset-y-0 z-30 transition-all duration-300 ease-in-out",
        sidebarCollapsed ? "w-20" : "w-64"
      )}>
        <SidebarContent />
      </aside>

      {/* Main Content */}
      <div className={cn(
          "flex-1 flex flex-col min-h-screen transition-all duration-300",
          sidebarCollapsed ? "md:ml-20" : "md:ml-64"
      )}>
        <header className="h-16 border-b bg-background/80 backdrop-blur-md sticky top-0 z-20 px-4 md:px-6 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-4">
            <div className="md:hidden">
                <Sheet>
                <SheetTrigger asChild>
                    <Button variant="ghost" size="icon">
                    <Menu className="h-5 w-5" />
                    </Button>
                </SheetTrigger>
                <SheetContent side="left" className="p-0 w-64">
                    <SidebarContent />
                </SheetContent>
                </Sheet>
            </div>
            
            <Button 
                variant="ghost" 
                size="icon" 
                className="hidden md:flex text-muted-foreground hover:text-foreground"
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            >
                {sidebarCollapsed ? <PanelLeft className="h-5 w-5" /> : <PanelLeftClose className="h-5 w-5" />}
            </Button>

            <div className="hidden md:flex items-center text-sm text-muted-foreground">
                 <span className="text-muted-foreground/60">Portal</span>
                 <ChevronRight className="h-4 w-4 mx-2" />
                 <span className="font-medium text-foreground">
                    {links.find(l => isActive(l.href))?.label || 'Dashboard'}
                 </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
             <div className="relative hidden sm:block w-64">
                 <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                 <Input 
                    placeholder="Search..." 
                    className="h-9 pl-9 bg-muted/50 border-transparent focus:bg-background focus:border-input transition-all" 
                 />
             </div>
             <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-primary">
                <Bell className="h-5 w-5" />
                <span className="absolute top-2.5 right-2.5 h-2 w-2 bg-destructive rounded-full border-2 border-background" />
             </Button>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-8 overflow-x-hidden">
          <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
