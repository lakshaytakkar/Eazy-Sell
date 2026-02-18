import { Bell, Search, Command, User, Settings, LogOut, PanelLeft, MessageSquare } from "lucide-react";
import { SiWhatsapp } from "react-icons/si";

function SlackIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zM18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312zM15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z"/>
    </svg>
  );
}
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
import { useSidebar } from "@/components/ui/sidebar";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";

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

export function Header({ userType }: { userType: 'admin' | 'client' }) {
  const { state, toggleSidebar } = useSidebar();
  const { user, logout } = useAuth();
  const [_, setLocation] = useLocation();
  const hasUnread = mockNotifications.some((n) => !n.read);

  const displayName = user?.name || (userType === 'admin' ? 'Admin User' : 'Partner');
  const displayRole = userType === 'admin' ? 'Super Admin' : (user?.clientName || 'Partner Store');
  const initials = displayName.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);

  const handleLogout = async () => {
    await logout();
    setLocation("/login");
  };

  return (
    <header className="flex h-20 items-center justify-between px-6 bg-card border-b shrink-0" data-testid="header">
      <div className="flex items-center gap-3">
        {state === "collapsed" && (
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            data-testid="button-sidebar-toggle"
          >
            <PanelLeft className="h-5 w-5" />
          </Button>
        )}
      <button
        className="flex items-center gap-2 px-3 py-2 bg-card border rounded-lg shadow-[0px_1px_2px_0px_rgba(13,13,18,0.06)] dark:shadow-none w-72 hover-elevate transition-colors text-left"
        data-testid="button-search"
      >
        <Search className="h-5 w-5 text-muted-foreground" />
        <span className="flex-1 text-sm text-muted-foreground font-normal tracking-[0.02em]">Search</span>
        <div className="flex items-center gap-1">
          <div className="flex items-center justify-center h-5 w-5 bg-muted rounded" data-testid="search-cmd-key">
            <Command className="h-3 w-3 text-muted-foreground" />
          </div>
          <div className="flex items-center justify-center h-5 w-5 bg-muted rounded" data-testid="search-k-key">
            <span className="text-[13px] font-semibold text-muted-foreground leading-none tracking-[0.02em]">K</span>
          </div>
        </div>
      </button>
      </div>

      <div className="flex items-center gap-2.5">
        <a
          href="https://wa.me/919306566900"
          target="_blank"
          rel="noopener noreferrer"
          data-testid="button-whatsapp-header"
        >
          <Button className="bg-[#25D366] text-white border-[#25D366]">
            <SiWhatsapp className="h-4 w-4 mr-1.5" />
            Chat on WhatsApp
          </Button>
        </a>
        <a
          href="https://suprans.slack.com/archives/C0AFN14THEE"
          target="_blank"
          rel="noopener noreferrer"
          data-testid="button-slack-header"
        >
          <Button className="bg-[#4A154B] text-white border-[#4A154B]">
            <SlackIcon className="h-4 w-4 mr-1.5" />
            Chat on Slack
          </Button>
        </a>

        <Popover>
          <PopoverTrigger asChild>
            <div className="relative cursor-pointer" data-testid="button-notifications">
              <div className="flex items-center justify-center h-8 w-8 rounded-full border bg-card hover:bg-muted transition-colors">
                <Bell className="h-4 w-4 text-foreground" />
              </div>
              {hasUnread && (
                <div className="absolute top-[7px] right-0 h-2 w-2 bg-primary rounded-full ring-2 ring-card" />
              )}
            </div>
          </PopoverTrigger>
          <PopoverContent
            className="w-96 p-0 rounded-lg shadow-lg"
            align="end"
          >
            <div className="flex items-center justify-between gap-2 p-5 border-b">
              <div className="flex items-center gap-2">
                <h3 className="text-base font-semibold">Notifications</h3>
                <div className="bg-primary text-white text-[11px] font-semibold px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
                  {mockNotifications.filter((n) => !n.read).length}
                </div>
              </div>
              <Button variant="ghost" size="icon">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
            <div className="p-4 space-y-3 max-h-80 overflow-y-auto">
              {mockNotifications.map((notification) => (
                <div key={notification.id} className="flex gap-3 items-start">
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-muted shrink-0">
                    <Bell className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <h4 className="text-sm font-semibold truncate">{notification.title}</h4>
                      {!notification.read && (
                        <div className="h-2 w-2 rounded-full bg-primary shrink-0" />
                      )}
                    </div>
                    <p className="text-[13px] text-muted-foreground leading-relaxed">{notification.message}</p>
                    <span className="text-[12px] text-muted-foreground/70">{notification.time}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 border-t flex items-center justify-between gap-2">
              <button className="text-sm font-semibold text-primary" data-testid="button-mark-all-read">
                Mark as all read
              </button>
              <Button size="sm" variant="ghost">View All</Button>
            </div>
          </PopoverContent>
        </Popover>

        <div className="h-5 w-px bg-border" />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 outline-none hover-elevate rounded-lg px-2 py-1" data-testid="button-user-menu">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary text-white text-sm font-medium">
                   {initials}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col items-start text-left">
                <span className="text-[12px] font-semibold leading-[1.5] tracking-[0.02em]" data-testid="text-user-name">
                    {displayName}
                </span>
                <span className="text-[12px] text-muted-foreground leading-[1.5] tracking-[0.02em]" data-testid="text-user-role">
                    {displayRole}
                </span>
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {userType === 'client' && (
              <Link href="/client/profile">
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
              </Link>
            )}
            {userType === 'admin' && (
              <Link href="/admin/settings">
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
              </Link>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={handleLogout} data-testid="button-logout">
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
