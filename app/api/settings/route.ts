import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

function getClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

// GET /api/settings
export async function GET() {
  const supabase = getClient()
  const { data, error } = await supabase.from('settings').select('*')
  if (error) return NextResponse.json({ message: error.message }, { status: 500 })
  return NextResponse.json({ settings: data })
}

// POST /api/settings — upsert
export async function POST(request: NextRequest) {
  try {
    const { key, value } = await request.json()
    if (!key) return NextResponse.json({ message: 'Key é obrigatório' }, { status: 400 })

    const supabase = getClient()
    const { data, error } = await supabase
      .from('settings')
      .upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: 'key' })
      .select()
      .single()

    if (error) return NextResponse.json({ message: error.message }, { status: 500 })
    return NextResponse.json({ setting: data })
  } catch {
    return NextResponse.json({ message: 'Erro interno' }, { status: 500 })
  }
}
