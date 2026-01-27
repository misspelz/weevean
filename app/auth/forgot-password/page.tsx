import { WeeveanIcon } from "@/components/shared/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export default function ForgotPasswordPage() {
  return (
    <section className="flex min-h-screen items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <form className="bg-muted overflow-hidden rounded-[calc(var(--radius)+2px)] border shadow-lg">
          <div className="bg-card -m-px rounded-[calc(var(--radius)+2px)] border p-8 pb-6">
            <Link href="/" className="inline-flex items-center space-x-2">
              <WeeveanIcon className="h-7 w-7 text-primary" />
              <span className="text-lg font-semibold">Weevean</span>
            </Link>

            <div className="mt-6">
              <h1 className="text-2xl font-semibold">Reset your password</h1>
              <p className="mt-2 text-sm text-muted-foreground">
                {
                  "Enter your email address and we'll send you a link to reset your password"
                }
              </p>
            </div>

            <div className="mt-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="reset-email" className="text-sm font-medium">
                  Email address
                </Label>
                <Input
                  id="reset-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  required
                />
              </div>

              <Button type="submit" className="w-full h-11">
                Send reset link
              </Button>
            </div>

            <div className="mt-6 rounded-lg bg-muted/50 p-3">
              <p className="text-xs text-muted-foreground text-center">
                {
                  "We'll send you an email with instructions to reset your password"
                }
              </p>
            </div>
          </div>

          <div className="p-4 bg-muted/30">
            <p className="text-center text-sm text-muted-foreground">
              Remember your password?{" "}
              <Link
                href="/auth/login"
                className="font-medium text-primary hover:text-primary/90"
              >
                Sign in
              </Link>
            </p>
          </div>
        </form>
      </div>
    </section>
  );
}
