'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/utils/supabase/server'

export async function addSubscription(formData: FormData) {
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

  const name = formData.get('name') as string
  const amountStr = formData.get('amount') as string
  const category_id = formData.get('category_id') as string | null
  const billing_period = formData.get('billing_period') as string || 'monthly'
  const next_billing_date = formData.get('next_billing_date') as string | null

  // Convert amount to cents
  const amount = Math.round(parseFloat(amountStr) * 100)

  const { error } = await supabase
    .from('subscriptions')
    .insert([{
      family_id: familyMember.family_id,
      name,
      amount,
      category_id: category_id || null,
      billing_period,
      next_billing_date: next_billing_date || null,
      is_active: true
    }])

  if (error) {
    console.error('Error adding subscription:', error)
    return { error: 'Error al agregar la suscripción' }
  }

  revalidatePath('/dashboard/subscriptions')
  revalidatePath('/dashboard')
  return { success: true }
}

export async function deleteSubscription(id: string) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('subscriptions')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting subscription:', error)
    return { error: 'Error al eliminar la suscripción' }
  }

  revalidatePath('/dashboard/subscriptions')
  revalidatePath('/dashboard')
  return { success: true }
}

export async function toggleSubscriptionStatus(id: string, is_active: boolean) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('subscriptions')
    .update({ is_active })
    .eq('id', id)

  if (error) {
    console.error('Error toggling subscription:', error)
    return { error: 'Error al cambiar estado' }
  }

  revalidatePath('/dashboard/subscriptions')
  revalidatePath('/dashboard')
  return { success: true }
}
