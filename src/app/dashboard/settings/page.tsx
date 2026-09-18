import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { SettingsClient } from './SettingsClient'

export default async function SettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) redirect('/login')

  const { data: familyMember } = await supabase
    .from('family_members')
    .select('family_id')
    .eq('user_id', user.id)
    .single()

  if (!familyMember) redirect('/onboarding')

  const familyId = familyMember.family_id

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          Configuración
        </h1>
        <p className="text-slate-500 dark:text-slate-400">
          Administra la configuración de tu familia y cuenta.
        </p>
      </div>

      <Card className="shadow-sm border-slate-200 dark:border-slate-800">
        <CardHeader>
          <CardTitle className="text-lg text-slate-800 dark:text-slate-200">
            Invitar Miembros
          </CardTitle>
          <CardDescription>
            Comparte tu código de familia o el enlace de invitación para que otros se unan a tu presupuesto.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SettingsClient familyId={familyId} />
        </CardContent>
      </Card>
    </div>
  )
}
