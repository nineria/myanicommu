import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** 1200 -> 1.2K, 3_400_000 -> 3.4M (ported from the old utils/Calculator) */
export function kFormatter(num: number) {
  const abs = Math.abs(num);
  if (abs > 999_999)
    return `${Math.sign(num) * Number((abs / 1_000_000).toFixed(1))}M`;
  if (abs > 999) return `${Math.sign(num) * Number((abs / 1000).toFixed(1))}K`;
  return String(num);
}

export function stripHtml(html: string) {
  return html.replace(/(<([^>]+)>)/gi, "");
}
