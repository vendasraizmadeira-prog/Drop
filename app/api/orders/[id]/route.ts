import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

function getClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

interface Params { params: { id: string } }

// GET /api/orders/:id
export async function GET(_: NextRequest, { params }: Params) {
  const supabase = getClient()
  const { data, error } = await supabase
    .from('orders')
    .select('*, product:products(*)')
    .eq('id', params.id)
    .single()

  if (error || !data) return NextResponse.json({ message: 'Pedido não encontrado' }, { status: 404 })
  return NextResponse.json({ order: data })
}

// PUT /api/orders/:id — atualiza status (admin)
export async function PUT(request: NextRequest, { params }: Params) {
  try {
    const { status } = await request.json()

    if (!['pending', 'paid'].includes(status)) {
      return NextResponse.json({ message: 'Status inválido' }, { status: 400 })
    }

    const supabase = getClient()
    const { data, error } = await supabase
      .from('orders')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', params.id)
      .select()
      .single()

    if (error) return NextResponse.json({ message: error.message }, { status: 500 })
    return NextResponse.json({ order: data })
  } catch {
    return NextResponse.json({ message: 'Erro interno' }, { status: 500 })
  }
}
