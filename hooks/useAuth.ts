"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import { getSupabaseBrowserClient } from "@/lib/supabase/browser-client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function useAuth(user: any = null) {
  const supabase = getSupabaseBrowserClient();
  const router = useRouter();

  const [currentUser, setCurrentUser] = useState<any | null>(user);
  const [loading, setLoading] = useState<null | "google" | "github" | "logout">(
    null,
  );

  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session?.user) {
          setCurrentUser(session.user);
          setLoading(null);
          router.replace("/");
        } else {
          setCurrentUser(null);
        }
      },
    );

    return () => listener?.subscription.unsubscribe();
  }, [supabase, router]);

  const signInWithGoogle = async () => {
    setLoading("google");
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/login`,
        skipBrowserRedirect: false,
      },
    });
  };

  const signInWithGithub = async () => {
    setLoading("github");
    await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: `${window.location.origin}/auth/login`,
        skipBrowserRedirect: false,
      },
    });
  };

  const logout = async () => {
    setLoading("logout");
    await supabase.auth.signOut();
    setCurrentUser(null);
    router.replace("/auth/login");
    setLoading("logout");
  };

  return {
    currentUser,
    loading,
    signInWithGoogle,
    signInWithGithub,
    logout,
  };
}
