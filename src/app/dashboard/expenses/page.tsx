import { createClient } from '@/utils/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ExpenseList } from './ExpenseList'

export default async function ExpensesPage(props: { searchParams: Promise<{ month?: string; year?: string }> }) {
  const searchParams = await props.searchParams;
  const supabase = await createClient()

  const date = new Date()
  const currentMonth = parseInt(searchParams.month || String(date.getMonth() + 1), 10)
  const currentYear = parseInt(searchParams.year || String(date.getFullYear()), 10)

  // Create ISO string for the first day of the current month and the first day of next month for filtering
  const startOfMonth = new Date(currentYear, currentMonth - 1, 1).toISOString().split('T')[0]
  const startOfNextMonth = new Date(currentYear, currentMonth, 1).toISOString().split('T')[0]

  // We rely on RLS, so just fetching expenses will only return the user's family expenses
  const { data: expenses } = await supabase
    .from('expenses')
    .select(`
      id,
      amount,
      date,
      description,
      categories (
        id,
        name,
        icon,
        color
      ),
      users (
        email
      ),
      expense_tags (
        tags (
          id,
          name,
          color
        )
      )
    `)
    .gte('date', startOfMonth)
    .lt('date', startOfNextMonth)
    .order('date', { ascending: false })
    .order('created_at', { ascending: false })

  const { data: categories } = await supabase
    .from('categories')
    .select('id, name, icon, color')
    .eq('is_active', true)
    .order('name')

  const { data: tags } = await supabase
    .from('tags')
    .select('id, name, color')
    .order('name')

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Gastos</h1>
        <p className="text-slate-500 dark:text-slate-400">
          Historial de gastos de la familia
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Últimos Gastos</CardTitle>
          <CardDescription>Visualiza y administra los gastos recientes.</CardDescription>
        </CardHeader>
        <CardContent>
          <ExpenseList 
            expenses={expenses || []} 
            categories={categories || []}
            tags={tags || []}
          />
        </CardContent>
      </Card>
    </div>
  )
}
