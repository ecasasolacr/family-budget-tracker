'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function setBudget(formData: FormData) {
  const categoryId = formData.get('categoryId') as string
  const amountStr = formData.get('amount') as string
  const month = parseInt(formData.get('month') as string)
  const year = parseInt(formData.get('year') as string)

  // Convert to cents
  const amountLimit = Math.round(parseFloat(amountStr) * 100)

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error("No autorizado")

  const { data: familyMember } = await supabase
    .from('family_members')
    .select('family_id')
    .eq('user_id', user.id)
    .single()
    
  if (!familyMember) throw new Error("No perteneces a ninguna familia")

  // Upsert the budget
  const { error } = await supabase
    .from('budgets')
    .upsert({ 
      family_id: familyMember.family_id,
      category_id: categoryId,
      month,
      year,
      amount_limit: amountLimit
    }, { onConflict: 'family_id, category_id, month, year' })

  if (error) {
    console.error(error)
    throw new Error("Error al configurar el presupuesto")
  }

  revalidatePath('/dashboard/budgets')
}
