'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { CategoryBadge } from '@/components/ui/category-icon'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { updateExpense } from './actions'

type Expense = {
  id: string
  amount: number
  date: string
  description: string | null
  categories: {
    id: string
    name: string
    icon: string | null
    color: string | null
  } | null
  expense_tags?: {
    tags: {
      id: string
      name: string
      color: string | null
    } | null
  }[]
}

type Category = {
  id: string
  name: string
  icon: string | null
  color: string | null
}

type Tag = {
  id: string
  name: string
  color: string | null
}

export function EditExpenseDialog({
  expense,
  categories,
  tags,
  open,
  onOpenChange,
  onSuccess
}: {
  expense: Expense | null
  categories: Category[]
  tags?: Tag[]
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // Initialize tags state
  const initialTags = expense?.expense_tags?.map(et => et.tags?.id).filter(Boolean) as string[] || []
  const [selectedTags, setSelectedTags] = useState<string[]>(initialTags)

  // When expense changes, update selectedTags
  // Using a key on the component or useEffect could work, but since the dialog is controlled, 
  // we'll reset state when it opens if needed. For now, initializing from prop is fine 
  // if we re-render the dialog per expense.

  if (!expense) return null

  const formattedAmount = (expense.amount / 100).toFixed(2)

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError(null)
    
    formData.append('id', expense!.id)

    const res = await updateExpense(formData)
    
    if (res?.error) {
      setError(res.error)
      setLoading(false)
    } else {
      setLoading(false)
      onOpenChange(false)
      if (onSuccess) onSuccess()
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar Gasto</DialogTitle>
        </DialogHeader>
        
        <form action={handleSubmit} className="space-y-4">
          {error && (
            <div className="text-sm font-medium text-destructive bg-destructive/10 p-3 rounded-md">
              {error}
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="edit-amount">Monto</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">₡</span>
              <Input 
                id="edit-amount" 
                name="amount" 
                type="number" 
                step="0.01" 
                min="0.01" 
                required 
                defaultValue={formattedAmount}
                className="pl-7"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-category_id">Categoría</Label>
            <Select name="category_id" required defaultValue={expense.categories?.id}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecciona una categoría">
                  {(value) => {
                    const selected = categories.find(c => c.id === value)
                    return selected ? <CategoryBadge name={selected.name} icon={selected.icon} color={selected.color} /> : "Selecciona una categoría"
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
            <Label htmlFor="edit-date">Fecha</Label>
            <Input 
              id="edit-date" 
              name="date" 
              type="date" 
              required 
              defaultValue={expense.date}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-description">Nota (Opcional)</Label>
            <Input 
              id="edit-description" 
              name="description" 
              type="text" 
              defaultValue={expense.description || ''}
            />
          </div>

          {tags && tags.length > 0 && (
            <div className="space-y-2">
              <Label>Etiquetas</Label>
              <div className="flex flex-wrap gap-2">
                {tags.map(tag => {
                  const isSelected = selectedTags.includes(tag.id)
                  return (
                    <button
                      key={tag.id}
                      type="button"
                      onClick={() => {
                        setSelectedTags(prev => 
                          prev.includes(tag.id) ? prev.filter(id => id !== tag.id) : [...prev, tag.id]
                        )
                      }}
                      className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                        isSelected 
                          ? 'border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300' 
                          : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400'
                      }`}
                      style={isSelected && tag.color ? { borderColor: tag.color, color: tag.color } : {}}
                    >
                      {tag.name}
                    </button>
                  )
                })}
              </div>
              <input type="hidden" name="tags" value={selectedTags.join(',')} />
            </div>
          )}

          <div className="pt-2">
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Guardando...' : 'Guardar Cambios'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
