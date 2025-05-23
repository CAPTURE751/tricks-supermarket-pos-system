
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ReportTabProps } from '../types/report-types';
import { journalEntries } from '../data/mockData';

export const JournalEntriesTab: React.FC<ReportTabProps> = ({ formatCurrency }) => {
  return (
    <Card className="bg-gray-800 border-gray-700 shadow-lg">
      <CardHeader>
        <CardTitle className="text-white">Journal Entries</CardTitle>
        <CardDescription className="text-gray-400">Daily journal entries for accounting purposes</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border border-gray-700 overflow-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-900">
                <TableHead className="text-gray-300">Date</TableHead>
                <TableHead className="text-gray-300">Description</TableHead>
                <TableHead className="text-gray-300">Account</TableHead>
                <TableHead className="text-gray-300 text-right">Debit</TableHead>
                <TableHead className="text-gray-300 text-right">Credit</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {journalEntries.map((entry) => (
                <TableRow key={entry.id} className="border-gray-700">
                  <TableCell className="text-white">{entry.date}</TableCell>
                  <TableCell className="text-white">{entry.description}</TableCell>
                  <TableCell className="text-white">{entry.account}</TableCell>
                  <TableCell className="text-white text-right">
                    {entry.debit > 0 ? formatCurrency(entry.debit) : ''}
                  </TableCell>
                  <TableCell className="text-white text-right">
                    {entry.credit > 0 ? formatCurrency(entry.credit) : ''}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="flex justify-between mt-6">
          <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md transition-colors">
            Add Manual Entry
          </button>
          <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors">
            Export Journal
          </button>
        </div>
      </CardContent>
    </Card>
  );
};
