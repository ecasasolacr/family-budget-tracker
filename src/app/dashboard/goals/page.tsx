import { createClient } from '@/utils/supabase/server'
import { GoalForm } from './GoalForm'
import { GoalList } from './GoalList'

export default async function GoalsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return null

  // Fetch goals
  const { data: goals } = await supabase
    .from('savings_goals')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Metas de Ahorro</h1>
        <p className="text-slate-500">Establece objetivos y visualiza tu progreso.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <GoalForm />
        </div>
        <div className="lg:col-span-2">
          <GoalList goals={goals || []} />
        </div>
      </div>
    </div>
  )
}
