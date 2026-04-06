import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

function getAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

// GET /api/products — lista produtos públicos
export async function GET() {
  const supabase = getAdminClient()
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('active', true)
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ message: error.message }, { status: 500 })
  return NextResponse.json({ products: data })
}

// POST /api/products — cria produto (admin)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, description, price, image_url, sizes, active } = body

    if (!name || !price) {
      return NextResponse.json({ message: 'Nome e preço são obrigatórios' }, { status: 400 })
    }

    const supabase = getAdminClient()
    const { data, error } = await supabase
      .from('products')
      .insert({ name, description, price, image_url, sizes: sizes || ['P', 'M', 'G', 'GG', 'XG'], active: active ?? true })
      .select()
      .single()

    if (error) return NextResponse.json({ message: error.message }, { status: 500 })
    return NextResponse.json({ product: data }, { status: 201 })
  } catch {
    return NextResponse.json({ message: 'Erro interno' }, { status: 500 })
  }
}
