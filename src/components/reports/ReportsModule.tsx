
import { useState } from 'react';
import { User } from '@/hooks/useAuth';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { formatCurrency as formatCurrencyUtil } from './utils/formatCurrency';
import { currencyRates, currencySymbols } from './data/mockData';
import { CurrencySelector } from './components/CurrencySelector';
import { JournalEntriesTab } from './tabs/JournalEntriesTab';
import { IncomeStatementTab } from './tabs/IncomeStatementTab';
import { BalanceSheetTab } from './tabs/BalanceSheetTab';
import { LedgerTab } from './tabs/LedgerTab';
import { ChartTab } from './tabs/ChartTab';

interface ReportsModuleProps {
  user: User;
}

export const ReportsModule = ({ user }: ReportsModuleProps) => {
  const [selectedCurrency, setSelectedCurrency] = useState<'USD' | 'KES' | 'EUR' | 'GBP'>('KES');

  const formatCurrency = (amount: number | string | undefined): string => {
    return formatCurrencyUtil(amount, selectedCurrency, currencySymbols, currencyRates);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-white text-2xl font-bold">Reports & Analytics</h2>
        <CurrencySelector 
          selectedCurrency={selectedCurrency}
          onCurrencyChange={setSelectedCurrency}
        />
      </div>

      <Tabs defaultValue="journal" className="w-full">
        <TabsList className="bg-gray-700 text-white">
          <TabsTrigger value="journal">Journal Entries</TabsTrigger>
          <TabsTrigger value="income">Income Statement</TabsTrigger>
          <TabsTrigger value="balance">Balance Sheet</TabsTrigger>
          <TabsTrigger value="ledger">Ledger</TabsTrigger>
          <TabsTrigger value="chart">Financial Charts</TabsTrigger>
        </TabsList>

        <TabsContent value="journal">
          <JournalEntriesTab formatCurrency={formatCurrency} />
        </TabsContent>

        <TabsContent value="income">
          <IncomeStatementTab formatCurrency={formatCurrency} />
        </TabsContent>

        <TabsContent value="balance">
          <BalanceSheetTab formatCurrency={formatCurrency} />
        </TabsContent>

        <TabsContent value="ledger">
          <LedgerTab formatCurrency={formatCurrency} />
        </TabsContent>

        <TabsContent value="chart">
          <ChartTab formatCurrency={formatCurrency} />
        </TabsContent>
      </Tabs>

      <p className="text-gray-400 text-sm">User: {user.name} ({user.role})</p>
    </div>
  );
};
