import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

interface PublicLayoutProps {
  children: ReactNode;
}

export function PublicLayout({ children }: PublicLayoutProps) {
  const [location] = useLocation();

  const isActive = (path: string) => location === path;

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <img src="/logo.png" alt="Eazy to Sell" className="h-12 w-auto object-contain" loading="eager" />
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className={`text-sm font-medium transition-colors hover:text-primary ${isActive('/') ? 'text-primary' : 'text-muted-foreground'}`}>
              Home
            </Link>
            <Link href="/roi-calculator" className={`text-sm font-medium transition-colors hover:text-primary ${isActive('/roi-calculator') ? 'text-primary' : 'text-muted-foreground'}`}>
              ROI Estimator
            </Link>
            <div className="flex items-center gap-2 ml-4">
              <Link href="/login">
                <Button variant="ghost" size="sm">Log In</Button>
              </Link>
              <Link href="/login">
                <Button size="sm">Get Started</Button>
              </Link>
            </div>
          </nav>

          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <nav className="flex flex-col gap-4 mt-8">
                <Link href="/" className="text-lg font-medium">Home</Link>
                <Link href="/roi-calculator" className="text-lg font-medium">ROI Estimator</Link>
                <div className="h-px bg-border my-2" />
                <Link href="/login">
                  <Button className="w-full">Log In / Sign Up</Button>
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      <main className="flex-1">
        {children}
      </main>

      <footer className="border-t bg-muted/30 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <img src="/logo.png" alt="Eazy to Sell" className="h-8 w-auto object-contain" loading="eager" />
              </div>
              <p className="text-sm text-muted-foreground">
                Empowering entrepreneurs to build successful retail businesses with end-to-end support.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Platform</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/" className="hover:text-foreground">Home</Link></li>
                <li><Link href="/roi-calculator" className="hover:text-foreground">ROI Calculator</Link></li>
                <li><Link href="/login" className="hover:text-foreground">Partner Login</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><span className="hover:text-foreground cursor-pointer">About Us</span></li>
                <li><span className="hover:text-foreground cursor-pointer">Contact</span></li>
                <li><span className="hover:text-foreground cursor-pointer">Terms of Service</span></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <p className="text-sm text-muted-foreground">
                support@eazytosell.com<br />
                +91 98765 43210
              </p>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} Eazy to Sell. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
