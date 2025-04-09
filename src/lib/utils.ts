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

export async function getPincodeDetails(pincode: string) {
    try {
        const response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
        const data = await response.json();
        
        if (data[0]?.Status === 'Success' && data[0]?.PostOffice?.length > 0) {
            const postOffice = data[0].PostOffice[0];
            return {
                district: postOffice.District,
                state: postOffice.State,
                area: postOffice.Name,
                region: postOffice.Region,
                division: postOffice.Division
            };
        }
        return null;
    } catch (error) {
        console.error('Error fetching pincode details:', error);
        return null;
    }
}
