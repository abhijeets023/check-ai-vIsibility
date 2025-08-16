'use client';

import { useEffect, useState } from 'react';
import { TRPCDemo } from '@/components/trpc-demo';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { authClient } from '@/lib/auth-client';

interface User {
  id: string;
  name?: string;
  email: string;
  image?: string | null;
  emailVerified?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  useEffect(() => {
    // Check if user is already signed in
    const getSession = async () => {
      try {
        const session = await authClient.getSession();
        if (session.data?.session) {
          setUser(session.data.user);
        }
      } catch (error) {
        console.error('Session error:', error);
      } finally {
        setLoading(false);
      }
    };

    getSession();
  }, []);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await authClient.signIn.email({
        email,
        password,
      });
      if (result.data?.user) {
        setUser(result.data.user);
      }
    } catch (error) {
      console.error('Sign in error:', error);
      alert('Sign in failed. Please check your credentials.');
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await authClient.signUp.email({
        email,
        password,
        name,
      });
      if (result.data?.user) {
        setUser(result.data.user);
      }
    } catch (error) {
      console.error('Sign up error:', error);
      alert('Sign up failed. Please try again.');
    }
  };

  const handleSignOut = async () => {
    try {
      await authClient.signOut();
      setUser(null);
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const handleGitHubSignIn = async () => {
    try {
      await authClient.signIn.social({
        provider: 'github',
      });
    } catch (error) {
      console.error('GitHub sign in error:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (user) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="w-full max-w-4xl space-y-6">
          <Card className="mx-auto w-full max-w-md">
            <CardHeader>
              <CardTitle>Welcome back!</CardTitle>
              <CardDescription>You are signed in</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <p className="font-medium text-lg">{user.name || 'User'}</p>
                <p className="text-gray-600 text-sm">{user.email}</p>
              </div>
              <Button className="w-full" onClick={handleSignOut} variant="outline">
                Sign Out
              </Button>
            </CardContent>
          </Card>

          {/* tRPC Demo Component */}
          <div className="mx-auto max-w-2xl">
            <TRPCDemo />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Welcome to Check AI Visibility</CardTitle>
          <CardDescription>Sign in to your account or create a new one</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs className="w-full" defaultValue="signin">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>

            <TabsContent className="space-y-4" value="signin">
              <form className="space-y-4" onSubmit={handleSignIn}>
                <Input
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                  placeholder="Email"
                  required
                  type="email"
                  value={email}
                />
                <Input
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                  placeholder="Password"
                  required
                  type="password"
                  value={password}
                />
                <Button className="w-full" type="submit">
                  Sign In
                </Button>
              </form>
            </TabsContent>

            <TabsContent className="space-y-4" value="signup">
              <form className="space-y-4" onSubmit={handleSignUp}>
                <Input
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                  placeholder="Name"
                  required
                  type="text"
                  value={name}
                />
                <Input
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                  placeholder="Email"
                  required
                  type="email"
                  value={email}
                />
                <Input
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                  placeholder="Password"
                  required
                  type="password"
                  value={password}
                />
                <Button className="w-full" type="submit">
                  Sign Up
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
              </div>
            </div>
            <Button className="mt-4 w-full" onClick={handleGitHubSignIn} variant="outline">
              GitHub
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
