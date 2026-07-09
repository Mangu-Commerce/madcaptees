import { useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import type { Order } from '@/types';

interface AdminOrdersChartProps {
  orders: Order[];
}

export function AdminOrdersChart({ orders }: AdminOrdersChartProps) {
  const data = useMemo(() => {
    const days: { date: string; orders: number; revenue: number }[] = [];
    const now = new Date();

    for (let i = 29; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      const label = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      const dayOrders = orders.filter((o) => o.created_at.slice(0, 10) === key);
      const revenue = dayOrders
        .filter((o) => ['paid', 'shipped', 'delivered'].includes(o.status))
        .reduce((s, o) => s + o.total_amount, 0);
      days.push({ date: label, orders: dayOrders.length, revenue });
    }
    return days;
  }, [orders]);

  const totalOrders = orders.length;
  const totalRevenue = orders
    .filter((o) => ['paid', 'shipped', 'delivered'].includes(o.status))
    .reduce((s, o) => s + o.total_amount, 0);

  return (
    <div className="bg-white border border-[#0A0A0A]/15 p-6 mb-8">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
        <div>
          <h3
            className="text-sm uppercase tracking-wider text-[#64748B]"
            style={{ fontFamily: "'Space Mono', monospace" }}
          >
            Orders — Last 30 Days
          </h3>
          <p className="text-2xl font-bold text-[#0A0A0A] mt-1" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            {totalOrders} orders · ${totalRevenue.toFixed(2)} revenue
          </p>
        </div>
      </div>

      <div className="h-56 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#0A0A0A10" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 10, fill: '#64748B' }}
              interval="preserveStartEnd"
            />
            <YAxis allowDecimals={false} tick={{ fontSize: 10, fill: '#64748B' }} />
            <Tooltip
              contentStyle={{
                fontFamily: 'DM Sans, sans-serif',
                fontSize: 12,
                border: '1px solid #0A0A0A20',
              }}
              formatter={(value: number, name: string) => [
                name === 'revenue' ? `$${value.toFixed(2)}` : value,
                name === 'revenue' ? 'Revenue' : 'Orders',
              ]}
            />
            <Bar dataKey="orders" fill="#C41E3A" radius={[2, 2, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
