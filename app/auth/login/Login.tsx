"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import { GitHubIcon, GoogleIcon, WeeveanIcon } from "@/components/shared/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

export default function LoginPage({ user }: any) {
  console.log("user", user);
  
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden lg:block bg-muted">
        <div className="absolute inset-0 bg-linear-to-br from-primary/10 via-transparent to-accent/10" />
        <div className="flex h-full flex-col items-center justify-center p-12">
          <div className="max-w-md space-y-6 text-center">
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center">
              <WeeveanIcon className="h-10 w-10 text-primary" />
            </div>
            <h2 className="text-3xl font-bold tracking-tight">
              Team collaboration, reimagined
            </h2>
            <p className="text-lg text-muted-foreground">
              Open-source team chat with AI-powered assistance. Built for
              developers, designed for everyone.
            </p>
            <div className="flex flex-wrap gap-3 justify-center pt-4">
              <div className="flex items-center gap-2 text-sm">
                <div className="h-2 w-2 rounded-full bg-primary" />
                <span>Multi-tenant workspaces</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="h-2 w-2 rounded-full bg-primary" />
                <span>AI assistance</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="h-2 w-2 rounded-full bg-primary" />
                <span>Self-hosted</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col justify-center px-6 py-12 lg:px-12">
        <div className="mx-auto w-full max-w-md">
          <Link href="/" className="flex items-center space-x-2 mb-8">
            <WeeveanIcon className="h-8 w-8 text-primary" />
            <span className="text-xl font-semibold">Weevean</span>
          </Link>

          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight">Welcome back</h1>
            <p className="mt-2 text-muted-foreground">
              Sign in to continue to your workspace
            </p>
          </div>

          <div className="space-y-3">
            <Button
              variant="outline"
              className="w-full gap-3 h-11"
              type="button"
            >
              <GitHubIcon className="h-5 w-5" />
              <span>Continue with GitHub</span>
            </Button>
            <Button
              variant="outline"
              className="w-full gap-3 h-11"
              type="button"
            >
              <GoogleIcon className="h-5 w-5" />
              <span>Continue with Google</span>
            </Button>
          </div>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <Separator />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-3 text-muted-foreground">
                or continue with email
              </span>
            </div>
          </div>

          <form className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                required
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link
                  href="/auth/forgot-password"
                  className="text-sm text-primary hover:text-primary/90"
                >
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                placeholder="••••••••"
                required
              />
            </div>

            <Button type="submit" className="w-full h-11 mt-6">
              Sign in
            </Button>
          </form>

          <p className="mt-8 text-center text-sm text-muted-foreground">
            <span>{"Don't have an account?"}</span>
            <Link
              href="/auth/sign-up"
              className="font-medium text-primary hover:text-primary/90 ml-1"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
