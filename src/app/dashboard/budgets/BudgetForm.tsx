'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { setBudget } from './actions'
import { Pencil } from 'lucide-react'

type Category = {
  id: string
  name: string
}

export function BudgetForm({ 
  category, 
  currentAmount, 
  month, 
  year 
}: { 
  category: Category, 
  currentAmount: number,
  month: number,
  year: number
}) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  async function onSubmit(formData: FormData) {
    setLoading(true)
    try {
      await setBudget(formData)
      setOpen(false)
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Error')
    }
    setLoading(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger 
        render={
          <Button variant="outline" size="sm" className="gap-2 text-emerald-700 border-emerald-200 hover:bg-emerald-50 dark:border-emerald-800 dark:text-emerald-400 dark:hover:bg-emerald-950">
            <Pencil className="w-3 h-3" />
            {currentAmount > 0 ? 'Editar' : 'Fijar'}
          </Button>
        }
      />
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Presupuesto para {category.name}</DialogTitle>
          <DialogDescription>
            Fija el límite de gasto mensual para esta categoría.
          </DialogDescription>
        </DialogHeader>
        <form action={onSubmit} className="space-y-4 pt-4">
          <input type="hidden" name="categoryId" value={category.id} />
          <input type="hidden" name="month" value={month} />
          <input type="hidden" name="year" value={year} />
          
          <div className="space-y-2">
            <Label htmlFor="amount">Límite Mensual (₡)</Label>
            <Input 
              id="amount" 
              name="amount" 
              type="number" 
              step="0.01" 
              min="0"
              required 
              defaultValue={currentAmount > 0 ? (currentAmount / 100).toFixed(2) : ''}
              placeholder="Ej. 150.00" 
            />
          </div>
          <div className="pt-4 flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading} className="bg-emerald-600 hover:bg-emerald-700">
              {loading ? 'Guardando...' : 'Guardar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
