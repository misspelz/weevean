"use client";
import { GitHubIcon, GoogleIcon, WeeveanIcon } from "@/components/shared/icons";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { authClient } from "@/lib/auth-client";

export default function LoginPage() {
  const handleGoogleSignIn = async () => {
    await authClient.signIn.social({
      provider: "google",
      callbackURL: "/",
    });
  };

  const handleGitHubSignIn = async () => {
    await authClient.signIn.social({
      provider: "github",
      callbackURL: "/",
    });
  };

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
              onClick={handleGitHubSignIn}
              variant="outline"
              className="w-full gap-3 h-11"
              type="button"
            >
              <GitHubIcon className="h-5 w-5" />
              <span>Continue with GitHub</span>
            </Button>
            <Button
              onClick={handleGoogleSignIn}
              variant="outline"
              className="w-full gap-3 h-11"
              type="button"
            >
              <GoogleIcon className="h-5 w-5" />
              <span>Continue with Google</span>
            </Button>
          </div>

          <div className="text-center mt-5">
            <p className="text-sm text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link
                href="/auth/sign-up"
                className="font-medium text-primary hover:text-primary/80 transition-colors inline-flex items-center group"
              >
                Sign up
                <ArrowRight className="w-3 h-3 ml-1 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </p>
          </div>

          <div className="text-center">
            <p className="text-xs text-muted-foreground/50 mt-8">
              By clicking continue, you agree to our{" "}
              <Link
                href="/terms"
                className="underline hover:text-muted-foreground"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                href="/privacy"
                className="underline hover:text-muted-foreground"
              >
                Privacy Policy
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
