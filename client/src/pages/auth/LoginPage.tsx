import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLocation } from "wouter";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { ArrowRight, Eye, EyeOff, Store, Shield } from "lucide-react";

export default function LoginPage() {
  const [_, setLocation] = useLocation();
  const { login, signup, user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [showPassword, setShowPassword] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [phone, setPhone] = useState("");

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
      if (mode === "login") {
        const result = await login(email, password);
        toast({ title: "Welcome back!", description: `Signed in as ${result.user.name}` });
        setLocation(result.role === "admin" ? "/admin/dashboard" : "/client/dashboard");
      } else {
        if (!name || !city) {
          toast({ title: "Missing fields", description: "Please fill in all required fields", variant: "destructive" });
          setIsLoading(false);
          return;
        }
        const result = await signup({ email, password, name, city, phone });
        toast({ title: "Account created!", description: "Welcome to Eazy to Sell" });
        setLocation("/client/dashboard");
      }
    } catch (err: any) {
      toast({
        title: mode === "login" ? "Login failed" : "Signup failed",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="relative hidden lg:flex flex-col justify-between p-12 bg-zinc-900 text-white overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-20">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/40 via-transparent to-yellow-500/20" />
          <div className="absolute top-20 left-20 w-72 h-72 bg-primary/20 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10">
          <img src="/logo.png" alt="Eazy to Sell" className="h-12 w-auto object-contain" loading="eager" />
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
              {mode === "login" ? "Sign in to your account" : "Create your account"}
            </h1>
            <p className="text-muted-foreground text-sm">
              {mode === "login"
                ? "Enter your credentials to access the portal."
                : "Fill in your details to get started as a partner."}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              {mode === "signup" && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Rahul Sharma"
                      className="h-10"
                      required
                      data-testid="input-name"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label htmlFor="city">City *</Label>
                      <Input
                        id="city"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="Jaipur"
                        className="h-10"
                        required
                        data-testid="input-city"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+91 98765 43210"
                        className="h-10"
                        data-testid="input-phone"
                      />
                    </div>
                  </div>
                </>
              )}

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
                    placeholder="••••••••"
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
                {isLoading ? "Please wait..." : mode === "login" ? "Sign In" : "Create Account"}
                {!isLoading && <ArrowRight className="ml-2 h-4 w-4" />}
              </Button>
            </div>
          </form>

          <div className="text-center space-y-3">
            <button
              onClick={() => setMode(mode === "login" ? "signup" : "login")}
              className="text-sm text-primary hover:underline font-medium"
              data-testid="button-toggle-mode"
            >
              {mode === "login" ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
            </button>
          </div>

          <p className="text-center text-xs text-muted-foreground">
            By continuing, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
}
