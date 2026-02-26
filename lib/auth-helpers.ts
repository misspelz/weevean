import { auth } from "@/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

type Session = typeof auth.$Infer.Session;

export async function getSession(): Promise<Session | null> {
  return await auth.api.getSession({
    headers: await headers(),
  });
}

export async function requireAuth(
  redirectTo = "auth/sign-in"
): Promise<Session> {
  const session = await getSession();

  if (!session) {
    redirect(redirectTo);
  }

  return session;
}

// Use this in server actions and API routes since we can't be redirecting over there :)
export async function requireAuthServer(): Promise<Session> {
  const session = await getSession();

  if (!session) {
    throw new Error("Please log in."); // We should implement a global error lib/handler
  }

  return session;
}
