import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getAvatarUrl(name: string, size: number = 64): string {
  const encoded = encodeURIComponent(name.trim());
  return `https://ui-avatars.com/api/?name=${encoded}&size=${size}&background=fce4e4&color=e11d48&bold=true&format=png`;
}
