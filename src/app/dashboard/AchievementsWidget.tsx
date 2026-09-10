import { createClient } from '@/utils/supabase/server'
import { Trophy, Star, TrendingUp, PiggyBank, Target, Flame } from 'lucide-react'

// Define the static list of possible badges
const BADGES = [
  { id: 'first_expense', name: 'Primer Paso', description: 'Registra tu primer gasto.', icon: Star, color: 'text-yellow-500', bg: 'bg-yellow-100 dark:bg-yellow-900/30' },
  { id: 'first_budget', name: 'Planificador', description: 'Crea tu primer presupuesto.', icon: PiggyBank, color: 'text-emerald-500', bg: 'bg-emerald-100 dark:bg-emerald-900/30' },
  { id: 'first_goal', name: 'Visionario', description: 'Establece una meta de ahorro.', icon: Target, color: 'text-blue-500', bg: 'bg-blue-100 dark:bg-blue-900/30' },
  { id: 'savings_master', name: 'Maestro del Ahorro', description: 'Alcanza el 100% de una meta.', icon: Trophy, color: 'text-purple-500', bg: 'bg-purple-100 dark:bg-purple-900/30' },
  { id: 'streak_7', name: 'Racha de 7 días', description: 'Registra gastos por 7 días seguidos.', icon: Flame, color: 'text-orange-500', bg: 'bg-orange-100 dark:bg-orange-900/30' },
]

export async function AchievementsWidget() {
  const supabase = await createClient()

  const { data: familyMembers } = await supabase
    .from('family_members')
    .select('family_id')
    .limit(1)
    .single()

  const familyId = familyMembers?.family_id

  const { data: unlockedBadges } = await supabase
    .from('family_badges')
    .select('badge_type, unlocked_at')
    .eq('family_id', familyId)

  const unlockedSet = new Set(unlockedBadges?.map(b => b.badge_type) || [])

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        {BADGES.map(badge => {
          const isUnlocked = unlockedSet.has(badge.id)
          const Icon = badge.icon

          return (
            <div 
              key={badge.id}
              className={`p-3 rounded-xl border flex flex-col items-center text-center transition-all ${
                isUnlocked 
                  ? 'bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 shadow-sm' 
                  : 'bg-slate-50 dark:bg-slate-900/50 border-dashed border-slate-200 dark:border-slate-800 opacity-60 grayscale'
              }`}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${isUnlocked ? badge.bg : 'bg-slate-200 dark:bg-slate-800'}`}>
                <Icon className={`w-5 h-5 ${isUnlocked ? badge.color : 'text-slate-400'}`} />
              </div>
              <div className="font-semibold text-sm text-slate-800 dark:text-slate-200">{badge.name}</div>
              <div className="text-[10px] text-slate-500 mt-0.5 leading-tight">{badge.description}</div>
              
              {isUnlocked && (
                <div className="text-[9px] font-medium text-emerald-600 dark:text-emerald-400 mt-2 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-0.5 rounded-full">
                  ¡Desbloqueado!
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
