import { AppSidebar } from "./AppSidebar";
import { Header } from "./Header";
import { SidebarProvider } from "@/components/ui/sidebar";
import { ReactNode } from "react";

interface DashboardLayoutProps {
  children: ReactNode;
  userType: 'admin' | 'client';
}

const sidebarStyle = {
  "--sidebar-width": "272px",
  "--sidebar-width-icon": "4rem",
} as React.CSSProperties;

export function DashboardLayout({ children, userType }: DashboardLayoutProps) {
  // We can add mobile logic here later if needed using useIsMobile

  return (
    <SidebarProvider style={sidebarStyle}>
      <div className="flex h-screen w-full bg-background text-foreground font-sans">
        <AppSidebar userType={userType} />
        <div className="flex flex-col flex-1 min-w-0">
          <Header userType={userType} />
          <main className="flex-1 overflow-y-auto bg-background">
            <div className="px-6 py-6 space-y-6 animate-in fade-in duration-300">
              {children}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
