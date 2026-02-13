import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLocation } from "wouter";
import { useState } from "react";

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
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <div className="w-full max-w-md space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-500">
        <div className="text-center space-y-2">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground font-display font-bold text-2xl">
            E
          </div>
          <h1 className="text-2xl font-display font-bold">Welcome Back</h1>
          <p className="text-muted-foreground">Sign in to your account</p>
        </div>

        <Tabs defaultValue="partner" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="partner">Partner Login</TabsTrigger>
            <TabsTrigger value="admin">Admin Login</TabsTrigger>
          </TabsList>
          
          <TabsContent value="partner">
            <Card>
              <CardHeader>
                <CardTitle>Partner Access</CardTitle>
                <CardDescription>Manage your store and inventory.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" placeholder="+91 98765 43210" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="otp">OTP</Label>
                  <Input id="otp" placeholder="Enter OTP (Any 4 digits)" />
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" onClick={() => handleLogin('client')} disabled={isLoading}>
                  {isLoading ? 'Verifying...' : 'Login Securely'}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="admin">
            <Card>
              <CardHeader>
                <CardTitle>Internal Team</CardTitle>
                <CardDescription>Access the administration panel.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="admin@eazytosell.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" type="password" />
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" onClick={() => handleLogin('admin')} disabled={isLoading}>
                   {isLoading ? 'Authenticating...' : 'Admin Login'}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
        
        <div className="text-center text-sm text-muted-foreground">
          Don't have an account? <a href="#" className="underline hover:text-primary">Apply to be a partner</a>
        </div>
      </div>
    </div>
  );
}
