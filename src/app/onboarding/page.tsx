import { createFamily, joinFamily } from './actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export default async function OnboardingPage({
  searchParams,
}: {
  searchParams: Promise<{ message?: string; inviteCode?: string }>
}) {
  const params = await searchParams
  
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    if (params?.inviteCode) {
      const returnTo = encodeURIComponent(`/onboarding?inviteCode=${params.inviteCode}`)
      redirect(`/login?returnTo=${returnTo}`)
    } else {
      redirect('/login')
    }
  }

  // Check if user already has a family
  const { data: familyMembers } = await supabase
    .from('family_members')
    .select('family_id')
    .eq('user_id', user.id)
    .limit(1)

  // If the user already has a family and is not trying to join one with an invite code, redirect to dashboard.
  // We can even redirect them if they have an invite code, since strict multi-tenancy says 1 family per user.
  if (familyMembers && familyMembers.length > 0) {
    redirect('/dashboard')
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-slate-50 dark:bg-slate-900">
      <div className="w-full max-w-md space-y-6">
        
        {params?.message && (
          <div className="text-sm font-medium text-amber-800 bg-amber-50 dark:bg-amber-900/30 dark:text-amber-300 p-3 rounded-md border border-amber-200 dark:border-amber-800">
            {params.message}
          </div>
        )}

        {!params?.inviteCode && (
          <>
            <Card className="shadow-lg border-0 ring-1 ring-slate-200 dark:ring-slate-800">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-emerald-600 dark:text-emerald-500">
              Crear una Familia
            </CardTitle>
            <CardDescription className="text-slate-500 dark:text-slate-400">
              Crea un nuevo espacio para llevar el control de tus gastos familiares.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" action={createFamily}>
              <div className="space-y-2">
                <Label htmlFor="familyName">Nombre de la Familia</Label>
                <Input 
                  id="familyName" 
                  name="familyName" 
                  required 
                  placeholder="Ej. Familia Pérez" 
                  className="focus-visible:ring-emerald-500"
                />
              </div>
              <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">
                Crear Familia
              </Button>
            </form>
          </CardContent>
        </Card>
          <div className="text-center text-sm text-slate-500">
            — o —
          </div>
        </>
        )}

        <Card className="shadow-lg border-0 ring-1 ring-slate-200 dark:ring-slate-800">
          <CardHeader className="space-y-1">
            <CardTitle className="text-xl font-bold text-slate-800 dark:text-slate-200">
              Unirse a una Familia
            </CardTitle>
            <CardDescription className="text-slate-500 dark:text-slate-400">
              Ingresa el código de invitación que te compartieron.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" action={joinFamily}>
              <div className="space-y-2">
                <Label htmlFor="inviteCode">Código de Invitación</Label>
                <Input 
                  id="inviteCode" 
                  name="inviteCode" 
                  required 
                  placeholder="Código..." 
                  defaultValue={params?.inviteCode || ''}
                  className="focus-visible:ring-emerald-500"
                />
              </div>
              <Button type="submit" variant="outline" className="w-full border-slate-300 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800">
                Unirse
              </Button>
            </form>
          </CardContent>
        </Card>

      </div>
    </div>
  )
}
