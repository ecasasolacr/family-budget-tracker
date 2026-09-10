'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createTag(formData: FormData) {
  const name = formData.get('name') as string
  const color = formData.get('color') as string

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error("No autorizado")

  // Get user's family id
  const { data: familyMember } = await supabase
    .from('family_members')
    .select('family_id')
    .eq('user_id', user.id)
    .single()
    
  if (!familyMember) throw new Error("No perteneces a ninguna familia")

  let cleanName = name.trim()
  if (!cleanName.startsWith('#')) {
    cleanName = '#' + cleanName
  }

  const { error } = await supabase
    .from('tags')
    .insert([{ 
      family_id: familyMember.family_id,
      name: cleanName,
      color: color || '#64748b', // Default slate
    }])

  if (error) {
    console.error(error)
    throw new Error("Error al crear etiqueta")
  }

  revalidatePath('/dashboard/tags')
}

export async function deleteTag(tagId: string) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('tags')
    .delete()
    .eq('id', tagId)

  if (error) {
    throw new Error("No se puede eliminar la etiqueta.")
  }

  revalidatePath('/dashboard/tags')
}
