'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { toggleCategoryStatus, deleteCategory } from './actions'
import { Power, PowerOff, Trash2 } from 'lucide-react'
import { CategoryIcon } from '@/components/ui/category-icon'

type Category = {
  id: string
  name: string
  color: string
  icon: string
  is_active: boolean
}

export function CategoryList({ categories, isAdmin }: { categories: Category[], isAdmin: boolean }) {
  const [loading, setLoading] = useState<string | null>(null)

  async function handleToggle(id: string, currentStatus: boolean) {
    setLoading(id)
    try {
      await toggleCategoryStatus(id, !currentStatus)
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Error')
    }
    setLoading(null)
  }

  async function handleDelete(id: string) {
    if (!confirm('¿Estás seguro de eliminar esta categoría?')) return
    setLoading(id)
    try {
      await deleteCategory(id)
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Error')
    }
    setLoading(null)
  }

  if (categories.length === 0) {
    return (
      <div className="text-center p-8 text-slate-500 bg-white dark:bg-slate-900 rounded-lg border border-dashed border-slate-300 dark:border-slate-700">
        No hay categorías configuradas. Crea una para empezar.
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {categories.map((cat) => (
        <Card key={cat.id} className={`overflow-hidden transition-all ${cat.is_active ? '' : 'opacity-60 grayscale'}`}>
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center text-white shadow-sm"
                style={{ backgroundColor: cat.color || '#10b981' }}
              >
                <CategoryIcon iconName={cat.icon} className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-800 dark:text-slate-100 leading-tight">
                  {cat.name}
                </h3>
                <p className="text-xs text-slate-500">
                  {cat.is_active ? 'Activa' : 'Inactiva'}
                </p>
              </div>
            </div>
            
            {isAdmin && (
              <div className="flex gap-1">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => handleToggle(cat.id, cat.is_active)}
                  disabled={loading === cat.id}
                  title={cat.is_active ? "Desactivar" : "Activar"}
                  className={cat.is_active ? "text-amber-600 hover:text-amber-700 hover:bg-amber-50" : "text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"}
                >
                  {cat.is_active ? <PowerOff className="w-4 h-4" /> : <Power className="w-4 h-4" />}
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => handleDelete(cat.id)}
                  disabled={loading === cat.id}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  title="Eliminar"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
