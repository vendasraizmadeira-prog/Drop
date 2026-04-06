import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

function getClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

interface Params { params: { id: string } }

// GET /api/products/:id
export async function GET(_: NextRequest, { params }: Params) {
  const supabase = getClient()
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', params.id)
    .single()

  if (error || !data) return NextResponse.json({ message: 'Produto não encontrado' }, { status: 404 })
  return NextResponse.json({ product: data })
}

// PUT /api/products/:id
export async function PUT(request: NextRequest, { params }: Params) {
  try {
    const body = await request.json()
    const supabase = getClient()

    const { data, error } = await supabase
      .from('products')
      .update({ ...body, updated_at: new Date().toISOString() })
      .eq('id', params.id)
      .select()
      .single()

    if (error) return NextResponse.json({ message: error.message }, { status: 500 })
    return NextResponse.json({ product: data })
  } catch {
    return NextResponse.json({ message: 'Erro interno' }, { status: 500 })
  }
}

// DELETE /api/products/:id
export async function DELETE(_: NextRequest, { params }: Params) {
  const supabase = getClient()
  const { error } = await supabase.from('products').delete().eq('id', params.id)
  if (error) return NextResponse.json({ message: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
