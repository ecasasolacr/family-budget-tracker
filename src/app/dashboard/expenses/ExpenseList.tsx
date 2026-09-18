'use client'

import { useState } from 'react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { Trash2, Edit2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { deleteExpense } from './actions'
import { formatCurrency } from '@/utils/format'
import { CategoryIcon } from '@/components/ui/category-icon'
import { EditExpenseDialog } from './EditExpenseDialog'

type Expense = {
  id: string
  amount: number
  date: string
  description: string | null
  categories: {
    id: string
    name: string
    icon: string | null
    color: string | null
  } | null
  users: {
    email: string
  } | null
  expense_tags?: {
    tags: {
      id: string
      name: string
      color: string | null
    } | null
  }[]
}

export function ExpenseList({ expenses, categories, tags }: { expenses: any[], categories?: any[], tags?: any[] }) {
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null)

  async function handleDelete(id: string) {
    if (!confirm('¿Estás seguro de eliminar este gasto?')) return
    setDeletingId(id)
    await deleteExpense(id)
    setDeletingId(null)
  }

  if (expenses.length === 0) {
    return (
      <div className="text-center py-10 text-slate-500">
        No hay gastos registrados aún.
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {expenses.map((expense: Expense) => (
        <div 
          key={expense.id} 
          className="flex items-center justify-between p-4 rounded-lg border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-sm"
        >
          <div className="flex items-center gap-4">
            <div 
              className="w-10 h-10 rounded-full flex items-center justify-center text-white shadow-sm flex-shrink-0"
              style={{ backgroundColor: expense.categories?.color || '#e2e8f0' }}
            >
              <CategoryIcon iconName={expense.categories?.icon} className="w-5 h-5" />
            </div>
            <div>
              <div className="font-medium text-slate-900 dark:text-slate-100">
                {expense.categories?.name || 'Sin categoría'}
              </div>
              <div className="text-sm text-slate-500 flex flex-wrap items-center gap-2">
                <span>{format(new Date(expense.date), "d 'de' MMMM, yyyy", { locale: es })}</span>
                {expense.description && (
                  <>
                    <span>•</span>
                    <span className="truncate max-w-[150px] sm:max-w-xs">{expense.description}</span>
                  </>
                )}
                {expense.expense_tags && expense.expense_tags.length > 0 && (
                  <>
                    <span className="hidden sm:inline">•</span>
                    <div className="flex flex-wrap gap-1">
                      {expense.expense_tags.map((et: any) => {
                        const tag = et.tags
                        if (!tag) return null
                        return (
                          <span 
                            key={tag.id}
                            className="text-[10px] px-1.5 py-0.5 rounded-sm border"
                            style={tag.color ? { borderColor: tag.color, color: tag.color } : { borderColor: '#cbd5e1', color: '#64748b' }}
                          >
                            {tag.name}
                          </span>
                        )
                      })}
                    </div>
                  </>
                )}
              </div>
              <div className="text-xs text-slate-400 mt-1">
                Registrado por: {expense.users?.email}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="font-bold text-lg text-slate-900 dark:text-slate-100">
              {formatCurrency(expense.amount)}
            </div>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="text-slate-400 hover:text-blue-500"
                onClick={() => setEditingExpense(expense)}
              >
                <Edit2 className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-slate-400 hover:text-red-500"
                disabled={deletingId === expense.id}
                onClick={() => handleDelete(expense.id)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      ))}

      {editingExpense && (
        <EditExpenseDialog 
          expense={editingExpense} 
          categories={categories || []} 
          tags={tags || []}
          open={!!editingExpense}
          onOpenChange={(open) => !open && setEditingExpense(null)}
          onSuccess={() => setEditingExpense(null)}
        />
      )}
    </div>
  )
}
