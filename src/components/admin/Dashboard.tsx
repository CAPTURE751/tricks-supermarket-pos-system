
import React from "react";
import { User } from "@/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { AdminMetric } from "./types/admin-types";
import { trendingUp, trendingDown } from "lucide-react";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";

interface DashboardProps {
  user: User;
}

const mockSalesByBranch = [
  { name: "Main Branch", sales: 125000 },
  { name: "Downtown", sales: 95000 },
  { name: "Westside Mall", sales: 85000 },
  { name: "Airport Shop", sales: 55000 },
  { name: "East End", sales: 45000 },
];

const mockUserActivity = [
  { name: "Jeff Tricks", role: "Admin", actions: 245 },
  { name: "Jane Doe", role: "Manager", actions: 186 },
  { name: "John Smith", role: "Cashier", actions: 352 },
  { name: "Mary Johnson", role: "Accountant", actions: 97 },
  { name: "Bob Williams", role: "Stock Controller", actions: 124 },
];

export const Dashboard = ({ user }: DashboardProps) => {
  const metrics: AdminMetric[] = [
    { label: "Active Users", value: 24, change: 2, trend: "up" },
    { label: "Active Sessions", value: 8, change: -1, trend: "down" },
    { label: "Branches Online", value: "5/5", trend: "stable" },
    { label: "Devices Online", value: "18/20", trend: "stable" },
    { label: "Today's Sales", value: "KSH 405,250", change: 12.5, trend: "up" },
    { label: "Stock Alerts", value: 7, change: 2, trend: "up" },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {metrics.map((metric) => (
          <Card key={metric.label} className="bg-gray-800 border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg text-gray-200 flex items-center justify-between">
                {metric.label}
                {metric.trend === "up" && (
                  <span className="text-green-500">
                    <trendingUp className="h-4 w-4" />
                  </span>
                )}
                {metric.trend === "down" && (
                  <span className="text-red-500">
                    <trendingDown className="h-4 w-4" />
                  </span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{metric.value}</div>
              {metric.change !== undefined && (
                <p className={`text-sm ${metric.trend === "up" ? "text-green-500" : metric.trend === "down" ? "text-red-500" : "text-gray-400"}`}>
                  {metric.change > 0 ? "+" : ""}
                  {metric.change}% from yesterday
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Sales by Branch</CardTitle>
            <CardDescription className="text-gray-400">
              Last 30 days performance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={mockSalesByBranch}>
                <XAxis
                  dataKey="name"
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `KSH ${value / 1000}k`}
                />
                <Tooltip
                  formatter={(value: number) => [`KSH ${value.toLocaleString()}`, "Sales"]}
                  contentStyle={{ backgroundColor: "#1E1E1E", borderColor: "#2E2E2E" }}
                  labelStyle={{ color: "#E0E0E0" }}
                />
                <Bar dataKey="sales" fill="#00C853" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Top User Activity</CardTitle>
            <CardDescription className="text-gray-400">
              User actions in the last 7 days
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={mockUserActivity} layout="vertical">
                <XAxis type="number" stroke="#888888" fontSize={12} />
                <YAxis
                  dataKey="name"
                  type="category"
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  formatter={(value: number) => [`${value} actions`, "Activity"]}
                  contentStyle={{ backgroundColor: "#1E1E1E", borderColor: "#2E2E2E" }}
                  labelStyle={{ color: "#E0E0E0" }}
                />
                <Bar dataKey="actions" fill="#FFAB00" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
