import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { ClientError } from "./client-error";
import { ApiResponse } from "./types";

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

export const fetcher = async <T>(
  input: string | URL | Request,
  init?: RequestInit | undefined,
  onErrorMessage?: string,
): Promise<T> => {
  const response = await fetch(input, init);
  if (!response.ok) {
    if (onErrorMessage) {
      const clientError = new ClientError(response);
      clientError.handleAllCommonErrorsWithToast(onErrorMessage);
    }
    throw await response.json();
  }
  const json: ApiResponse<T> = await response.json();

  return json.result ? json.result.data : (json as unknown as T);
};
