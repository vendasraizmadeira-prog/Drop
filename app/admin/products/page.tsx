import Link from 'next/link'
import Image from 'next/image'
import { Plus, Pencil } from 'lucide-react'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { formatCurrency } from '@/lib/utils'
import { DeleteProductButton } from './delete-button'
import type { Product } from '@/types'

export const dynamic = 'force-dynamic'

export default async function ProductsPage() {
  const supabase = createServerSupabaseClient()
  const { data: products } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-white">Produtos</h1>
          <p className="text-zinc-500 text-sm mt-1">{products?.length || 0} produtos cadastrados</p>
        </div>
        <Link href="/admin/products/new">
          <Button className="bg-red-500 hover:bg-red-600 text-white font-bold">
            <Plus className="mr-2 h-4 w-4" />
            Novo Produto
          </Button>
        </Link>
      </div>

      {/* Products Grid */}
      {products && products.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {products.map((product: Product) => (
            <div
              key={product.id}
              className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden"
            >
              <div className="relative aspect-video">
                <Image
                  src={
                    product.image_url ||
                    'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=500&q=80'
                  }
                  alt={product.name}
                  fill
                  className="object-cover"
                  sizes="400px"
                />
                <div className="absolute top-2 right-2">
                  <Badge variant={product.active ? 'success' : 'secondary'}>
                    {product.active ? 'Ativo' : 'Inativo'}
                  </Badge>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-white mb-1 line-clamp-1">{product.name}</h3>
                <p className="text-zinc-500 text-sm line-clamp-2 mb-3">{product.description}</p>
                <div className="flex flex-wrap gap-1 mb-3">
                  {product.sizes.map((s: string) => (
                    <Badge key={s} variant="outline" className="text-xs border-zinc-700 text-zinc-400">
                      {s}
                    </Badge>
                  ))}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-red-400 font-black text-lg">
                    {formatCurrency(product.price)}
                  </span>
                  <div className="flex gap-2">
                    <Link href={`/admin/products/${product.id}/edit`}>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-zinc-700 text-zinc-300 hover:bg-zinc-800"
                      >
                        <Pencil className="h-3 w-3 mr-1" />
                        Editar
                      </Button>
                    </Link>
                    <DeleteProductButton productId={product.id} productName={product.name} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-zinc-500 mb-4">Nenhum produto cadastrado ainda.</p>
          <Link href="/admin/products/new">
            <Button className="bg-red-500 hover:bg-red-600">
              <Plus className="mr-2 h-4 w-4" />
              Criar primeiro produto
            </Button>
          </Link>
        </div>
      )}
    </div>
  )
}
