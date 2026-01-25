import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getUserInitials = (name: string | null | undefined) => {
  if (!name) return "";
  const namesArray = name.trim().split(" ");
  if (namesArray.length === 0) return "";

  const initials =
    namesArray.length === 1
      ? namesArray[0].charAt(0)
      : namesArray[0].charAt(0) + namesArray[namesArray.length - 1].charAt(0);

  return initials.toUpperCase();
};
