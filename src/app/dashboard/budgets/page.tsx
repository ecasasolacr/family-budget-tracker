import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { BudgetForm } from './BudgetForm'
import { formatCurrency } from '@/utils/format'
import { CategoryBadge } from '@/components/ui/category-icon'

export default async function BudgetsPage(props: { searchParams: Promise<{ month?: string; year?: string }> }) {
  const searchParams = await props.searchParams;
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: familyMember } = await supabase
    .from('family_members')
    .select('family_id, role')
    .eq('user_id', user.id)
    .single()
    
  if (!familyMember) redirect('/onboarding')
  
  const isAdmin = familyMember.role === 'admin'

  const date = new Date()
  const currentMonth = parseInt(searchParams.month || String(date.getMonth() + 1), 10)
  const currentYear = parseInt(searchParams.year || String(date.getFullYear()), 10)

  // Get active categories
  const { data: categories } = await supabase
    .from('categories')
    .select('id, name, color, icon')
    .eq('family_id', familyMember.family_id)
    .eq('is_active', true)
    .order('name')

  // Get budgets for this month
  const { data: budgets } = await supabase
    .from('budgets')
    .select('category_id, amount_limit')
    .eq('family_id', familyMember.family_id)
    .eq('month', currentMonth)
    .eq('year', currentYear)

  const budgetsMap = new Map(budgets?.map(b => [b.category_id, b.amount_limit]))

  const monthsEs = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
          Presupuestos
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Establece límites de gastos para {monthsEs[currentMonth - 1]} {currentYear}.
        </p>
      </div>
      
      {(!categories || categories.length === 0) ? (
        <div className="text-center p-8 text-slate-500 bg-white dark:bg-slate-900 rounded-lg border border-dashed border-slate-300 dark:border-slate-700">
          No tienes categorías activas. Crea una en la sección de Categorías primero.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {categories.map(cat => {
            const amountCents = budgetsMap.get(cat.id) || 0
            const amountFormatted = formatCurrency(amountCents)
            const isSet = amountCents > 0

            return (
              <Card key={cat.id} className={isSet ? 'border-emerald-200 bg-emerald-50/50 dark:border-emerald-900/50 dark:bg-emerald-950/20' : ''}>
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <CategoryBadge 
                      name={cat.name} 
                      icon={cat.icon} 
                      color={cat.color} 
                      className="font-semibold text-slate-800 dark:text-slate-100" 
                    />
                    <p className="text-xl font-bold text-slate-600 dark:text-slate-300 mt-1">
                      {isSet ? formatCurrency(amountCents) : 'Sin límite'}
                    </p>
                  </div>
                  {isAdmin && (
                    <BudgetForm 
                      category={cat} 
                      currentAmount={amountCents} 
                      month={currentMonth} 
                      year={currentYear} 
                    />
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
