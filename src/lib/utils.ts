import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export function parseCurrency(currencyString: string): number {
  // Remove currency symbol and any whitespace
  const cleanedString = currencyString.replace(/[₹$€£\s,]/g, '');
  
  // Convert to float/double
  return parseFloat(cleanedString);
}
