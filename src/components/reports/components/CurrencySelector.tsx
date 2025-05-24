
import React from 'react';
import { CurrencySymbol } from '../types/report-types';

interface CurrencySelectorProps {
  selectedCurrency: 'USD' | 'KES' | 'EUR' | 'GBP';
  onCurrencyChange: (currency: 'USD' | 'KES' | 'EUR' | 'GBP') => void;
}

export const CurrencySelector: React.FC<CurrencySelectorProps> = ({ 
  selectedCurrency, 
  onCurrencyChange 
}) => {
  return (
    <div className="flex items-center space-x-4">
      <span className="text-gray-400">Currency:</span>
      <select
        value={selectedCurrency}
        onChange={(e) => onCurrencyChange(e.target.value as 'USD' | 'KES' | 'EUR' | 'GBP')}
        className="bg-gray-700 text-white px-3 py-1 rounded border border-gray-600"
      >
        <option value="KES">KES (KSh)</option>
        <option value="USD">USD ($)</option>
        <option value="EUR">EUR (€)</option>
        <option value="GBP">GBP (£)</option>
      </select>
    </div>
  );
};
