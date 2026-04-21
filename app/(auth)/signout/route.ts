import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { type NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const supabase = await createClient()

  // Check if a user's logged in
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  await supabase.auth.signOut()
 

  revalidatePath('/', 'layout')
  return NextResponse.redirect(new URL('/', req.url), {
    status: 302,
  })
}