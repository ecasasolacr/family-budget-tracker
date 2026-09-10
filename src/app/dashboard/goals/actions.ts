'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/utils/supabase/server'

export async function addSavingsGoal(formData: FormData) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autorizado' }

  const { data: familyMember } = await supabase
    .from('family_members')
    .select('family_id')
    .eq('user_id', user.id)
    .single()

  if (!familyMember) return { error: 'Familia no encontrada' }

  const name = formData.get('name') as string
  const target_amount_str = formData.get('target_amount') as string
  const current_amount_str = formData.get('current_amount') as string
  const target_date = formData.get('target_date') as string | null

  const target_amount = Math.round(parseFloat(target_amount_str) * 100)
  const current_amount = current_amount_str ? Math.round(parseFloat(current_amount_str) * 100) : 0

  const { error } = await supabase
    .from('savings_goals')
    .insert([{
      family_id: familyMember.family_id,
      name,
      target_amount,
      current_amount,
      target_date: target_date || null
    }])

  if (error) {
    console.error('Error adding savings goal:', error)
    return { error: 'Error al crear la meta' }
  }

  revalidatePath('/dashboard/goals')
  revalidatePath('/dashboard')
  return { success: true }
}

export async function addFundsToGoal(id: string, amount: number) {
  const supabase = await createClient()
  
  // First get current goal amount
  const { data: goal } = await supabase
    .from('savings_goals')
    .select('current_amount')
    .eq('id', id)
    .single()

  if (!goal) return { error: 'Meta no encontrada' }

  const { error } = await supabase
    .from('savings_goals')
    .update({ current_amount: goal.current_amount + amount })
    .eq('id', id)

  if (error) {
    console.error('Error updating savings goal:', error)
    return { error: 'Error al agregar fondos' }
  }

  revalidatePath('/dashboard/goals')
  revalidatePath('/dashboard')
  return { success: true }
}

export async function deleteSavingsGoal(id: string) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('savings_goals')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting goal:', error)
    return { error: 'Error al eliminar la meta' }
  }

  revalidatePath('/dashboard/goals')
  revalidatePath('/dashboard')
  return { success: true }
}
