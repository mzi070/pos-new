import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { DailySales, CategorySales } from '@/utils/analytics';

interface RevenueChartProps {
  data: DailySales[];
}

export function DailySalesChart({ data }: RevenueChartProps) {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="font-semibold mb-4">Daily Revenue</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="revenue" stroke="#0284c7" name="Revenue" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export function TransactionCountChart({ data }: RevenueChartProps) {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="font-semibold mb-4">Daily Transactions</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="transactions" fill="#0284c7" name="Transactions" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function CategorySalesChart({ data }: { data: CategorySales[] }) {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="font-semibold mb-4">Sales by Category</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" />
          <YAxis dataKey="category" type="category" width={100} />
          <Tooltip />
          <Bar dataKey="revenue" fill="#0284c7" name="Revenue" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
