'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { formatCurrency } from '@/utils/format'
import { useMemo } from 'react'

type DailyData = {
  date: string
  amount: number
}

export function DailyExpenseChart({ data }: { data: DailyData[] }) {
  // Sort data by date just in case
  const sortedData = useMemo(() => {
    return [...data].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  }, [data])

  if (!data || data.length === 0) {
    return (
      <div className="h-[250px] flex items-center justify-center text-slate-500">
        No hay gastos este mes para mostrar.
      </div>
    )
  }

  // Calculate a nice domain for Y axis
  const maxAmount = Math.max(...sortedData.map(d => d.amount))
  const yDomain = [0, maxAmount * 1.1] // 10% padding on top

  return (
    <div className="h-[250px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={sortedData}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
          <XAxis 
            dataKey="date" 
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: '#64748b' }}
            tickFormatter={(value) => {
              // Parse 'YYYY-MM-DD' and return 'DD' or 'DD MMM'
              try {
                const date = new Date(value + 'T00:00:00');
                return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' }).replace('.', '');
              } catch (e) {
                return value;
              }
            }}
          />
          <YAxis 
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: '#64748b' }}
            domain={yDomain}
            tickFormatter={(value) => `₡${(value / 1000).toFixed(0)}k`}
          />
          <Tooltip 
            cursor={{ fill: '#f1f5f9' }}
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            labelFormatter={(label) => {
              try {
                const date = new Date(label as string + 'T00:00:00');
                return date.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' });
              } catch (e) {
                return label;
              }
            }}
            formatter={(value: number) => [formatCurrency(value), 'Gastado']}
          />
          <Bar 
            dataKey="amount" 
            fill="#10b981" 
            radius={[4, 4, 0, 0]} 
            maxBarSize={40}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
