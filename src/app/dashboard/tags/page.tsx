import { createClient } from '@/utils/supabase/server'
import { TagForm } from './TagForm'
import { TagList } from './TagList'
import { redirect } from 'next/navigation'

export const metadata = {
  title: 'Etiquetas | Presupuesto Familiar'
}

export default async function TagsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  // Get family members to check family_id
  const { data: familyMember } = await supabase
    .from('family_members')
    .select('family_id, role')
    .eq('user_id', user.id)
    .single()

  if (!familyMember) redirect('/onboarding')

  // Fetch tags
  const { data: tags } = await supabase
    .from('tags')
    .select('*')
    .eq('family_id', familyMember.family_id)
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">Etiquetas</h1>
        <p className="text-slate-500 mt-1">Crea etiquetas para agrupar gastos que cruzan varias categorías (Ej: #ViajeEspaña2026).</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <TagForm />
        </div>
        
        <div className="md:col-span-2">
          <TagList tags={tags || []} />
        </div>
      </div>
    </div>
  )
}
