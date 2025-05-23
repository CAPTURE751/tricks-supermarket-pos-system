
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ReportTabProps } from '../types/report-types';
import { balanceSheetData } from '../data/mockData';

export const BalanceSheetTab: React.FC<ReportTabProps> = ({ formatCurrency }) => {
  return (
    <Card className="bg-gray-800 border-gray-700 shadow-lg">
      <CardHeader>
        <CardTitle className="text-white">Balance Sheet</CardTitle>
        <CardDescription className="text-gray-400">As of May 23, 2025</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Assets Section */}
          <div className="rounded-md border border-gray-700 overflow-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-900">
                  <TableHead className="text-gray-300" colSpan={2}>Assets</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {balanceSheetData.assets.map((item, index) => (
                  <TableRow key={index} className={`border-gray-700 ${item.item === 'Total Assets' ? 'bg-gray-700 font-bold' : ''}`}>
                    <TableCell className="text-white">{item.item}</TableCell>
                    <TableCell className="text-right text-green-400">
                      {formatCurrency(item.amount)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Liabilities & Equity Section */}
          <div className="space-y-6">
            <div className="rounded-md border border-gray-700 overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-900">
                    <TableHead className="text-gray-300" colSpan={2}>Liabilities</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {balanceSheetData.liabilities.map((item, index) => (
                    <TableRow key={index} className={`border-gray-700 ${item.item === 'Total Liabilities' ? 'bg-gray-700 font-bold' : ''}`}>
                      <TableCell className="text-white">{item.item}</TableCell>
                      <TableCell className="text-right text-red-400">
                        {formatCurrency(item.amount)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="rounded-md border border-gray-700 overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-900">
                    <TableHead className="text-gray-300" colSpan={2}>Equity</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {balanceSheetData.equity.map((item, index) => (
                    <TableRow key={index} className={`border-gray-700 ${item.item === 'Total Equity' ? 'bg-gray-700 font-bold' : ''}`}>
                      <TableCell className="text-white">{item.item}</TableCell>
                      <TableCell className="text-right text-purple-400">
                        {formatCurrency(item.amount)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
        <div className="flex justify-end mt-6">
          <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors">
            Export Balance Sheet
          </button>
        </div>
      </CardContent>
    </Card>
  );
};
