'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const monthsEs = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
]

export function MonthSelector() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const today = new Date()
  const currentMonth = parseInt(searchParams.get('month') || String(today.getMonth() + 1), 10)
  const currentYear = parseInt(searchParams.get('year') || String(today.getFullYear()), 10)

  const handlePrev = () => {
    let nextMonth = currentMonth - 1
    let nextYear = currentYear
    if (nextMonth < 1) {
      nextMonth = 12
      nextYear--
    }
    const params = new URLSearchParams(searchParams)
    params.set('month', String(nextMonth))
    params.set('year', String(nextYear))
    router.push(`${pathname}?${params.toString()}`)
  }

  const handleNext = () => {
    let nextMonth = currentMonth + 1
    let nextYear = currentYear
    if (nextMonth > 12) {
      nextMonth = 1
      nextYear++
    }
    const params = new URLSearchParams(searchParams)
    params.set('month', String(nextMonth))
    params.set('year', String(nextYear))
    router.push(`${pathname}?${params.toString()}`)
  }

  const realMonth = today.getMonth() + 1
  const realYear = today.getFullYear()
  const isCurrentMonth = currentMonth === realMonth && currentYear === realYear

  const handleGoToCurrent = () => {
    const params = new URLSearchParams(searchParams)
    params.set('month', String(realMonth))
    params.set('year', String(realYear))
    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
        <Button variant="ghost" size="icon-sm" onClick={handlePrev} className="h-7 w-7 text-slate-600 dark:text-slate-300">
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <div className="text-sm font-medium w-32 text-center text-slate-700 dark:text-slate-200">
          {monthsEs[currentMonth - 1]} {currentYear}
        </div>
        <Button variant="ghost" size="icon-sm" onClick={handleNext} className="h-7 w-7 text-slate-600 dark:text-slate-300">
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
      {!isCurrentMonth && (
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleGoToCurrent}
          className="h-9 px-3 text-xs font-medium text-emerald-600 border-emerald-200 hover:bg-emerald-50 dark:text-emerald-400 dark:border-emerald-800 dark:hover:bg-emerald-950"
        >
          Mes actual
        </Button>
      )}
    </div>
  )
}
