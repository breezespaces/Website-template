import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function filterParams(params: Record<string, unknown>) {
  return Object.fromEntries(
    Object.entries(params).filter(
      ([_, value]) => value !== undefined && value !== null,
    ),
  );
}

export function firstCharToUpperCase(str: string) {
  return str[0].toUpperCase() + str.slice(1).toLocaleLowerCase();
}
