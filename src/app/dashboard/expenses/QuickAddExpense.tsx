'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { PlusCircle } from 'lucide-react'
import { ExpenseForm } from './ExpenseForm'

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

export function QuickAddExpense({ categories, tags }: { categories: Category[], tags?: Tag[] }) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={
        <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-full px-4 shadow-md transition-transform active:scale-95">
          <PlusCircle className="mr-2 h-4 w-4" />
          <span className="hidden sm:inline">Añadir Gasto</span>
          <span className="sm:hidden">Gasto</span>
        </Button>
      } />
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Registrar Nuevo Gasto</DialogTitle>
        </DialogHeader>
        <ExpenseForm categories={categories} tags={tags || []} onSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  )
}
