import { createClient } from '@/utils/supabase/server'
import { CategoryList } from './CategoryList'
import { CategoryForm } from './CategoryForm'
import { CreateDefaultCategoriesBtn } from './CreateDefaultCategoriesBtn'
import { redirect } from 'next/navigation'

export default async function CategoriesPage() {
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

  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .eq('family_id', familyMember.family_id)
    .order('name')

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
            Categorías
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Administra las categorías para clasificar tus gastos familiares.
          </p>
        </div>
        
        {isAdmin && <CategoryForm />}
      </div>
      
      {categories?.length === 0 && isAdmin && (
        <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-8 text-center flex flex-col items-center justify-center space-y-4">
          <p className="text-slate-500">No tienes ninguna categoría todavía.</p>
          <CreateDefaultCategoriesBtn />
        </div>
      )}

      <CategoryList categories={categories || []} isAdmin={isAdmin} />
    </div>
  )
}
