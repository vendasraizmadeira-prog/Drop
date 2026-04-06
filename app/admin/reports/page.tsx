import { createServerSupabaseClient } from '@/lib/supabase-server'
import { formatCurrency } from '@/lib/utils'
import { DollarSign, ShoppingBag, Clock, CheckCircle2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ExportButtons } from './export-buttons'
import type { Order, Size } from '@/types'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Relatórios' }

const SIZES: Size[] = ['P', 'M', 'G', 'GG', 'XG']

export default async function ReportsPage() {
  const supabase = createServerSupabaseClient()
  const { data: orders } = await supabase
    .from('orders')
    .select('*, product:products(name)')
    .order('created_at', { ascending: false })

  const allOrders = (orders || []) as Order[]

  const totalRevenue = allOrders.reduce((sum, o) => sum + o.total_price, 0)
  const paidRevenue = allOrders
    .filter((o) => o.status === 'paid')
    .reduce((sum, o) => sum + o.total_price, 0)
  const pendingRevenue = allOrders
    .filter((o) => o.status === 'pending')
    .reduce((sum, o) => sum + o.total_price, 0)

  const totalShirts = allOrders.reduce((sum, o) => sum + o.quantity, 0)
  const paidCount = allOrders.filter((o) => o.status === 'paid').length
  const pendingCount = allOrders.filter((o) => o.status === 'pending').length

  // Contagem por tamanho
  const sizeCount = SIZES.reduce(
    (acc, size) => {
      acc[size] = allOrders
        .filter((o) => o.size === size)
        .reduce((sum, o) => sum + o.quantity, 0)
      return acc
    },
    {} as Record<Size, number>
  )

  const maxSizeCount = Math.max(...Object.values(sizeCount), 1)

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-white">Relatórios</h1>
          <p className="text-zinc-500 text-sm mt-1">Resumo geral de vendas</p>
        </div>
        <ExportButtons />
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">Total de Vendas</CardTitle>
            <DollarSign className="h-4 w-4 text-red-400" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-black text-white">{formatCurrency(totalRevenue)}</p>
            <p className="text-xs text-zinc-500 mt-1">{allOrders.length} pedidos no total</p>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">Total Pago</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-black text-green-400">{formatCurrency(paidRevenue)}</p>
            <p className="text-xs text-zinc-500 mt-1">{paidCount} pedidos pagos</p>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">Pendente</CardTitle>
            <Clock className="h-4 w-4 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-black text-yellow-400">{formatCurrency(pendingRevenue)}</p>
            <p className="text-xs text-zinc-500 mt-1">{pendingCount} pedidos pendentes</p>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">Camisetas Vendidas</CardTitle>
            <ShoppingBag className="h-4 w-4 text-red-400" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-black text-white">{totalShirts}</p>
            <p className="text-xs text-zinc-500 mt-1">unidades no total</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Distribuição por tamanho */}
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-white text-base">Distribuição por Tamanho</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {SIZES.map((size) => {
                const count = sizeCount[size]
                const percent = Math.round((count / maxSizeCount) * 100)
                return (
                  <div key={size}>
                    <div className="flex justify-between text-sm mb-1.5">
                      <span className="font-bold text-white">{size}</span>
                      <span className="text-zinc-400">{count} peças</span>
                    </div>
                    <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-red-500 rounded-full transition-all duration-500"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Últimos 5 pedidos */}
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-white text-base">Últimos Pedidos</CardTitle>
          </CardHeader>
          <CardContent>
            {allOrders.length === 0 ? (
              <p className="text-zinc-500 text-sm text-center py-4">Nenhum pedido ainda</p>
            ) : (
              <div className="space-y-3">
                {allOrders.slice(0, 5).map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between py-2 border-b border-zinc-800 last:border-0"
                  >
                    <div>
                      <p className="text-sm font-medium text-white">{order.customer_name}</p>
                      <p className="text-xs text-zinc-500">
                        {(order as any).product?.name} · {order.size} · ×{order.quantity}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-red-400">
                        {formatCurrency(order.total_price)}
                      </p>
                      <p
                        className={`text-xs ${order.status === 'paid' ? 'text-green-400' : 'text-yellow-400'}`}
                      >
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
    </div>
  )
}
