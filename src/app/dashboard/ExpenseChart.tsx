'use client'

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'
import { formatCurrency } from '@/utils/format'

type ChartData = {
  name: string
  value: number
  color: string
  icon: string | null
}

import { CategoryBadge } from '@/components/ui/category-icon'

export function ExpenseChart({ data }: { data: ChartData[] }) {
  if (!data || data.length === 0) {
    return (
      <div className="h-[300px] flex items-center justify-center text-slate-500">
        No hay datos suficientes para mostrar el gráfico.
      </div>
    )
  }

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color || '#94a3b8'} />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value: any) => [formatCurrency(value), 'Gastado']}
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
          />
          <Legend 
            content={(props) => {
              const { payload } = props;
              return (
                <ul className="flex flex-wrap justify-center gap-4 mt-4">
                  {payload?.map((entry, index) => {
                    const dataEntry = data.find(d => d.name === entry.value);
                    return (
                      <li key={`item-${index}`} className="flex items-center">
                        <CategoryBadge 
                          name={entry.value as string} 
                          icon={dataEntry?.icon || null} 
                          color={entry.color}
                          className="text-sm text-slate-700 dark:text-slate-300"
                        />
                      </li>
                    )
                  })}
                </ul>
              );
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
