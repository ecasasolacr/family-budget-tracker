'use client'

import { useState } from 'react'
import { deleteTag } from './actions'
import { Loader2, Tag as TagIcon, Trash2 } from 'lucide-react'

type Tag = {
  id: string
  name: string
  color: string | null
}

export function TagList({ tags }: { tags: Tag[] }) {
  const [deletingId, setDeletingId] = useState<string | null>(null)

  async function handleDelete(id: string) {
    if (!confirm('¿Estás seguro de que quieres eliminar esta etiqueta?')) return
    
    setDeletingId(id)
    try {
      await deleteTag(id)
    } catch (e: any) {
      alert(e.message)
    } finally {
      setDeletingId(null)
    }
  }

  if (tags.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-950 p-8 rounded-xl border border-slate-200 dark:border-slate-800 text-center">
        <TagIcon className="w-12 h-12 text-slate-300 mx-auto mb-3" />
        <h3 className="text-sm font-medium text-slate-900 dark:text-slate-100">No hay etiquetas</h3>
        <p className="mt-1 text-sm text-slate-500">
          Crea tu primera etiqueta para agrupar gastos similares.
        </p>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
      <ul className="divide-y divide-slate-200 dark:divide-slate-800">
        {tags.map((tag) => (
          <li key={tag.id} className="p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
            <div className="flex items-center gap-3">
              <div 
                className="w-4 h-4 rounded-full shadow-inner" 
                style={{ backgroundColor: tag.color || '#64748b' }}
              />
              <span className="font-medium text-slate-900 dark:text-slate-100">
                {tag.name}
              </span>
            </div>
            
            <button
              onClick={() => handleDelete(tag.id)}
              disabled={deletingId === tag.id}
              className="text-slate-400 hover:text-red-600 transition-colors p-2 rounded-md hover:bg-red-50 dark:hover:bg-red-900/30 disabled:opacity-50"
              title="Eliminar etiqueta"
            >
              {deletingId === tag.id ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Trash2 className="w-5 h-5" />
              )}
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
