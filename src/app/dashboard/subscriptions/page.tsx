import { createClient } from '@/utils/supabase/server'
import { SubscriptionForm } from './SubscriptionForm'
import { SubscriptionList } from './SubscriptionList'
import { formatCurrency } from '@/utils/format'

export default async function SubscriptionsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return null

  // Fetch categories for the form
  const { data: categories } = await supabase
    .from('categories')
    .select('id, name, icon, color')
    .order('name')

  // Fetch subscriptions
  const { data: subscriptions } = await supabase
    .from('subscriptions')
    .select(`
      *,
      categories (id, name, icon, color)
    `)
    .order('created_at', { ascending: false })

  const activeSubscriptions = subscriptions?.filter(sub => sub.is_active) || []
  const totalMonthly = activeSubscriptions.reduce((acc, sub) => {
    // Normalize amounts to monthly equivalent for the summary
    let multiplier = 1;
    if (sub.billing_period === 'yearly') multiplier = 1 / 12;
    if (sub.billing_period === 'weekly') multiplier = 4.33; // approx
    
    return acc + (sub.amount * multiplier)
  }, 0)

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Suscripciones y Gastos Fijos</h1>
          <p className="text-slate-500">Administra tus pagos recurrentes.</p>
        </div>
        <div className="bg-emerald-50 dark:bg-emerald-900/20 px-4 py-3 rounded-xl border border-emerald-100 dark:border-emerald-800/30 text-right">
          <div className="text-sm font-medium text-emerald-800 dark:text-emerald-400">Total Estimado Mensual</div>
          <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-500">{formatCurrency(totalMonthly / 100)}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <SubscriptionForm categories={categories || []} />
        </div>
        <div className="lg:col-span-2">
          <SubscriptionList subscriptions={subscriptions || []} />
        </div>
      </div>
    </div>
  )
}
