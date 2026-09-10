'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createCategory(formData: FormData) {
  const name = formData.get('name') as string
  const color = formData.get('color') as string
  const icon = formData.get('icon') as string

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

  const { error } = await supabase
    .from('categories')
    .insert([{ 
      family_id: familyMember.family_id,
      name,
      color: color || '#10b981', // Default emerald
      icon: icon || 'Tag',
      is_active: true
    }])

  if (error) {
    console.error(error)
    throw new Error("Error al crear categoría")
  }

  revalidatePath('/dashboard/categories')
}

export async function toggleCategoryStatus(categoryId: string, isActive: boolean) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('categories')
    .update({ is_active: isActive })
    .eq('id', categoryId)

  if (error) {
    throw new Error("Error al actualizar la categoría")
  }

  revalidatePath('/dashboard/categories')
}

export async function deleteCategory(categoryId: string) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('categories')
    .delete()
    .eq('id', categoryId)

  if (error) {
    throw new Error("No se puede eliminar la categoría. Puede que tenga gastos asociados.")
  }

  revalidatePath('/dashboard/categories')
}

export async function createDefaultCategories() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error("No autorizado")

  const { data: familyMember } = await supabase
    .from('family_members')
    .select('family_id')
    .eq('user_id', user.id)
    .single()
    
  if (!familyMember) throw new Error("No perteneces a ninguna familia")

  const defaultCategories = [
    { name: 'Vivienda', color: '#f97316', icon: 'Home' },
    { name: 'Servicios (Luz, Agua)', color: '#eab308', icon: 'Zap' },
    { name: 'Suscripciones y Software', color: '#8b5cf6', icon: 'Laptop' },
    { name: 'Ahorros e Inversiones', color: '#10b981', icon: 'PiggyBank' },
    { name: 'Negocios y Obligaciones Legales', color: '#64748b', icon: 'Briefcase' },
    { name: 'Supermercado', color: '#22c55e', icon: 'ShoppingCart' },
    { name: 'Transporte', color: '#3b82f6', icon: 'Car' },
    { name: 'Salud', color: '#ef4444', icon: 'Heart' },
    { name: 'Educación', color: '#0ea5e9', icon: 'GraduationCap' },
    { name: 'Restaurantes y Comida Afuera', color: '#f43f5e', icon: 'Utensils' },
    { name: 'Entretenimiento', color: '#d946ef', icon: 'Film' },
    { name: 'Deportes y Bienestar', color: '#14b8a6', icon: 'Activity' },
    { name: 'Gastos Personales', color: '#ec4899', icon: 'ShoppingBag' },
  ].map(cat => ({
    ...cat,
    family_id: familyMember.family_id,
    is_active: true
  }))

  const { error } = await supabase
    .from('categories')
    .insert(defaultCategories)

  if (error) {
    console.error(error)
    throw new Error("Error al crear categorías por defecto")
  }

  revalidatePath('/dashboard/categories')
}
