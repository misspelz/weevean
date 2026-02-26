"use client";

import { type ComponentProps, memo } from "react";
import { Streamdown } from "streamdown";
import type { BundledTheme } from "shiki";
import { cn } from "@/lib/utils";

type ResponseProps = ComponentProps<typeof Streamdown>;
const themes = ["github-dark", "dracula"] as [BundledTheme, BundledTheme];
export const Response = memo(
  ({ className, ...props }: ResponseProps) => (
    <Streamdown
      shikiTheme={themes}
      className={cn(
        "size-full [&>*:first-child]:mt-0 [&>*:last-child]:mb-0 [&_code]:whitespace-pre-wrap [&_code]:wrap-break-word [&_pre]:max-w-full [&_pre]:overflow-x-auto",
        className
      )}
      {...props}
    />
  ),
  (prevProps, nextProps) => prevProps.children === nextProps.children
);

Response.displayName = "Response";
