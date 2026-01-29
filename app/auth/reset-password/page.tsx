import { WeeveanIcon } from "@/components/shared/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
export default function ResetPasswordPage() {
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
              <h1 className="text-2xl font-semibold">Create new password</h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Enter a new password for your account
              </p>
            </div>

            <div className="mt-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="new-password" className="text-sm font-medium">
                  New password
                </Label>
                <Input
                  id="new-password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  placeholder="••••••••"
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Must be at least 8 characters long
                </p>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="confirm-password"
                  className="text-sm font-medium"
                >
                  Confirm password
                </Label>
                <Input
                  id="confirm-password"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  placeholder="••••••••"
                  required
                />
              </div>

              <Button type="submit" className="w-full h-11 mt-6">
                Reset password
              </Button>
            </div>

            <div className="mt-6 rounded-lg bg-muted/50 p-3">
              <p className="text-xs text-muted-foreground text-center">
                {"After resetting, you'll be allowed to login again"}
              </p>
            </div>
          </div>

          <div className="p-4 bg-muted/30">
            <p className="text-center text-sm text-muted-foreground">
              Need help?{" "}
              <Link
                href="/"
                className="font-medium text-primary hover:text-primary/90"
              >
                Contact support
              </Link>
            </p>
          </div>
        </form>
      </div>
    </section>
  );
}
