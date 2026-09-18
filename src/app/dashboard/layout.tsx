import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { NavLinks } from './NavLinks'
import { LogOut } from 'lucide-react'
import { QuickAddExpense } from './expenses/QuickAddExpense'
import { MonthSelector } from './MonthSelector'
import { Suspense } from 'react'
import { ThemeToggle } from '@/components/theme-toggle'
export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Check if user has a family
  const { data: familyMembers, error: familyMembersError } = await supabase
    .from('family_members')
    .select('family_id')
    .eq('user_id', user.id)
    .limit(1)

  if (familyMembersError) {
    console.error('Error fetching familyMembers in layout:', familyMembersError)
  }

  if (!familyMembers || familyMembers.length === 0) {
    redirect('/onboarding')
  }

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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col">
      <header className="bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="font-bold text-emerald-600 dark:text-emerald-500 text-xl tracking-tight">
              Presupuesto Familiar
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
              <Suspense fallback={<div className="h-9 w-32 bg-slate-100 dark:bg-slate-800 rounded-lg animate-pulse"></div>}>
                <MonthSelector />
              </Suspense>
              <QuickAddExpense categories={categories || []} tags={tags || []} />
              <div className="text-sm text-slate-500 hidden sm:block">
                {user.email}
              </div>
              <div className="flex items-center gap-1 border-l border-slate-200 dark:border-slate-800 pl-4">
                <div className="w-10 h-10 flex items-center justify-center">
                  <ThemeToggle />
                </div>
                <form action="/auth/signout" method="post">
                  <button type="submit" className="text-slate-400 hover:text-red-500 transition-colors p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800" title="Cerrar sesión">
                    <LogOut className="w-5 h-5" />
                  </button>
                </form>
              </div>
            </div>
          </div>
          <div className="pt-2 sm:pt-0">
            <Suspense fallback={<div className="h-10 w-full animate-pulse bg-slate-100 dark:bg-slate-800 rounded-md"></div>}>
              <NavLinks />
            </Suspense>
          </div>
        </div>
      </header>
      <main className="p-4 max-w-5xl mx-auto w-full flex-1">
        {children}
      </main>
    </div>
  )
}
