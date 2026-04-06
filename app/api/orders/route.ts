import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

function getClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

// GET /api/orders — lista pedidos (admin)
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const status = searchParams.get('status')
  const productId = searchParams.get('product_id')

  const supabase = getClient()
  let query = supabase
    .from('orders')
    .select('*, product:products(id, name)')
    .order('created_at', { ascending: false })

  if (status) query = query.eq('status', status)
  if (productId) query = query.eq('product_id', productId)

  const { data, error } = await query
  if (error) return NextResponse.json({ message: error.message }, { status: 500 })
  return NextResponse.json({ orders: data })
}

// POST /api/orders — cria pedido (público)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { product_id, customer_name, customer_phone, size, quantity, total_price } = body

    // Validações
    if (!product_id || !customer_name || !customer_phone || !size || !quantity) {
      return NextResponse.json({ message: 'Dados incompletos' }, { status: 400 })
    }

    if (quantity < 1 || quantity > 10) {
      return NextResponse.json({ message: 'Quantidade inválida (1-10)' }, { status: 400 })
    }

    const supabase = getClient()

    // Verifica se produto existe e está ativo
    const { data: product, error: productError } = await supabase
      .from('products')
      .select('id, price')
      .eq('id', product_id)
      .eq('active', true)
      .single()

    if (productError || !product) {
      return NextResponse.json({ message: 'Produto não encontrado' }, { status: 404 })
    }

    // Calcula total no servidor
    const calculatedTotal = product.price * quantity

    const { data, error } = await supabase
      .from('orders')
      .insert({
        product_id,
        customer_name: customer_name.trim(),
        customer_phone,
        size,
        quantity,
        total_price: calculatedTotal,
        status: 'pending',
      })
      .select()
      .single()

    if (error) return NextResponse.json({ message: error.message }, { status: 500 })
    return NextResponse.json({ order: data }, { status: 201 })
  } catch {
    return NextResponse.json({ message: 'Erro interno' }, { status: 500 })
  }
}
