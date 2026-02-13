import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLocation } from "wouter";
import { useState } from "react";
import { ArrowRight, CheckCircle2 } from "lucide-react";

export default function LoginPage() {
  const [_, setLocation] = useLocation();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (role: 'client' | 'admin') => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      if (role === 'client') {
        setLocation('/client/dashboard');
      } else {
        setLocation('/admin/dashboard');
      }
    }, 1500);
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left Side - Hero */}
      <div className="relative hidden lg:flex flex-col justify-between p-12 bg-zinc-900 text-white overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-40">
           <img 
            src="/auth-pattern.png" 
            alt="Abstract Background" 
            className="w-full h-full object-cover"
           />
           <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent" />
        </div>

        <div className="relative z-10">
          <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-white font-bold text-xl">
            ETS
          </div>
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
      </div>

      {/* Right Side - Form */}
      <div className="flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-[380px] space-y-8 animate-in fade-in slide-in-from-right-8 duration-700">
          <div className="space-y-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Sign in to your account</h1>
            <p className="text-muted-foreground text-sm">
              Enter your details to access the portal.
            </p>
          </div>

          <div className="space-y-6">
             <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email or Phone</Label>
                  <Input 
                    id="email" 
                    placeholder="name@example.com" 
                    className="h-10" 
                  />
                </div>
                <div className="space-y-2">
                   <div className="flex items-center justify-between">
                      <Label htmlFor="password">Password / OTP</Label>
                      <a href="#" className="text-xs text-primary hover:underline font-medium">Forgot?</a>
                   </div>
                  <Input 
                    id="password" 
                    type="password"
                    placeholder="••••••••" 
                    className="h-10" 
                  />
                </div>
             </div>

             <div className="space-y-3">
                 <Button 
                    className="w-full h-10 font-medium" 
                    onClick={() => handleLogin('client')} 
                    disabled={isLoading}
                >
                    {isLoading ? 'Verifying...' : 'Sign In as Partner'}
                </Button>
                <Button 
                    variant="outline"
                    className="w-full h-10 font-medium" 
                    onClick={() => handleLogin('admin')} 
                    disabled={isLoading}
                >
                    Admin Login
                </Button>
             </div>
          </div>

          <p className="text-center text-xs text-muted-foreground">
            By clicking continue, you agree to our <a href="#" className="underline">Terms of Service</a> and <a href="#" className="underline">Privacy Policy</a>.
          </p>
        </div>
      </div>
    </div>
  );
}
