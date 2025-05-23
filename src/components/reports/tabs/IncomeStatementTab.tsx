
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ReportTabProps } from '../types/report-types';
import { incomeStatementData } from '../data/mockData';

export const IncomeStatementTab: React.FC<ReportTabProps> = ({ formatCurrency }) => {
  return (
    <Card className="bg-gray-800 border-gray-700 shadow-lg">
      <CardHeader>
        <CardTitle className="text-white">Income Statement (P&L)</CardTitle>
        <CardDescription className="text-gray-400">For period: May 1, 2025 - May 23, 2025</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border border-gray-700 overflow-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-900">
                <TableHead className="text-gray-300">Category</TableHead>
                <TableHead className="text-gray-300 text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {incomeStatementData.map((item, index) => (
                <TableRow key={index} className={`border-gray-700 ${item.category === 'Gross Profit' || item.category === 'Net Income' ? 'bg-gray-700 font-bold' : ''}`}>
                  <TableCell className="text-white">{item.category}</TableCell>
                  <TableCell className={`text-right ${item.amount >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {formatCurrency(item.amount)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="flex justify-end mt-6">
          <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors">
            Export Statement
          </button>
        </div>
      </CardContent>
    </Card>
  );
};
