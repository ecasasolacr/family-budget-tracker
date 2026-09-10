'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { addSavingsGoal } from './actions'

export function GoalForm() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError(null)
    
    const res = await addSavingsGoal(formData)
    
    if (res?.error) {
      setError(res.error)
      setLoading(false)
    } else {
      setLoading(false)
      const form = document.getElementById('goal-form') as HTMLFormElement
      if (form) form.reset()
    }
  }

  return (
    <form id="goal-form" action={handleSubmit} className="space-y-4 bg-white dark:bg-slate-950 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
      <h3 className="font-semibold text-lg">Nueva Meta de Ahorro</h3>
      
      {error && (
        <div className="text-sm font-medium text-destructive bg-destructive/10 p-3 rounded-md">
          {error}
        </div>
      )}
      
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nombre de la Meta</Label>
          <Input 
            id="name" 
            name="name" 
            type="text" 
            required 
            placeholder="Ej. Vacaciones, Fondo de Emergencia"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="target_amount">Monto Objetivo</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">₡</span>
              <Input 
                id="target_amount" 
                name="target_amount" 
                type="number" 
                step="0.01" 
                min="0.01" 
                required 
                placeholder="0.00"
                className="pl-7"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="current_amount">Monto Actual Inicial (Opcional)</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">₡</span>
              <Input 
                id="current_amount" 
                name="current_amount" 
                type="number" 
                step="0.01" 
                min="0" 
                placeholder="0.00"
                className="pl-7"
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="target_date">Fecha Objetivo (Opcional)</Label>
          <Input 
            id="target_date" 
            name="target_date" 
            type="date" 
          />
        </div>
      </div>

      <div className="pt-2">
        <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={loading}>
          {loading ? 'Guardando...' : 'Crear Meta'}
        </Button>
      </div>
    </form>
  )
}
