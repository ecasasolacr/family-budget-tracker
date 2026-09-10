'use client'

import { formatCurrency } from '@/utils/format'
import { Calendar, Repeat, Trash2, Power } from 'lucide-react'
import { deleteSubscription, toggleSubscriptionStatus } from './actions'
import { CategoryBadge } from '@/components/ui/category-icon'

type Category = {
  id: string
  name: string
  icon: string | null
  color: string | null
}

type Subscription = {
  id: string
  name: string
  amount: number
  billing_period: string
  next_billing_date: string | null
  is_active: boolean
  categories: Category | null
}

const periodLabels: Record<string, string> = {
  weekly: 'Semanal',
  monthly: 'Mensual',
  yearly: 'Anual'
}

export function SubscriptionList({ subscriptions }: { subscriptions: Subscription[] }) {
  if (subscriptions.length === 0) {
    return (
      <div className="text-center py-12 bg-white dark:bg-slate-950 rounded-xl border border-dashed border-slate-300 dark:border-slate-800">
        <Repeat className="w-12 h-12 text-slate-300 mx-auto mb-3" />
        <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100">No hay suscripciones</h3>
        <p className="text-slate-500 mt-1">Agrega tus gastos fijos recurrentes aquí.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {subscriptions.map(sub => (
        <div 
          key={sub.id} 
          className={`flex items-center justify-between p-4 bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm transition-opacity ${!sub.is_active ? 'opacity-60 grayscale-[0.5]' : ''}`}
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center flex-shrink-0">
              <Repeat className={`w-5 h-5 ${sub.is_active ? 'text-indigo-500' : 'text-slate-400'}`} />
            </div>
            
            <div>
              <div className="font-medium text-slate-900 dark:text-slate-100">{sub.name}</div>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-sm text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                  {periodLabels[sub.billing_period] || sub.billing_period}
                </span>
                {sub.categories && (
                  <CategoryBadge 
                    name={sub.categories.name} 
                    icon={sub.categories.icon} 
                    color={sub.categories.color} 
                  />
                )}
                {sub.next_billing_date && (
                  <span className="text-xs text-slate-400 flex items-center gap-1 hidden sm:flex">
                    <Calendar className="w-3 h-3" />
                    {new Date(sub.next_billing_date).toLocaleDateString('es-ES', { month: 'short', day: 'numeric' })}
                  </span>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="font-bold text-slate-900 dark:text-slate-100">
                {formatCurrency(sub.amount / 100)}
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => toggleSubscriptionStatus(sub.id, !sub.is_active)}
                className={`p-2 rounded-md transition-colors ${
                  sub.is_active 
                    ? 'text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/30' 
                    : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
                title={sub.is_active ? "Pausar suscripción" : "Activar suscripción"}
              >
                <Power className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  if(confirm('¿Eliminar esta suscripción?')) {
                    deleteSubscription(sub.id)
                  }
                }}
                className="p-2 text-slate-400 hover:text-red-500 rounded-md hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
                title="Eliminar"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
