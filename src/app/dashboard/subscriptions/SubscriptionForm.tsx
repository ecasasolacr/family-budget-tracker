'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { addSubscription } from './actions'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { CategoryBadge } from '@/components/ui/category-icon'

type Category = {
  id: string
  name: string
  icon: string | null
  color: string | null
}

export function SubscriptionForm({ categories }: { categories: Category[] }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError(null)
    
    const res = await addSubscription(formData)
    
    if (res?.error) {
      setError(res.error)
      setLoading(false)
    } else {
      setLoading(false)
      // Reset the form by reloading or managing state
      const form = document.getElementById('subscription-form') as HTMLFormElement
      if (form) form.reset()
    }
  }

  return (
    <form id="subscription-form" action={handleSubmit} className="space-y-4 bg-white dark:bg-slate-950 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
      <h3 className="font-semibold text-lg">Nueva Suscripción</h3>
      
      {error && (
        <div className="text-sm font-medium text-destructive bg-destructive/10 p-3 rounded-md">
          {error}
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nombre / Servicio</Label>
          <Input 
            id="name" 
            name="name" 
            type="text" 
            required 
            placeholder="Ej. Netflix, Spotify, Gimnasio"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="amount">Monto</Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">₡</span>
            <Input 
              id="amount" 
              name="amount" 
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
          <Label htmlFor="category_id">Categoría (Opcional)</Label>
          <Select name="category_id">
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Sin categoría">
                {(value) => {
                  if (!value) return "Sin categoría"
                  const selected = categories.find(c => c.id === value)
                  return selected ? <CategoryBadge name={selected.name} icon={selected.icon} color={selected.color} /> : "Sin categoría"
                }}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {categories.map(c => (
                <SelectItem key={c.id} value={c.id} label={c.name}>
                  <CategoryBadge name={c.name} icon={c.icon} color={c.color} />
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="billing_period">Período de Facturación</Label>
          <Select name="billing_period" defaultValue="monthly">
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Frecuencia" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="weekly">Semanal</SelectItem>
              <SelectItem value="monthly">Mensual</SelectItem>
              <SelectItem value="yearly">Anual</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="next_billing_date">Próximo Cobro (Opcional)</Label>
          <Input 
            id="next_billing_date" 
            name="next_billing_date" 
            type="date" 
          />
        </div>
      </div>

      <div className="pt-2">
        <Button type="submit" className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700" disabled={loading}>
          {loading ? 'Guardando...' : 'Agregar Suscripción'}
        </Button>
      </div>
    </form>
  )
}
