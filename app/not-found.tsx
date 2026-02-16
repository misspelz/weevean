import { Button } from "@/components/ui/button";
import Link from "next/link";

const Error = () => {
  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
      <div className="flex flex-col items-center justify-center px-4 py-8 text-center">
        <div className="mb-8">
          <h1 className="mb-2 text-[120px] font-bold leading-none text-primary">
            404
          </h1>
          <div className="h-1 w-24 mx-auto bg-primary rounded-full"></div>
        </div>

        <h2 className="mb-3 text-4xl font-semibold">Page Not Found</h2>
        <p className="text-muted-foreground mb-8 max-w-md text-lg">
          {
            "The page you're looking for seems to have wandered off into the digital void. Let's get you back on track."
          }
        </p>

        <div className="flex gap-3">
          <Button asChild size="lg" className="rounded-lg text-base">
            <Link href="/">Back to Home</Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="rounded-lg text-base"
          >
            <a href="/help">Get Help</a>
          </Button>
        </div>
      </div>

      <div className="relative flex items-center justify-center max-h-screen w-full p-8 max-lg:hidden bg-muted/30">
        <div className="relative">
          <div className="absolute -top-12 -left-12 w-24 h-24 bg-primary/10 rounded-full blur-2xl animate-pulse"></div>
          <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-accent/10 rounded-full blur-2xl animate-pulse [animation-delay:700ms]"></div>

          <div className="relative bg-card border border-border rounded-3xl p-12 shadow-lg">
            <div className="flex flex-col items-center gap-6">
              <div className="relative w-64 h-64">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-48 h-48 border-4 border-primary/20 rounded-full"></div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center animate-spin animation-duration-[8s]">
                  <div className="w-40 h-40 border-t-4 border-r-4 border-primary rounded-full"></div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center">
                    <svg
                      className="w-12 h-12 text-primary"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              <p className="text-muted-foreground text-sm font-mono">
                ERR_PAGE_NOT_FOUND
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Error;