'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function login(formData: FormData) {
  const supabase = await createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    const returnToParam = formData.get('returnTo') ? `&returnTo=${encodeURIComponent(formData.get('returnTo') as string)}` : ''
    redirect(`/login?message=Error al iniciar sesión. Revisa tus credenciales.${returnToParam}`)
  }

  const returnTo = formData.get('returnTo') as string
  const destination = returnTo || '/dashboard'

  revalidatePath('/', 'layout')
  redirect(destination)
}

export async function signup(formData: FormData) {
  const supabase = await createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signUp(data)

  if (error) {
    const returnToParam = formData.get('returnTo') ? `&returnTo=${encodeURIComponent(formData.get('returnTo') as string)}` : ''
    redirect(`/login?message=No se pudo crear la cuenta. ${error.message}${returnToParam}`)
  }

  // Auto-login since the user is auto-confirmed by the trigger
  await supabase.auth.signInWithPassword(data)
  
  const returnTo = formData.get('returnTo') as string
  const destination = returnTo || '/dashboard'

  revalidatePath('/', 'layout')
  redirect(destination)
}
