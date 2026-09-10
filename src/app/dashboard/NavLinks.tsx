'use client'

import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import { LayoutDashboard, Tags, PiggyBank, Receipt, Hash, Repeat, Target } from 'lucide-react'

export function NavLinks() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  
  // Construct the base search params string to append to links
  const params = new URLSearchParams()
  if (searchParams.has('month')) params.set('month', searchParams.get('month')!)
  if (searchParams.has('year')) params.set('year', searchParams.get('year')!)
  const queryString = params.toString() ? `?${params.toString()}` : ''
  
  const links = [
    { href: '/dashboard', label: 'Resumen', icon: LayoutDashboard },
    { href: '/dashboard/expenses', label: 'Gastos', icon: Receipt },
    { href: '/dashboard/categories', label: 'Categorías', icon: Tags },
    { href: '/dashboard/budgets', label: 'Presupuestos', icon: PiggyBank },
    { href: '/dashboard/goals', label: 'Metas', icon: Target },
    { href: '/dashboard/tags', label: 'Etiquetas', icon: Hash },
    { href: '/dashboard/subscriptions', label: 'Suscripciones', icon: Repeat },
  ]

  return (
    <div className="flex gap-1 overflow-x-auto pb-2 sm:pb-0">
      {links.map((link) => {
        const isActive = pathname === link.href || (link.href !== '/dashboard' && pathname.startsWith(link.href))
        const Icon = link.icon
        
        return (
          <Link 
            key={link.href} 
            href={`${link.href}${queryString}`}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
              isActive 
                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300' 
                : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
            }`}
          >
            <Icon className="w-4 h-4" />
            {link.label}
          </Link>
        )
      })}
    </div>
  )
}
