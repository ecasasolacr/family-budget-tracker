'use client'

import { formatCurrency } from '@/utils/format'
import { CategoryBadge } from '@/components/ui/category-icon'

type BudgetData = {
  categoryId: string
  name: string
  icon: string | null
  color: string | null
  budgeted: number
  spent: number
}

export function BudgetProgress({ data }: { data: BudgetData[] }) {
  if (!data || data.length === 0) {
    return (
      <div className="text-sm text-slate-500 py-4 text-center">
        No hay presupuestos definidos para este mes.
      </div>
    )
  }

  // Sort by percentage spent (highest first)
  const sortedData = [...data].sort((a, b) => {
    const pctA = a.budgeted > 0 ? a.spent / a.budgeted : 0
    const pctB = b.budgeted > 0 ? b.spent / b.budgeted : 0
    return pctB - pctA
  })

  return (
    <div className="space-y-5">
      {sortedData.map((item) => {
        const percentage = item.budgeted > 0 ? Math.min(Math.round((item.spent / item.budgeted) * 100), 100) : 0
        const isOverBudget = item.spent > item.budgeted
        const remaining = item.budgeted - item.spent

        // Decide progress bar color based on percentage
        let progressColor = 'bg-emerald-500'
        if (isOverBudget) {
          progressColor = 'bg-red-500'
        } else if (percentage > 85) {
          progressColor = 'bg-amber-500'
        }

        return (
          <div key={item.categoryId} className="space-y-1.5">
            <div className="flex justify-between items-center text-sm">
              <div className="flex items-center gap-2">
                <CategoryBadge name={item.name} icon={item.icon} color={item.color} />
              </div>
              <div className="text-right flex flex-col">
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  {formatCurrency(item.spent)} <span className="text-slate-400 text-xs font-normal">/ {formatCurrency(item.budgeted)}</span>
                </span>
              </div>
            </div>
            
            <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div 
                className={`h-full ${progressColor} transition-all duration-500`} 
                style={{ width: `${percentage}%` }}
              />
            </div>
            
            <div className="flex justify-between text-xs">
              <span className="text-slate-500">{percentage}%</span>
              <span className={isOverBudget ? 'text-red-500 font-medium' : 'text-slate-500'}>
                {isOverBudget ? `Sobrepasado por ${formatCurrency(Math.abs(remaining))}` : `${formatCurrency(remaining)} restantes`}
              </span>
            </div>
          </div>
        )
      })}
    </div>
  )
}
