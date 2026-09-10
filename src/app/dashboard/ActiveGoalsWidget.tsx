import { createClient } from '@/utils/supabase/server'
import { formatCurrency } from '@/utils/format'
import { Trophy, Target } from 'lucide-react'
import Link from 'next/link'

export async function ActiveGoalsWidget() {
  const supabase = await createClient()

  const { data: goals } = await supabase
    .from('savings_goals')
    .select('id, name, target_amount, current_amount')
    .order('created_at', { ascending: false })
    .limit(3)

  if (!goals || goals.length === 0) {
    return (
      <div className="text-center py-6">
        <Target className="w-8 h-8 text-slate-300 mx-auto mb-2" />
        <p className="text-sm text-slate-500">No hay metas activas.</p>
        <Link href="/dashboard/goals" className="text-xs text-blue-600 hover:underline mt-2 inline-block">
          Crear una meta
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {goals.map(goal => {
        const progress = Math.min(100, Math.round((goal.current_amount / goal.target_amount) * 100))
        const isCompleted = goal.current_amount >= goal.target_amount

        return (
          <div key={goal.id} className="relative">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
                {isCompleted && <Trophy className="w-3 h-3 text-yellow-500" />}
                {goal.name}
              </span>
              <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                {progress}%
              </span>
            </div>
            <div className="relative h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mb-1">
              <div 
                className={`absolute top-0 left-0 h-full rounded-full transition-all ${
                  isCompleted 
                    ? 'bg-gradient-to-r from-yellow-400 to-yellow-500' 
                    : 'bg-gradient-to-r from-blue-400 to-indigo-500'
                }`}
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="text-[10px] text-right text-slate-500">
              {formatCurrency(goal.current_amount / 100)} / {formatCurrency(goal.target_amount / 100)}
            </div>
          </div>
        )
      })}
      
      <div className="pt-2 text-center">
        <Link href="/dashboard/goals" className="text-xs text-blue-600 dark:text-blue-400 hover:underline">
          Ver todas las metas &rarr;
        </Link>
      </div>
    </div>
  )
}
