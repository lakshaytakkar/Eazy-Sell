import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLocation } from "wouter";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { ArrowRight, Eye, EyeOff, Store, Shield, Phone } from "lucide-react";
import loginStoreHero from "@/assets/images/login-store-hero.png";
import { InlineLoader } from "@/components/ui/loader";

export default function LoginPage() {
  const [_, setLocation] = useLocation();
  const { login, user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (user) {
      setLocation(user.role === "admin" ? "/admin/dashboard" : "/client/dashboard");
    }
  }, [user, setLocation]);

  if (user) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await login(email, password);
      toast({ title: "Welcome back!", description: `Signed in as ${result.user.name}` });
      setLocation(result.role === "admin" ? "/admin/dashboard" : "/client/dashboard");
    } catch (err: any) {
      toast({
        title: "Login failed",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="relative hidden lg:flex flex-col justify-between p-12 text-white overflow-hidden">
        <img
          src={loginStoreHero}
          alt="Inside a value retail store"
          className="absolute inset-0 w-full h-full object-cover"
          loading="eager"
          decoding="sync"
          fetchPriority="high"
          data-testid="img-login-store"
        />
        <div className="absolute inset-0 z-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30" />

        <div className="relative z-10">
          <img src="/logo.png" alt="Eazy to Sell" className="h-16 w-auto object-contain" loading="eager" />
        </div>

        <div className="relative z-10 max-w-lg space-y-6">
          <blockquote className="space-y-4">
            <p className="text-3xl font-medium leading-tight font-sans tracking-tight">
              "The most comprehensive platform for retail entrepreneurs. Launching my store was effortless."
            </p>
            <footer className="flex items-center gap-4">
              <div>
                <div className="font-semibold">Rahul Sharma</div>
                <div className="text-sm text-zinc-400">Jaipur Partner</div>
              </div>
            </footer>
          </blockquote>
        </div>

        <div className="relative z-10 flex gap-6 text-sm text-zinc-400">
          <div className="flex items-center gap-2">
            <Store className="h-4 w-4" />
            <span>50+ Stores Launched</span>
          </div>
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            <span>Secure Platform</span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-[400px] space-y-8 animate-in fade-in slide-in-from-right-8 duration-700">
          <div className="space-y-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground" data-testid="text-auth-title">
              Partner Login
            </h1>
            <p className="text-muted-foreground text-sm">
              Enter your credentials to access the partner portal.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="h-10"
                  required
                  data-testid="input-email"
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="h-10 pr-10"
                    required
                    minLength={6}
                    data-testid="input-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    data-testid="button-toggle-password"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Button
                type="submit"
                className="w-full h-10 font-medium"
                disabled={isLoading}
                data-testid="button-submit-auth"
              >
                {isLoading ? <><InlineLoader className="mr-2" /> Signing in...</> : "Sign In"}
                {!isLoading && <ArrowRight className="ml-2 h-4 w-4" />}
              </Button>
            </div>
          </form>

          <div className="bg-muted/50 rounded-lg p-4 space-y-2">
            <p className="text-xs text-muted-foreground leading-relaxed" data-testid="text-credentials-note">
              Login credentials are provided by our team after your application is reviewed. If you haven't received yours yet, please contact us:
            </p>
            <a href="tel:+919306566900" className="inline-flex items-center gap-2 text-primary font-semibold text-sm" data-testid="link-phone-login">
              <Phone className="h-3.5 w-3.5" />
              +91 93065 66900
            </a>
          </div>

          <p className="text-center text-xs text-muted-foreground">
            By continuing, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
}
