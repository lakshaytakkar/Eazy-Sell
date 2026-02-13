import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLocation } from "wouter";
import { useState } from "react";
import { ArrowRight, CheckCircle2, ShieldCheck } from "lucide-react";

export default function LoginPage() {
  const [_, setLocation] = useLocation();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (role: 'client' | 'admin') => {
    setIsLoading(true);
    // Simulate login delay
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
      {/* Left Side - Hero/Showcase */}
      <div className="relative hidden lg:flex flex-col justify-between p-12 bg-zinc-900 text-white overflow-hidden">
        {/* Abstract Background */}
        <div className="absolute inset-0 z-0 opacity-40">
           <img 
            src="/auth-pattern.png" 
            alt="Abstract Background" 
            className="w-full h-full object-cover"
           />
           <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent" />
        </div>

        <div className="relative z-10">
          <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground font-display font-bold text-xl">
            E
          </div>
        </div>

        <div className="relative z-10 max-w-lg space-y-6">
          <blockquote className="space-y-4">
            <p className="text-2xl font-medium leading-relaxed font-display">
              "Eazy to Sell gave us the blueprint to launch our store in just 25 days. The inventory support is a game changer."
            </p>
            <footer className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-full bg-white/20" />
              <div>
                <div className="font-semibold">Rahul Sharma</div>
                <div className="text-sm text-zinc-400">Owner, Jaipur Branch</div>
              </div>
            </footer>
          </blockquote>
          
          <div className="pt-8 flex gap-6 text-sm font-medium text-zinc-400">
             <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary" /> Verified Suppliers
             </div>
             <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-primary" /> Secure Payments
             </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-[400px] space-y-8 animate-in fade-in slide-in-from-right-8 duration-700">
          <div className="space-y-2 text-center lg:text-left">
            <h1 className="text-3xl font-display font-bold tracking-tight text-foreground">Welcome back</h1>
            <p className="text-muted-foreground">
              Enter your credentials to access your dashboard.
            </p>
          </div>

          <Tabs defaultValue="partner" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="partner">Partner</TabsTrigger>
              <TabsTrigger value="admin">Admin</TabsTrigger>
            </TabsList>

            <TabsContent value="partner" className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input 
                    id="phone" 
                    placeholder="+91 98765 43210" 
                    className="h-11 bg-muted/30" 
                  />
                </div>
                <div className="space-y-2">
                   <div className="flex items-center justify-between">
                      <Label htmlFor="otp">OTP Code</Label>
                      <a href="#" className="text-xs text-primary hover:underline font-medium">Resend OTP?</a>
                   </div>
                  <Input 
                    id="otp" 
                    placeholder="• • • •" 
                    className="h-11 bg-muted/30 tracking-widest" 
                  />
                </div>
              </div>
              <Button 
                className="w-full h-11 text-base font-semibold shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all" 
                onClick={() => handleLogin('client')} 
                disabled={isLoading}
              >
                {isLoading ? (
                    <span className="flex items-center gap-2">Verifying <span className="animate-pulse">...</span></span>
                ) : (
                    <span className="flex items-center gap-2">Secure Login <ArrowRight className="h-4 w-4" /></span>
                )}
              </Button>
            </TabsContent>

            <TabsContent value="admin" className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="name@company.com" 
                    className="h-11 bg-muted/30" 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input 
                    id="password" 
                    type="password" 
                    className="h-11 bg-muted/30" 
                  />
                </div>
              </div>
              <Button 
                className="w-full h-11 text-base font-semibold shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all" 
                onClick={() => handleLogin('admin')} 
                disabled={isLoading}
              >
                {isLoading ? 'Authenticating...' : 'Sign In'}
              </Button>
            </TabsContent>
          </Tabs>

          <p className="text-center text-sm text-muted-foreground">
            Interested in starting a store? <a href="#" className="font-medium text-primary hover:underline">Apply Now</a>
          </p>
        </div>
      </div>
    </div>
  );
}
