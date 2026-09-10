'use client'

import { formatCurrency } from '@/utils/format'
import { CategoryBadge } from '@/components/ui/category-icon'

type TopExpense = {
  id: string
  amount: number
  date: string
  description: string | null
  categories: { id: string, name: string, color: string | null, icon: string | null } | null
  users: { email: string } | null
}

export function TopExpensesList({ expenses }: { expenses: TopExpense[] }) {
  if (!expenses || expenses.length === 0) {
    return (
      <div className="text-sm text-slate-500 py-4 text-center">
        No hay gastos registrados este mes.
      </div>
    )
  }

  // Sort by amount descending and take top 3
  const topExpenses = [...expenses].sort((a, b) => b.amount - a.amount).slice(0, 3)

  return (
    <div className="space-y-4">
      {topExpenses.map((expense, index) => {
        const cat = expense.categories || { id: 'unknown', name: 'Sin categoría', color: null, icon: null }
        const dateObj = new Date(expense.date + 'T00:00:00')
        
        return (
          <div key={expense.id} className="flex items-center justify-between p-3 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-6 text-sm font-bold text-slate-400">
                #{index + 1}
              </div>
              <div className="flex flex-col gap-1">
                <span className="font-medium text-slate-800 dark:text-slate-100 text-sm">
                  {expense.description || cat.name}
                </span>
                <div className="flex items-center gap-2">
                  <CategoryBadge name={cat.name} icon={cat.icon} color={cat.color} className="scale-90 origin-left" />
                  <span className="text-xs text-slate-500">
                    {dateObj.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}
                  </span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <span className="font-bold text-slate-800 dark:text-slate-100">
                {formatCurrency(expense.amount)}
              </span>
            </div>
          </div>
        )
      })}
    </div>
  )
}
