
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ChartContainer } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ReportTabProps } from '../types/report-types';
import { chartData } from '../data/mockData';

type TooltipPayloadItem = {
  value: number | string;
  name: string;
  dataKey: string;
};

export const ChartTab: React.FC<ReportTabProps> = ({ formatCurrency }) => {
  return (
    <Card className="bg-gray-800 border-gray-700 shadow-lg">
      <CardHeader>
        <CardTitle className="text-white">Financial Performance</CardTitle>
        <CardDescription className="text-gray-400">Revenue vs. Expenses (2025)</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ChartContainer
            config={{
              revenue: { color: "#22C55E" },
              expenses: { color: "#EF4444" },
            }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#D1D5DB" />
                <YAxis stroke="#D1D5DB" />
                <Tooltip 
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="rounded-lg border bg-gray-900 p-2 shadow-md border-gray-800">
                          <div className="grid grid-cols-2 gap-2">
                            <div className="flex flex-col">
                              <span className="text-[0.70rem] uppercase text-gray-400">
                                Revenue
                              </span>
                              <span className="font-bold text-green-500">
                                {formatCurrency((payload[0] as TooltipPayloadItem)?.value)}
                              </span>
                            </div>
                            <div className="flex flex-col">
                              <span className="text-[0.70rem] uppercase text-gray-400">
                                Expenses
                              </span>
                              <span className="font-bold text-red-500">
                                {formatCurrency((payload[1] as TooltipPayloadItem)?.value)}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend />
                <Bar dataKey="revenue" fill="#22C55E" name="Revenue" />
                <Bar dataKey="expenses" fill="#EF4444" name="Expenses" />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
};
