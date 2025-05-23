
import React from "react";
import { User } from "@/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { AdminMetric } from "./types/admin-types";
import { TrendingUp, TrendingDown, Users, ShoppingCart, Clock, DollarSign } from "lucide-react";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, LineChart, Line, PieChart, Pie, Cell } from "recharts";

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

const mockRevenueData = [
  { name: "Mon", revenue: 18500 },
  { name: "Tue", revenue: 15000 },
  { name: "Wed", revenue: 22000 },
  { name: "Thu", revenue: 19800 },
  { name: "Fri", revenue: 27500 },
  { name: "Sat", revenue: 32000 },
  { name: "Sun", revenue: 24500 },
];

const mockPaymentMethods = [
  { name: "Cash", value: 45 },
  { name: "Credit Card", value: 30 },
  { name: "Mobile Money", value: 15 },
  { name: "Other", value: 10 },
];

const COLORS = ["#00C853", "#2196F3", "#FFAB00", "#F44336"];

export const Dashboard = ({ user }: DashboardProps) => {
  const metrics: AdminMetric[] = [
    { label: "Active Users", value: 24, change: 2, trend: "up" },
    { label: "Active Sessions", value: 8, change: -1, trend: "down" },
    { label: "Branches Online", value: "5/5", trend: "stable" },
    { label: "Devices Online", value: "18/20", trend: "stable" },
    { label: "Today's Sales", value: "KSH 405,250", change: 12.5, trend: "up" },
    { label: "Stock Alerts", value: 7, change: 2, trend: "up" },
    { label: "Avg. Transaction", value: "KSH 2,850", change: 5.2, trend: "up" },
    { label: "Cash on Hand", value: "KSH 185,000", change: -3.1, trend: "down" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <div className="flex gap-2">
          <Card className="bg-gray-800 border-gray-700 p-2">
            <div className="flex items-center gap-2">
              <Clock className="text-blue-400" size={16} />
              <span className="text-sm text-gray-300">{new Date().toLocaleDateString()}</span>
            </div>
          </Card>
          <Card className="bg-gray-800 border-gray-700 p-2">
            <div className="flex items-center gap-2">
              <Users className="text-green-400" size={16} />
              <span className="text-sm text-gray-300">Welcome, {user.name}</span>
            </div>
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric) => (
          <Card key={metric.label} className="bg-gray-800 border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg text-gray-200 flex items-center justify-between">
                {metric.label}
                {metric.trend === "up" && (
                  <span className="text-green-500">
                    <TrendingUp className="h-4 w-4" />
                  </span>
                )}
                {metric.trend === "down" && (
                  <span className="text-red-500">
                    <TrendingDown className="h-4 w-4" />
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

      <Tabs defaultValue="sales" className="w-full">
        <TabsList className="bg-gray-700 border border-gray-600 mb-4">
          <TabsTrigger value="sales">Sales Performance</TabsTrigger>
          <TabsTrigger value="activity">User Activity</TabsTrigger>
          <TabsTrigger value="financial">Financial Overview</TabsTrigger>
        </TabsList>

        <TabsContent value="sales" className="space-y-6">
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
                <CardTitle className="text-white">Weekly Revenue Trend</CardTitle>
                <CardDescription className="text-gray-400">
                  Last 7 days revenue
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={mockRevenueData}>
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
                      formatter={(value: number) => [`KSH ${value.toLocaleString()}`, "Revenue"]}
                      contentStyle={{ backgroundColor: "#1E1E1E", borderColor: "#2E2E2E" }}
                      labelStyle={{ color: "#E0E0E0" }}
                    />
                    <Line
                      type="monotone"
                      dataKey="revenue"
                      stroke="#2196F3"
                      strokeWidth={2}
                      dot={{ fill: "#2196F3", r: 4 }}
                      activeDot={{ fill: "#2196F3", r: 6, stroke: "#0D47A1", strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Payment Methods Distribution</CardTitle>
              <CardDescription className="text-gray-400">
                Transaction breakdown by payment type
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              <div className="w-full max-w-md h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={mockPaymentMethods}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {mockPaymentMethods.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value) => [`${value}%`, "Percentage"]}
                      contentStyle={{ backgroundColor: "#1E1E1E", borderColor: "#2E2E2E" }}
                      labelStyle={{ color: "#E0E0E0" }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity">
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
        </TabsContent>

        <TabsContent value="financial">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Financial Overview</CardTitle>
              <CardDescription className="text-gray-400">
                Summary of financial performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-gray-700 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="text-green-400" size={20} />
                    <h3 className="text-white font-medium">Revenue</h3>
                  </div>
                  <p className="text-2xl font-bold text-white">KSH 1,250,000</p>
                  <p className="text-green-400 text-sm">+15% from last month</p>
                </div>
                <div className="bg-gray-700 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <ShoppingCart className="text-blue-400" size={20} />
                    <h3 className="text-white font-medium">Transactions</h3>
                  </div>
                  <p className="text-2xl font-bold text-white">2,456</p>
                  <p className="text-blue-400 text-sm">+8% from last month</p>
                </div>
                <div className="bg-gray-700 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="text-amber-400" size={20} />
                    <h3 className="text-white font-medium">Customer Count</h3>
                  </div>
                  <p className="text-2xl font-bold text-white">1,893</p>
                  <p className="text-amber-400 text-sm">+12% from last month</p>
                </div>
              </div>
              <div className="text-center">
                <p className="text-gray-400">Full financial reports available in the Reports module</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
