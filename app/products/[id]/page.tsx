import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, ShoppingBag, Star } from 'lucide-react'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { Navbar } from '@/components/navbar'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { formatCurrency } from '@/lib/utils'
import type { Product } from '@/types'

interface PageProps {
  params: { id: string }
}

export async function generateMetadata({ params }: PageProps) {
  const supabase = createServerSupabaseClient()
  const { data: product } = await supabase
    .from('products')
    .select('name, description')
    .eq('id', params.id)
    .single()

  if (!product) return { title: 'Produto não encontrado' }
  return { title: product.name, description: product.description }
}

export default async function ProductPage({ params }: PageProps) {
  const supabase = createServerSupabaseClient()
  const { data: product } = await supabase
    .from('products')
    .select('*')
    .eq('id', params.id)
    .eq('active', true)
    .single()

  if (!product) notFound()

  return (
    <div className="min-h-screen bg-black">
      <Navbar />

      <div className="container py-8">
        <Link href="/">
          <Button variant="ghost" size="sm" className="text-zinc-400 hover:text-white mb-8">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para coleção
          </Button>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image */}
          <div className="relative aspect-square rounded-xl overflow-hidden bg-zinc-900">
            <Image
              src={
                product.image_url ||
                'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&q=80'
              }
              alt={product.name}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>

          {/* Details */}
          <div className="flex flex-col justify-center">
            <div className="flex items-center gap-2 mb-4">
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-red-400 text-red-400" />
                ))}
              </div>
              <span className="text-sm text-zinc-500">Exclusivo</span>
            </div>

            <h1 className="text-4xl md:text-5xl font-black text-white mb-4 leading-tight">
              {product.name}
            </h1>

            <p className="text-zinc-400 text-lg leading-relaxed mb-6">{product.description}</p>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-8">
              <span className="text-5xl font-black text-red-400">
                {formatCurrency(product.price)}
              </span>
              <span className="text-zinc-500 text-sm">por peça</span>
            </div>

            {/* Sizes */}
            <div className="mb-8">
              <p className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-3">
                Tamanhos disponíveis
              </p>
              <div className="flex flex-wrap gap-2">
                {(product as Product).sizes.map((size) => (
                  <div
                    key={size}
                    className="w-12 h-12 flex items-center justify-center border border-zinc-700 rounded-lg text-sm font-bold text-white hover:border-red-500 hover:text-red-400 transition-colors cursor-default"
                  >
                    {size}
                  </div>
                ))}
              </div>
            </div>

            {/* Info */}
            <div className="grid grid-cols-2 gap-4 mb-8 text-sm">
              <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-3">
                <p className="text-zinc-500 mb-1">Pagamento</p>
                <p className="text-white font-semibold">PIX (à vista)</p>
              </div>
              <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-3">
                <p className="text-zinc-500 mb-1">Entrega</p>
                <p className="text-white font-semibold">Todo Brasil</p>
              </div>
              <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-3">
                <p className="text-zinc-500 mb-1">Produção</p>
                <p className="text-white font-semibold">Sob encomenda</p>
              </div>
              <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-3">
                <p className="text-zinc-500 mb-1">Material</p>
                <p className="text-white font-semibold">100% Algodão</p>
              </div>
            </div>

            {/* CTA */}
            <Link href={`/order/${product.id}`}>
              <Button
                size="xl"
                className="w-full bg-red-500 hover:bg-red-600 text-white font-black text-lg uppercase tracking-wide"
              >
                <ShoppingBag className="mr-2 h-6 w-6" />
                Fazer Encomenda
              </Button>
            </Link>

            <p className="text-center text-xs text-zinc-600 mt-3">
              Você será redirecionado para o formulário de encomenda
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
