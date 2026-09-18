import { login, signup } from './actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ message?: string; returnTo?: string }>
}) {
  const params = await searchParams
  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-slate-50 dark:bg-slate-900">
      <Card className="w-full max-w-md shadow-lg border-0 ring-1 ring-slate-200 dark:ring-slate-800">
        <CardHeader className="space-y-1 pb-6">
          <CardTitle className="text-2xl font-bold text-center tracking-tight text-emerald-600 dark:text-emerald-500">
            Presupuesto Familiar
          </CardTitle>
          <CardDescription className="text-center text-slate-500 dark:text-slate-400">
            Inicia sesión o crea una nueva cuenta para comenzar
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <input type="hidden" name="returnTo" value={params?.returnTo || ''} />
            <div className="space-y-2">
              <Label htmlFor="email">Correo Electrónico</Label>
              <Input 
                id="email" 
                name="email" 
                type="email" 
                required 
                placeholder="hola@ejemplo.com" 
                className="focus-visible:ring-emerald-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input 
                id="password" 
                name="password" 
                type="password" 
                required 
                className="focus-visible:ring-emerald-500"
              />
            </div>
            {params?.message && (
              <div className="text-sm font-medium text-amber-800 bg-amber-50 dark:bg-amber-900/30 dark:text-amber-300 p-3 rounded-md border border-amber-200 dark:border-amber-800">
                {params.message}
              </div>
            )}
            <div className="flex flex-col space-y-3 pt-4">
              <Button type="submit" formAction={login} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">
                Iniciar Sesión
              </Button>
              <Button type="submit" formAction={signup} variant="outline" className="w-full border-emerald-200 text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800 dark:border-emerald-800 dark:text-emerald-400 dark:hover:bg-emerald-950">
                Crear Cuenta
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
