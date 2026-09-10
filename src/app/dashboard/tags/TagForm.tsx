'use client'

import { useRef, useState } from 'react'
import { createTag } from './actions'
import { Plus, Loader2 } from 'lucide-react'

export function TagForm() {
  const formRef = useRef<HTMLFormElement>(null)
  const [isPending, setIsPending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(formData: FormData) {
    setIsPending(true)
    setError(null)
    try {
      await createTag(formData)
      formRef.current?.reset()
    } catch (e: any) {
      setError(e.message)
    } finally {
      setIsPending(false)
    }
  }

  return (
    <div className="bg-white dark:bg-slate-950 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4">Nueva Etiqueta</h2>
      
      <form ref={formRef} action={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Nombre (sin #)
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">#</span>
            <input
              type="text"
              name="name"
              id="name"
              required
              className="w-full pl-8 pr-3 py-2 border border-slate-300 dark:border-slate-700 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
              placeholder="ViajeMexico"
            />
          </div>
        </div>

        <div>
          <label htmlFor="color" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Color
          </label>
          <div className="flex items-center gap-3">
            <input
              type="color"
              name="color"
              id="color"
              defaultValue="#64748b"
              className="h-9 w-14 rounded border border-slate-300 dark:border-slate-700 cursor-pointer"
            />
            <span className="text-xs text-slate-500">Selecciona el color de la etiqueta</span>
          </div>
        </div>

        {error && (
          <div className="p-3 text-sm text-red-600 bg-red-50 dark:bg-red-900/30 dark:text-red-400 rounded-md">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isPending ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              <Plus className="w-5 h-5 mr-1 -ml-1" />
              Crear Etiqueta
            </>
          )}
        </button>
      </form>
    </div>
  )
}
