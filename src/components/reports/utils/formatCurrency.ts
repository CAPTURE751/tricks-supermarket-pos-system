
import { CurrencySymbol, CurrencyRate } from '../types/report-types';

export function formatCurrency(
  amount: number | string | undefined,
  selectedCurrency: keyof CurrencyRate,
  currencySymbols: CurrencySymbol,
  currencyRates: CurrencyRate
): string {
  // If amount is undefined or not a valid number, return a default string
  if (amount === undefined) {
    return `${currencySymbols[selectedCurrency]} 0.00`;
  }
  
  // Convert string to number if necessary
  const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  // Check if conversion resulted in a valid number
  if (isNaN(numericAmount)) {
    return `${currencySymbols[selectedCurrency]} 0.00`;
  }
  
  const convertedAmount = numericAmount * currencyRates[selectedCurrency];
  return `${currencySymbols[selectedCurrency]} ${convertedAmount.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`;
}
