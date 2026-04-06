import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

function getClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const filter = searchParams.get('filter') || 'all'
  const productId = searchParams.get('product_id')

  const supabase = getClient()
  let query = supabase
    .from('orders')
    .select('*, product:products(name)')
    .order('created_at', { ascending: false })

  if (filter === 'paid') query = query.eq('status', 'paid')
  if (filter === 'pending') query = query.eq('status', 'pending')
  if (productId) query = query.eq('product_id', productId)

  const { data, error } = await query
  if (error) return NextResponse.json({ message: error.message }, { status: 500 })

  const orders = data || []

  // Gera CSV
  const headers = ['ID', 'Data', 'Cliente', 'WhatsApp', 'Produto', 'Tamanho', 'Qtd', 'Total (R$)', 'Status']

  const rows = orders.map((order) => [
    order.id,
    new Date(order.created_at).toLocaleString('pt-BR'),
    `"${order.customer_name}"`,
    order.customer_phone,
    `"${(order as any).product?.name || ''}"`,
    order.size,
    order.quantity,
    order.total_price.toFixed(2).replace('.', ','),
    order.status === 'paid' ? 'Pago' : 'Pendente',
  ])

  const csvContent = [headers.join(';'), ...rows.map((row) => row.join(';'))].join('\n')
  const bom = '\uFEFF' // BOM para Excel reconhecer UTF-8

  return new NextResponse(bom + csvContent, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="pedidos-${filter}.csv"`,
    },
  })
}
