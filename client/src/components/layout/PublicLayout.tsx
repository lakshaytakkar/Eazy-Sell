import { ReactNode, useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, ArrowUp, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

interface PublicLayoutProps {
  children: ReactNode;
}

export function PublicLayout({ children }: PublicLayoutProps) {
  const [location] = useLocation();
  const { user } = useAuth();
  const isLoggedIn = !!user;
  const dashboardHref = user?.role === "admin" ? "/admin/dashboard" : "/client/dashboard";
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);

  const isActive = (path: string) => location === path;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
      setShowBackToTop(window.scrollY > 600);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/roi-calculator", label: "ROI Estimator" },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      <header
        className={`sticky top-0 z-50 w-full transition-all duration-300 ${
          scrolled
            ? "bg-background/95 backdrop-blur-lg shadow-md border-b"
            : "bg-transparent"
        }`}
      >
        <div className="container mx-auto px-4 md:px-6 h-20 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <img
              src="/logo.png"
              alt="Eazy to Sell"
              className="h-20 w-auto object-contain"
              loading="eager"
              data-testid="img-header-logo"
            />
          </Link>

          <nav className="hidden md:flex items-center gap-1" data-testid="nav-desktop">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <span
                  className={`px-4 py-2 rounded-md text-sm font-semibold transition-colors cursor-pointer ${
                    isActive(link.href)
                      ? "text-primary"
                      : "text-foreground/70 hover:text-foreground"
                  }`}
                  data-testid={`link-nav-${link.label.toLowerCase().replace(/\s/g, "-")}`}
                >
                  {link.label}
                </span>
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            {isLoggedIn ? (
              <Link href={dashboardHref}>
                <Button data-testid="button-nav-dashboard">
                  <LayoutDashboard className="h-4 w-4 mr-2" />
                  My Dashboard
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/login">
                  <Button data-testid="button-nav-login">
                    Partner Login
                  </Button>
                </Link>
              </>
            )}
          </div>

          <Button
            size="icon"
            variant="ghost"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden"
            data-testid="button-mobile-menu"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {mobileOpen && (
          <div className="md:hidden bg-background border-t">
            <nav className="container mx-auto px-4 py-4 flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href}>
                  <span
                    onClick={() => setMobileOpen(false)}
                    className={`block px-4 py-3 rounded-md text-base font-semibold cursor-pointer ${
                      isActive(link.href) ? "text-primary bg-primary/5" : "text-foreground/70"
                    }`}
                    data-testid={`link-mobile-${link.label.toLowerCase().replace(/\s/g, "-")}`}
                  >
                    {link.label}
                  </span>
                </Link>
              ))}
              <div className="h-px bg-border my-2" />
              {isLoggedIn ? (
                <Link href={dashboardHref}>
                  <Button className="w-full" onClick={() => setMobileOpen(false)} data-testid="button-mobile-dashboard">
                    <LayoutDashboard className="h-4 w-4 mr-2" />
                    My Dashboard
                  </Button>
                </Link>
              ) : (
                <Link href="/login">
                  <Button className="w-full" onClick={() => setMobileOpen(false)} data-testid="button-mobile-login">
                    Partner Login
                  </Button>
                </Link>
              )}
            </nav>
          </div>
        )}
      </header>

      <main className="flex-1">
        {children}
      </main>

      <footer className="border-t py-16 bg-[hsl(30,15%,10%)] dark:bg-[hsl(25,15%,6%)]">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
            <div className="space-y-4">
              <img src="/logo.png" alt="Eazy to Sell" className="h-12 w-auto object-contain" loading="lazy" />
              <p className="text-sm text-white/50">
                Empowering entrepreneurs to build successful retail businesses with end-to-end support.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-white">Platform</h4>
              <ul className="space-y-2.5 text-sm text-white/50">
                <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
                <li><Link href="/roi-calculator" className="hover:text-white transition-colors">ROI Calculator</Link></li>
                <li><Link href="/login" className="hover:text-white transition-colors">Partner Login</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-white">Company</h4>
              <ul className="space-y-2.5 text-sm text-white/50">
                <li><span className="hover:text-white transition-colors cursor-pointer">About Us</span></li>
                <li><span className="hover:text-white transition-colors cursor-pointer">Contact</span></li>
                <li><span className="hover:text-white transition-colors cursor-pointer">Terms of Service</span></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-white">Contact</h4>
              <p className="text-sm leading-relaxed text-white/50">
                support@eazytosell.com<br />
                +91 98765 43210
              </p>
            </div>
          </div>
          <div className="mt-14 pt-8 border-t border-white/10 text-center text-sm text-white/35">
            &copy; {new Date().getFullYear()} Eazy to Sell. All rights reserved.
          </div>
        </div>
      </footer>

      <div
        className={`fixed bottom-6 right-6 z-50 transition-opacity ${showBackToTop ? "opacity-100" : "opacity-0 pointer-events-none"}`}
      >
        <Button
          size="icon"
          onClick={scrollToTop}
          className="rounded-full shadow-lg"
          aria-label="Back to top"
          data-testid="button-back-to-top"
        >
          <ArrowUp className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
