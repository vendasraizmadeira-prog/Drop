import { createServerSupabaseClient } from '@/lib/supabase-server'
import { formatCurrency, formatDate, formatPhone } from '@/lib/utils'
import { StatusBadge } from '@/components/status-badge'
import { OrderActions } from './order-actions'
import type { Order } from '@/types'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Encomendas' }

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: { product?: string; status?: string }
}) {
  const supabase = createServerSupabaseClient()

  let query = supabase
    .from('orders')
    .select('*, product:products(id, name, price)')
    .order('created_at', { ascending: false })

  if (searchParams.product) {
    query = query.eq('product_id', searchParams.product)
  }
  if (searchParams.status) {
    query = query.eq('status', searchParams.status)
  }

  const { data: orders } = await query

  // Produtos para filtro
  const { data: products } = await supabase
    .from('products')
    .select('id, name')
    .order('name')

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-white">Encomendas</h1>
          <p className="text-zinc-500 text-sm mt-1">{orders?.length || 0} pedidos encontrados</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <a href="/admin/orders">
          <button
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              !searchParams.status && !searchParams.product
                ? 'bg-red-500 text-white'
                : 'bg-zinc-900 border border-zinc-700 text-zinc-400 hover:text-white'
            }`}
          >
            Todos
          </button>
        </a>
        <a href="/admin/orders?status=pending">
          <button
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              searchParams.status === 'pending'
                ? 'bg-yellow-500 text-white'
                : 'bg-zinc-900 border border-zinc-700 text-zinc-400 hover:text-white'
            }`}
          >
            Pendentes
          </button>
        </a>
        <a href="/admin/orders?status=paid">
          <button
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              searchParams.status === 'paid'
                ? 'bg-green-500 text-white'
                : 'bg-zinc-900 border border-zinc-700 text-zinc-400 hover:text-white'
            }`}
          >
            Pagos
          </button>
        </a>
        {products?.map((p) => (
          <a key={p.id} href={`/admin/orders?product=${p.id}`}>
            <button
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                searchParams.product === p.id
                  ? 'bg-zinc-600 text-white'
                  : 'bg-zinc-900 border border-zinc-700 text-zinc-400 hover:text-white'
              }`}
            >
              {p.name}
            </button>
          </a>
        ))}
      </div>

      {/* Table */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-800">
                <th className="text-left px-4 py-3 text-zinc-500 font-semibold uppercase text-xs tracking-wider">
                  Data
                </th>
                <th className="text-left px-4 py-3 text-zinc-500 font-semibold uppercase text-xs tracking-wider">
                  Cliente
                </th>
                <th className="text-left px-4 py-3 text-zinc-500 font-semibold uppercase text-xs tracking-wider">
                  Produto
                </th>
                <th className="text-center px-4 py-3 text-zinc-500 font-semibold uppercase text-xs tracking-wider">
                  Tam
                </th>
                <th className="text-center px-4 py-3 text-zinc-500 font-semibold uppercase text-xs tracking-wider">
                  Qtd
                </th>
                <th className="text-right px-4 py-3 text-zinc-500 font-semibold uppercase text-xs tracking-wider">
                  Total
                </th>
                <th className="text-center px-4 py-3 text-zinc-500 font-semibold uppercase text-xs tracking-wider">
                  Status
                </th>
                <th className="text-right px-4 py-3 text-zinc-500 font-semibold uppercase text-xs tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody>
              {orders && orders.length > 0 ? (
                orders.map((order: Order) => (
                  <tr
                    key={order.id}
                    className="border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors"
                  >
                    <td className="px-4 py-3 text-zinc-400 whitespace-nowrap">
                      {formatDate(order.created_at)}
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-white font-medium">{order.customer_name}</p>
                      <p className="text-zinc-500 text-xs">{formatPhone(order.customer_phone)}</p>
                    </td>
                    <td className="px-4 py-3 text-zinc-300">
                      {(order as any).product?.name || '-'}
                    </td>
                    <td className="px-4 py-3 text-center text-zinc-300 font-semibold">
                      {order.size}
                    </td>
                    <td className="px-4 py-3 text-center text-zinc-300">{order.quantity}</td>
                    <td className="px-4 py-3 text-right text-red-400 font-bold">
                      {formatCurrency(order.total_price)}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="px-4 py-3 text-right">
                      <OrderActions order={order} />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-zinc-500">
                    Nenhuma encomenda encontrada.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
