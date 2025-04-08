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

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}
