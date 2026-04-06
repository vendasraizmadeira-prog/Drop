import { createServerSupabaseClient } from '@/lib/supabase-server'
import { formatCurrency } from '@/lib/utils'
import { DollarSign, ShoppingBag, Clock, CheckCircle2, Package } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ExportButtons } from './export-buttons'
import type { Order, Product, Size } from '@/types'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Relatórios' }

const SIZES: Size[] = ['P', 'M', 'G', 'GG', 'XG']

interface PageProps {
  searchParams: { product?: string }
}

export default async function ReportsPage({ searchParams }: PageProps) {
  const supabase = createServerSupabaseClient()

  // Busca produtos para o filtro
  const { data: products } = await supabase
    .from('products')
    .select('id, name')
    .order('name')

  // Busca pedidos com filtro de produto
  let query = supabase
    .from('orders')
    .select('*, product:products(id, name, price)')
    .order('created_at', { ascending: false })

  if (searchParams.product) {
    query = query.eq('product_id', searchParams.product)
  }

  const { data: orders } = await query
  const allOrders = (orders || []) as Order[]

  const selectedProduct = products?.find((p) => p.id === searchParams.product)

  // Métricas
  const totalRevenue = allOrders.reduce((sum, o) => sum + o.total_price, 0)
  const paidRevenue = allOrders.filter((o) => o.status === 'paid').reduce((sum, o) => sum + o.total_price, 0)
  const pendingRevenue = allOrders.filter((o) => o.status === 'pending').reduce((sum, o) => sum + o.total_price, 0)
  const totalShirts = allOrders.reduce((sum, o) => sum + o.quantity, 0)
  const paidCount = allOrders.filter((o) => o.status === 'paid').length
  const pendingCount = allOrders.filter((o) => o.status === 'pending').length

  // Contagem por tamanho
  const sizeCount = SIZES.reduce((acc, size) => {
    acc[size] = allOrders.filter((o) => o.size === size).reduce((sum, o) => sum + o.quantity, 0)
    return acc
  }, {} as Record<Size, number>)
  const maxSizeCount = Math.max(...Object.values(sizeCount), 1)

  // Resumo por produto (somente quando não filtrado)
  const productSummary = !searchParams.product
    ? (products || []).map((p) => {
        const productOrders = allOrders.filter((o) => (o as any).product?.id === p.id)
        return {
          id: p.id,
          name: p.name,
          total: productOrders.reduce((sum, o) => sum + o.total_price, 0),
          paid: productOrders.filter((o) => o.status === 'paid').reduce((sum, o) => sum + o.total_price, 0),
          count: productOrders.length,
          shirts: productOrders.reduce((sum, o) => sum + o.quantity, 0),
        }
      }).filter((p) => p.count > 0)
    : []

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <h1 className="text-2xl font-black text-white">Relatórios</h1>
            <p className="text-zinc-500 text-sm mt-1">
              {selectedProduct ? `Produto: ${selectedProduct.name}` : 'Visão geral de vendas'}
            </p>
          </div>
        </div>

        {/* Filtro por produto — scroll horizontal no mobile */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          <a href="/admin/reports" className="shrink-0">
            <button className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap ${
              !searchParams.product
                ? 'bg-red-500 text-white'
                : 'bg-zinc-900 border border-zinc-700 text-zinc-400'
            }`}>
              Todos os produtos
            </button>
          </a>
          {products?.map((p) => (
            <a key={p.id} href={`/admin/reports?product=${p.id}`} className="shrink-0">
              <button className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap ${
                searchParams.product === p.id
                  ? 'bg-red-500 text-white'
                  : 'bg-zinc-900 border border-zinc-700 text-zinc-400'
              }`}>
                {p.name}
              </button>
            </a>
          ))}
        </div>

        {/* Botões de exportação — largura total no mobile */}
        <div className="mt-4">
          <ExportButtons productId={searchParams.product} />
        </div>
      </div>

      {/* Cards de resumo */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader className="flex flex-row items-center justify-between pb-1 pt-4 px-4">
            <CardTitle className="text-xs font-medium text-zinc-400">Total Vendas</CardTitle>
            <DollarSign className="h-3.5 w-3.5 text-red-400 shrink-0" />
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <p className="text-xl font-black text-white">{formatCurrency(totalRevenue)}</p>
            <p className="text-xs text-zinc-500 mt-0.5">{allOrders.length} pedidos</p>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader className="flex flex-row items-center justify-between pb-1 pt-4 px-4">
            <CardTitle className="text-xs font-medium text-zinc-400">Pago</CardTitle>
            <CheckCircle2 className="h-3.5 w-3.5 text-green-400 shrink-0" />
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <p className="text-xl font-black text-green-400">{formatCurrency(paidRevenue)}</p>
            <p className="text-xs text-zinc-500 mt-0.5">{paidCount} pedidos</p>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader className="flex flex-row items-center justify-between pb-1 pt-4 px-4">
            <CardTitle className="text-xs font-medium text-zinc-400">Pendente</CardTitle>
            <Clock className="h-3.5 w-3.5 text-yellow-400 shrink-0" />
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <p className="text-xl font-black text-yellow-400">{formatCurrency(pendingRevenue)}</p>
            <p className="text-xs text-zinc-500 mt-0.5">{pendingCount} pedidos</p>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader className="flex flex-row items-center justify-between pb-1 pt-4 px-4">
            <CardTitle className="text-xs font-medium text-zinc-400">Camisetas</CardTitle>
            <ShoppingBag className="h-3.5 w-3.5 text-red-400 shrink-0" />
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <p className="text-xl font-black text-white">{totalShirts}</p>
            <p className="text-xs text-zinc-500 mt-0.5">unidades</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        {/* Distribuição por tamanho */}
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader className="pb-3">
            <CardTitle className="text-white text-sm font-bold">Por Tamanho</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {SIZES.map((size) => {
                const count = sizeCount[size]
                const percent = Math.round((count / maxSizeCount) * 100)
                return (
                  <div key={size}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-bold text-white">{size}</span>
                      <span className="text-zinc-400 text-xs">{count} peças</span>
                    </div>
                    <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-red-500 rounded-full"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Últimos pedidos */}
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader className="pb-3">
            <CardTitle className="text-white text-sm font-bold">Últimos Pedidos</CardTitle>
          </CardHeader>
          <CardContent>
            {allOrders.length === 0 ? (
              <p className="text-zinc-500 text-sm text-center py-4">Nenhum pedido ainda</p>
            ) : (
              <div className="space-y-2">
                {allOrders.slice(0, 6).map((order) => (
                  <div key={order.id} className="flex items-center justify-between py-2 border-b border-zinc-800 last:border-0">
                    <div className="min-w-0 flex-1 mr-2">
                      <p className="text-sm font-medium text-white truncate">{order.customer_name}</p>
                      <p className="text-xs text-zinc-500 truncate">
                        {(order as any).product?.name} · {order.size} · ×{order.quantity}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-bold text-red-400">{formatCurrency(order.total_price)}</p>
                      <p className={`text-xs ${order.status === 'paid' ? 'text-green-400' : 'text-yellow-400'}`}>
                        {order.status === 'paid' ? 'Pago' : 'Pendente'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Resumo por produto (visão geral) */}
      {productSummary.length > 0 && (
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader className="pb-3">
            <CardTitle className="text-white text-sm font-bold flex items-center gap-2">
              <Package className="h-4 w-4 text-red-400" />
              Vendas por Produto
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-0">
              {productSummary
                .sort((a, b) => b.total - a.total)
                .map((p, i) => (
                  <a key={p.id} href={`/admin/reports?product=${p.id}`}>
                    <div className="flex items-center gap-3 py-3 border-b border-zinc-800 last:border-0 hover:bg-zinc-800/40 rounded-lg px-2 -mx-2 transition-colors cursor-pointer">
                      <span className="text-zinc-600 text-xs font-bold w-4 shrink-0">{i + 1}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-white truncate">{p.name}</p>
                        <p className="text-xs text-zinc-500">{p.count} pedidos · {p.shirts} peças</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-sm font-black text-red-400">{formatCurrency(p.total)}</p>
                        <p className="text-xs text-green-400">{formatCurrency(p.paid)} pago</p>
                      </div>
                    </div>
                  </a>
                ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
