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
  ClipboardList
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

type UserType = 'admin' | 'client';

interface DashboardLayoutProps {
  children: ReactNode;
  userType: UserType;
}

export function DashboardLayout({ children, userType }: DashboardLayoutProps) {
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const isActive = (path: string) => location === path;

  const clientLinks = [
    { href: '/client/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/client/catalog', label: 'Product Catalog', icon: ShoppingBag },
    { href: '/client/launch-kit', label: 'My Launch Kit', icon: Package },
    { href: '/client/store', label: 'My Store', icon: Store },
    { href: '/client/payments', label: 'Payments', icon: CreditCard },
  ];

  const adminLinks = [
    { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/clients', label: 'Clients', icon: Users },
    { href: '/admin/products', label: 'Products', icon: ShoppingBag },
    { href: '/admin/reviews', label: 'Kit Reviews', icon: ClipboardList },
    { href: '/admin/settings', label: 'Settings', icon: Settings },
  ];

  const links = userType === 'admin' ? adminLinks : clientLinks;

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-sidebar border-r border-sidebar-border text-sidebar-foreground">
      <div className="h-16 flex items-center px-6 border-b border-sidebar-border">
         <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-bold font-display text-xl mr-3">
            E
          </div>
          <span className="font-display font-bold text-lg tracking-tight">
            {userType === 'admin' ? 'Admin Panel' : 'Partner Portal'}
          </span>
      </div>

      <div className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
        {links.map((link) => {
          const Icon = link.icon;
          const active = isActive(link.href);
          
          return (
            <Link key={link.href} href={link.href}>
              <a className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors",
                active 
                  ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-sm" 
                  : "text-muted-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
              )}>
                <Icon className={cn("h-4 w-4", active ? "text-primary" : "text-muted-foreground")} />
                {link.label}
              </a>
            </Link>
          );
        })}
      </div>

      <div className="p-4 border-t border-sidebar-border">
        <Link href="/login">
          <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-destructive" size="sm">
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background flex font-sans">
      {/* Desktop Sidebar */}
      <aside className="hidden md:block w-64 fixed inset-y-0 z-30">
        <SidebarContent />
      </aside>

      {/* Main Content */}
      <div className="flex-1 md:ml-64 flex flex-col min-h-screen">
        <header className="h-16 border-b bg-background sticky top-0 z-20 px-4 md:px-8 flex items-center justify-between">
          <div className="flex items-center gap-2 md:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-64">
                <SidebarContent />
              </SheetContent>
            </Sheet>
            <span className="font-semibold text-sm">
               {userType === 'admin' ? 'Admin' : 'Partner'}
            </span>
          </div>

          <div className="hidden md:flex items-center text-sm text-muted-foreground">
             <span className="font-medium text-foreground">
                {links.find(l => isActive(l.href))?.label || 'Dashboard'}
             </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium leading-none">
                  {userType === 'admin' ? 'Admin User' : 'Rahul Sharma'}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {userType === 'admin' ? 'Super Admin' : 'Jaipur Store'}
                </p>
              </div>
              <Avatar className="h-8 w-8 border">
                <AvatarFallback className="bg-primary/10 text-primary text-xs">
                  {userType === 'admin' ? 'AD' : 'RS'}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-8 bg-muted/20 overflow-x-hidden">
          <div className="max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
