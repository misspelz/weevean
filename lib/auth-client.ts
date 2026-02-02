import { createAuthClient } from "better-auth/react";
import type { auth } from "@/auth";

export const authClient = createAuthClient();

export const { signIn, signOut, useSession } = authClient;

export type Session = typeof auth.$Infer.Session;
