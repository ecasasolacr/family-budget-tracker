import { createClient } from '@/utils/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ExpenseChart } from './ExpenseChart'
import { DailyExpenseChart } from './DailyExpenseChart'
import { BudgetProgress } from './BudgetProgress'
import { ActiveGoalsWidget } from './ActiveGoalsWidget'
import { AchievementsWidget } from './AchievementsWidget'
import { TopExpensesList } from './TopExpensesList'
import { MemberExpenseChart } from './MemberExpenseChart'
import { formatCurrency } from '@/utils/format'
import { ExpenseList } from './expenses/ExpenseList'
import { TrendingDown, TrendingUp, Minus } from 'lucide-react'

export default async function DashboardPage(props: { searchParams: Promise<{ month?: string; year?: string }> }) {
  const searchParams = await props.searchParams;
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  const { data: familyMembers } = await supabase
    .from('family_members')
    .select(`
      family_id,
      role,
      families (
        name
      )
    `)
    .eq('user_id', user?.id)
    .single()

  // @ts-ignore - Supabase types can be tricky with joins
  const familyName = familyMembers?.families?.name || 'Tu Familia'
  const familyId = familyMembers?.family_id

  const date = new Date()
  const currentMonth = parseInt(searchParams.month || String(date.getMonth() + 1), 10)
  const currentYear = parseInt(searchParams.year || String(date.getFullYear()), 10)

  // Fetch active categories to ensure we can match budgets even without expenses
  const { data: categories } = await supabase
    .from('categories')
    .select('id, name, color, icon')
    .eq('family_id', familyId)

  // Fetch budgets for current month
  const { data: budgets } = await supabase
    .from('budgets')
    .select('category_id, amount_limit')
    .eq('month', currentMonth)
    .eq('year', currentYear)
    
  const totalBudgeted = budgets?.reduce((acc, curr) => acc + curr.amount_limit, 0) || 0

  // Fetch expenses for current month
  // Create ISO string for the first day of the current month and the first day of next month for filtering
  const startOfMonth = new Date(currentYear, currentMonth - 1, 1).toISOString().split('T')[0]
  const startOfNextMonth = new Date(currentYear, currentMonth, 1).toISOString().split('T')[0]

  const { data: expenses } = await supabase
    .from('expenses')
    .select(`
      id, amount, date, description, 
      categories (id, name, color, icon),
      users (email),
      expense_tags (
        tags (id, name, color)
      )
    `)
    .gte('date', startOfMonth)
    .lt('date', startOfNextMonth)
    .order('date', { ascending: false })

  const totalSpent = expenses?.reduce((acc, curr) => acc + curr.amount, 0) || 0
  const remaining = totalBudgeted - totalSpent

  // Fetch previous month expenses to compute MoM trend
  let prevMonth = currentMonth - 1
  let prevYear = currentYear
  if (prevMonth === 0) {
    prevMonth = 12
    prevYear = currentYear - 1
  }
  const startOfPrevMonth = new Date(prevYear, prevMonth - 1, 1).toISOString().split('T')[0]
  const endOfPrevMonth = new Date(currentYear, currentMonth - 1, 1).toISOString().split('T')[0]

  // IMPORTANT: Scope to the current family context! We don't have family_id strictly in expenses 
  // but row-level security handles it since we use supabase auth context.
  const { data: prevExpenses } = await supabase
    .from('expenses')
    .select('amount')
    .gte('date', startOfPrevMonth)
    .lt('date', endOfPrevMonth)

  const prevTotalSpent = prevExpenses?.reduce((acc, curr) => acc + curr.amount, 0) || 0
  
  let spentTrend = 0
  if (prevTotalSpent > 0) {
    spentTrend = ((totalSpent - prevTotalSpent) / prevTotalSpent) * 100
  }

  // Aggregate expenses for the pie chart and daily chart
  const categoryTotals: Record<string, { value: number, color: string, name: string, icon: string | null }> = {}
  const dailyTotals: Record<string, number> = {}
  const memberTotals: Record<string, number> = {}

  expenses?.forEach(exp => {
    // Pie chart aggregation
    // @ts-ignore
    const cat = (exp.categories as any) || { id: 'unknown', name: 'Sin categoría', color: '#94a3b8', icon: null }
    if (!categoryTotals[cat.id]) {
      categoryTotals[cat.id] = { value: 0, color: cat.color || '#94a3b8', name: cat.name, icon: cat.icon }
    }
    categoryTotals[cat.id].value += exp.amount

    // Daily chart aggregation
    const dateStr = exp.date.split('T')[0]
    dailyTotals[dateStr] = (dailyTotals[dateStr] || 0) + exp.amount
    
    // Member chart aggregation
    const userEmail = (exp.users as any)?.email || 'Desconocido'
    const name = userEmail.split('@')[0]
    memberTotals[name] = (memberTotals[name] || 0) + exp.amount
  })
  
  const chartData = Object.values(categoryTotals).sort((a, b) => b.value - a.value)
  const dailyData = Object.entries(dailyTotals).map(([date, amount]) => ({ date, amount }))
  const memberData = Object.entries(memberTotals).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value)

  // Aggregate budget progress
  const budgetData = (budgets || []).map(b => {
    const cat = categories?.find(c => c.id === b.category_id)
    const spent = categoryTotals[b.category_id]?.value || 0
    return {
      categoryId: b.category_id,
      name: cat?.name || 'Desconocido',
      icon: cat?.icon || null,
      color: cat?.color || null,
      budgeted: b.amount_limit,
      spent
    }
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
          Resumen de {familyName}
        </h1>
        <div className="text-sm bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full font-medium flex gap-2 items-center">
          <span>Código de Invitación:</span>
          <code className="bg-emerald-200 px-2 py-0.5 rounded select-all">{familyId}</code>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="shadow-sm border-0 ring-1 ring-slate-200 dark:ring-slate-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Presupuestado (Mes)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-800 dark:text-slate-100">{formatCurrency(totalBudgeted)}</div>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-0 ring-1 ring-slate-200 dark:ring-slate-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Gastado (Mes)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-800 dark:text-slate-100">{formatCurrency(totalSpent)}</div>
            <div className="mt-1 flex items-center text-xs">
              {prevTotalSpent > 0 ? (
                <>
                  {spentTrend > 0 ? (
                    <span className="text-red-500 flex items-center font-medium">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      +{spentTrend.toFixed(1)}% vs mes pasado
                    </span>
                  ) : spentTrend < 0 ? (
                    <span className="text-emerald-500 flex items-center font-medium">
                      <TrendingDown className="w-3 h-3 mr-1" />
                      {spentTrend.toFixed(1)}% vs mes pasado
                    </span>
                  ) : (
                    <span className="text-slate-500 flex items-center">
                      <Minus className="w-3 h-3 mr-1" />
                      Igual que el mes pasado
                    </span>
                  )}
                </>
              ) : (
                <span className="text-slate-400">Sin datos del mes pasado</span>
              )}
            </div>
          </CardContent>
        </Card>
        <Card className={`shadow-sm border-0 ring-1 ${remaining < 0 ? 'ring-red-200 bg-red-50 dark:bg-red-950/20 dark:ring-red-900' : 'ring-emerald-200 bg-emerald-50 dark:bg-emerald-950/20 dark:ring-emerald-900'}`}>
          <CardHeader className="pb-2">
            <CardTitle className={`text-sm font-medium ${remaining < 0 ? 'text-red-700 dark:text-red-500' : 'text-emerald-700 dark:text-emerald-500'}`}>Restante</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${remaining < 0 ? 'text-red-600 dark:text-red-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
              {formatCurrency(remaining)}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        <div className="lg:col-span-2 space-y-6">
          <div>
            <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4">Gasto Diario</h2>
            <Card className="shadow-sm border-0 ring-1 ring-slate-200 dark:ring-slate-800 pt-6 pr-4 pb-2">
              <CardContent>
                <DailyExpenseChart data={dailyData} />
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Top Gastos</h2>
              </div>
              <TopExpensesList expenses={expenses as any} />
            </div>
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Gastos Recientes</h2>
              </div>
              <ExpenseList expenses={expenses?.slice(0, 4) || []} />
            </div>
          </div>
        </div>
        
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4">Distribución</h2>
            <Card className="shadow-sm border-0 ring-1 ring-slate-200 dark:ring-slate-800 pt-6">
              <CardContent>
                <ExpenseChart data={chartData} />
              </CardContent>
            </Card>
          </div>

          {memberData.length > 1 && (
            <div>
              <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4">Gasto por Usuario</h2>
              <Card className="shadow-sm border-0 ring-1 ring-slate-200 dark:ring-slate-800 pt-6">
                <CardContent>
                  <MemberExpenseChart data={memberData} />
                </CardContent>
              </Card>
            </div>
          )}

          <div>
            <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4">Metas de Ahorro Activas</h2>
            <Card className="shadow-sm border-0 ring-1 ring-slate-200 dark:ring-slate-800">
              <CardContent className="pt-6">
                <ActiveGoalsWidget />
              </CardContent>
            </Card>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4">Logros Familiares</h2>
            <Card className="shadow-sm border-0 ring-1 ring-slate-200 dark:ring-slate-800">
              <CardContent className="pt-6">
                <AchievementsWidget />
              </CardContent>
            </Card>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4">Progreso de Presupuestos</h2>
            <Card className="shadow-sm border-0 ring-1 ring-slate-200 dark:ring-slate-800">
              <CardContent className="pt-6">
                <BudgetProgress data={budgetData} />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
