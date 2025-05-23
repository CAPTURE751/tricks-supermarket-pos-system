
import React from 'react';
import { CashSession } from '../types/cash-types';
import { Button } from "@/components/ui/button";

interface ClosedSessionsTableProps {
  sessions: CashSession[];
}

export const ClosedSessionsTable = ({ sessions }: ClosedSessionsTableProps) => {
  if (sessions.length === 0) {
    return <p className="text-gray-400 text-center py-8">No closed sessions</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left text-white">
        <thead className="text-xs uppercase bg-gray-700">
          <tr>
            <th className="px-4 py-3">Register</th>
            <th className="px-4 py-3">Cashier</th>
            <th className="px-4 py-3">Date</th>
            <th className="px-4 py-3">Duration</th>
            <th className="px-4 py-3">Sales</th>
            <th className="px-4 py-3">Expected</th>
            <th className="px-4 py-3">Actual</th>
            <th className="px-4 py-3">Difference</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {sessions.map(session => {
            const openTime = new Date(session.openingTime);
            const closeTime = session.closingTime ? new Date(session.closingTime) : new Date();
            const duration = Math.round((closeTime.getTime() - openTime.getTime()) / (1000 * 60 * 60));
            
            return (
              <tr key={session.id} className="border-b border-gray-700 bg-gray-800 hover:bg-gray-700">
                <td className="px-4 py-3">{session.registerName}</td>
                <td className="px-4 py-3">{session.cashierName}</td>
                <td className="px-4 py-3">{new Date(session.openingTime).toLocaleDateString()}</td>
                <td className="px-4 py-3">{duration} hours</td>
                <td className="px-4 py-3">{session.salesTotal.toLocaleString()}</td>
                <td className="px-4 py-3">{session.expectedClosingAmount?.toLocaleString()}</td>
                <td className="px-4 py-3">{session.actualClosingAmount?.toLocaleString()}</td>
                <td className={`px-4 py-3 ${session.discrepancyAmount === 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {session.discrepancyAmount?.toLocaleString()}
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    session.discrepancyStatus === 'none' ? 'bg-green-500/20 text-green-400' :
                    session.discrepancyStatus === 'minor' ? 'bg-yellow-500/20 text-yellow-400' :
                    session.discrepancyStatus === 'significant' ? 'bg-orange-500/20 text-orange-400' :
                    'bg-red-500/20 text-red-400'
                  }`}>
                    {session.discrepancyStatus}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <Button variant="outline" size="sm">View Report</Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
