'use client'

import { useState } from 'react'
import { formatCurrency } from '@/utils/format'
import { Target, Trophy, Trash2, Plus, ArrowRight } from 'lucide-react'
import { deleteSavingsGoal, addFundsToGoal } from './actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'

type SavingsGoal = {
  id: string
  name: string
  target_amount: number
  current_amount: number
  target_date: string | null
}

export function GoalList({ goals }: { goals: SavingsGoal[] }) {
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null)
  const [fundAmount, setFundAmount] = useState('')
  const [addingFunds, setAddingFunds] = useState(false)

  if (goals.length === 0) {
    return (
      <div className="text-center py-12 bg-white dark:bg-slate-950 rounded-xl border border-dashed border-slate-300 dark:border-slate-800">
        <Target className="w-12 h-12 text-slate-300 mx-auto mb-3" />
        <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100">Sin metas de ahorro</h3>
        <p className="text-slate-500 mt-1">Crea tu primera meta para empezar a ahorrar.</p>
      </div>
    )
  }

  async function handleAddFunds(id: string) {
    if (!fundAmount || isNaN(parseFloat(fundAmount))) return
    
    setAddingFunds(true)
    const amount = Math.round(parseFloat(fundAmount) * 100)
    await addFundsToGoal(id, amount)
    
    setFundAmount('')
    setSelectedGoal(null)
    setAddingFunds(false)
  }

  return (
    <div className="space-y-4">
      {goals.map(goal => {
        const progress = Math.min(100, Math.round((goal.current_amount / goal.target_amount) * 100))
        const isCompleted = goal.current_amount >= goal.target_amount

        return (
          <div 
            key={goal.id} 
            className={`p-5 bg-white dark:bg-slate-950 rounded-xl border transition-colors relative overflow-hidden ${
              isCompleted 
                ? 'border-yellow-300 dark:border-yellow-600/50 shadow-[0_0_15px_rgba(253,224,71,0.3)] dark:shadow-[0_0_15px_rgba(202,138,4,0.15)]' 
                : 'border-slate-200 dark:border-slate-800 shadow-sm'
            }`}
          >
            {isCompleted && (
              <div className="absolute top-0 right-0 w-16 h-16 bg-yellow-100 dark:bg-yellow-900/30 -mr-8 -mt-8 rotate-45 z-0 flex items-end justify-center pb-2">
                <Trophy className="w-4 h-4 text-yellow-600 dark:text-yellow-500 -rotate-45" />
              </div>
            )}
            
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-semibold text-lg text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    {goal.name}
                    {isCompleted && <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full font-medium border border-yellow-200">¡Logrado!</span>}
                  </h4>
                  {goal.target_date && (
                    <p className="text-xs text-slate-500 mt-1">
                      Objetivo para: {new Date(goal.target_date).toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => {
                    if(confirm('¿Eliminar esta meta?')) {
                      deleteSavingsGoal(goal.id)
                    }
                  }}
                  className="text-slate-400 hover:text-red-500 p-1 rounded-md transition-colors hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="flex justify-between items-end mb-2 mt-4">
                <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                  {formatCurrency(goal.current_amount / 100)}
                </div>
                <div className="text-sm font-medium text-slate-500">
                  de {formatCurrency(goal.target_amount / 100)}
                </div>
              </div>

              <div className="relative h-4 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className={`absolute top-0 left-0 h-full transition-all duration-1000 ease-out rounded-full ${
                    isCompleted 
                      ? 'bg-gradient-to-r from-yellow-400 to-yellow-500' 
                      : 'bg-gradient-to-r from-blue-500 to-indigo-500'
                  }`}
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="text-right mt-1 text-xs font-medium text-slate-500">
                {progress}%
              </div>

              {!isCompleted && (
                <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                  {selectedGoal === goal.id ? (
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <div className="relative w-full sm:w-32">
                        <span className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400 text-sm">₡</span>
                        <Input
                          type="number"
                          size={1}
                          className="pl-6 h-8 text-sm"
                          placeholder="0.00"
                          value={fundAmount}
                          onChange={e => setFundAmount(e.target.value)}
                          autoFocus
                        />
                      </div>
                      <Button 
                        size="sm" 
                        onClick={() => handleAddFunds(goal.id)}
                        disabled={addingFunds || !fundAmount}
                        className="h-8"
                      >
                        Añadir
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        onClick={() => {
                          setSelectedGoal(null)
                          setFundAmount('')
                        }}
                        className="h-8"
                      >
                        Cancelar
                      </Button>
                    </div>
                  ) : (
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="text-xs h-8 text-blue-600 border-blue-200 hover:bg-blue-50 dark:text-blue-400 dark:border-blue-900 dark:hover:bg-blue-900/30"
                      onClick={() => setSelectedGoal(goal.id)}
                    >
                      <Plus className="w-3 h-3 mr-1" />
                      Abonar a meta
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
