'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/utils/supabase/server'

export async function addExpense(formData: FormData) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autorizado' }

  // Obtener la familia del usuario
  const { data: familyMember } = await supabase
    .from('family_members')
    .select('family_id')
    .eq('user_id', user.id)
    .single()

  if (!familyMember) return { error: 'Familia no encontrada' }

  const category_id = formData.get('category_id') as string
  const amountStr = formData.get('amount') as string
  const date = formData.get('date') as string
  const description = formData.get('description') as string

  const tagsStr = formData.get('tags') as string
  const tags = tagsStr ? tagsStr.split(',').filter(Boolean) : []

  // Convert amount to cents
  const amount = Math.round(parseFloat(amountStr) * 100)

  const { data: newExpense, error } = await supabase
    .from('expenses')
    .insert([{
      family_id: familyMember.family_id,
      user_id: user.id,
      category_id,
      amount,
      date,
      description
    }])
    .select('id')
    .single()

  if (error) {
    console.error('Error adding expense:', error)
    return { error: 'Error al agregar el gasto' }
  }

  // Insert tags if any
  if (newExpense && tags.length > 0) {
    const expenseTags = tags.map(tag_id => ({
      expense_id: newExpense.id,
      tag_id
    }))
    
    const { error: tagError } = await supabase
      .from('expense_tags')
      .insert(expenseTags)
      
    if (tagError) {
      console.error('Error adding expense tags:', tagError)
      // No devolvemos error principal para no romper la creación del gasto, 
      // pero podríamos manejarlo.
    }
  }

  revalidatePath('/dashboard')
  return { success: true }
}

export async function deleteExpense(id: string) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('expenses')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting expense:', error)
    return { error: 'Error al eliminar el gasto' }
  }

  revalidatePath('/dashboard')
  return { success: true }
}
