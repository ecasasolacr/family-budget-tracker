'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function createFamily(formData: FormData) {
  const supabase = await createClient()
  const familyName = formData.get('familyName') as string

  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }

  // Use atomic RPC call to create family and add admin member
  const { data: familyId, error: familyError } = await supabase
    .rpc('create_family', { family_name: familyName })

  if (familyError || !familyId) {
    redirect('/onboarding?message=Error al crear la familia.')
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function joinFamily(formData: FormData) {
  const inviteCode = formData.get('inviteCode') as string
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { error: memberError } = await supabase
    .from('family_members')
    .insert([{ 
      user_id: user.id, 
      family_id: inviteCode,
      role: 'member'
    }])

  if (memberError) {
    redirect('/onboarding?message=Código de invitación inválido o error al unirse.')
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}
