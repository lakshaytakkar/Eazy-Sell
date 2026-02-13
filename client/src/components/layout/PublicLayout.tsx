import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { Calculator, LayoutDashboard, LogIn, Menu } from "lucide-react";
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
          <Link href="/">
            <a className="flex items-center gap-2">
              <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-bold font-display text-xl">
                E
              </div>
              <span className="font-display font-bold text-xl tracking-tight text-foreground">
                Eazy to Sell
              </span>
            </a>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/">
              <a className={`text-sm font-medium transition-colors hover:text-primary ${isActive('/') ? 'text-primary' : 'text-muted-foreground'}`}>
                Home
              </a>
            </Link>
            <Link href="/roi-calculator">
              <a className={`text-sm font-medium transition-colors hover:text-primary ${isActive('/roi-calculator') ? 'text-primary' : 'text-muted-foreground'}`}>
                ROI Estimator
              </a>
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

          {/* Mobile Nav */}
          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <nav className="flex flex-col gap-4 mt-8">
                <Link href="/">
                  <a className="text-lg font-medium">Home</a>
                </Link>
                <Link href="/roi-calculator">
                  <a className="text-lg font-medium">ROI Estimator</a>
                </Link>
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
                <div className="h-6 w-6 bg-primary rounded flex items-center justify-center text-primary-foreground font-bold font-display text-sm">
                  E
                </div>
                <span className="font-display font-bold text-lg">Eazy to Sell</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Empowering entrepreneurs to build successful retail businesses with end-to-end support.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Platform</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/"><a className="hover:text-foreground">Home</a></Link></li>
                <li><Link href="/roi-calculator"><a className="hover:text-foreground">ROI Calculator</a></Link></li>
                <li><Link href="/login"><a className="hover:text-foreground">Partner Login</a></Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground">About Us</a></li>
                <li><a href="#" className="hover:text-foreground">Contact</a></li>
                <li><a href="#" className="hover:text-foreground">Terms of Service</a></li>
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
