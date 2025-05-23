
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ReportTabProps } from '../types/report-types';

export const LedgerTab: React.FC<ReportTabProps> = ({ formatCurrency }) => {
  return (
    <Card className="bg-gray-800 border-gray-700 shadow-lg">
      <CardHeader>
        <CardTitle className="text-white">Account Ledger</CardTitle>
        <CardDescription className="text-gray-400">
          <select className="bg-gray-700 text-white px-3 py-1 rounded border border-gray-600 mt-2">
            <option value="cash">Cash</option>
            <option value="sales">Sales Revenue</option>
            <option value="inventory">Inventory</option>
            <option value="accounts-payable">Accounts Payable</option>
            <option value="expenses">Operating Expenses</option>
          </select>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border border-gray-700 overflow-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-900">
                <TableHead className="text-gray-300">Date</TableHead>
                <TableHead className="text-gray-300">Description</TableHead>
                <TableHead className="text-gray-300 text-right">Debit</TableHead>
                <TableHead className="text-gray-300 text-right">Credit</TableHead>
                <TableHead className="text-gray-300 text-right">Balance</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow className="border-gray-700">
                <TableCell className="text-white">2025-05-21</TableCell>
                <TableCell className="text-white">Opening Balance</TableCell>
                <TableCell className="text-white text-right"></TableCell>
                <TableCell className="text-white text-right"></TableCell>
                <TableCell className="text-white text-right">{formatCurrency(10000)}</TableCell>
              </TableRow>
              <TableRow className="border-gray-700">
                <TableCell className="text-white">2025-05-21</TableCell>
                <TableCell className="text-white">Rent Payment</TableCell>
                <TableCell className="text-white text-right"></TableCell>
                <TableCell className="text-white text-right">{formatCurrency(2000)}</TableCell>
                <TableCell className="text-white text-right">{formatCurrency(8000)}</TableCell>
              </TableRow>
              <TableRow className="border-gray-700">
                <TableCell className="text-white">2025-05-23</TableCell>
                <TableCell className="text-white">Daily Sales</TableCell>
                <TableCell className="text-white text-right">{formatCurrency(12500)}</TableCell>
                <TableCell className="text-white text-right"></TableCell>
                <TableCell className="text-white text-right">{formatCurrency(20500)}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
        <div className="flex justify-end mt-6">
          <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors">
            Export Ledger
          </button>
        </div>
      </CardContent>
    </Card>
  );
};
