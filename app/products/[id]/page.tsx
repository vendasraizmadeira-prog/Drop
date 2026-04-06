import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, ShoppingBag, Heart, Truck, ShieldCheck } from 'lucide-react'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { Navbar } from '@/components/navbar'
import { formatCurrency } from '@/lib/utils'
import type { Product } from '@/types'

interface PageProps {
  params: { id: string }
}

export async function generateMetadata({ params }: PageProps) {
  const supabase = createServerSupabaseClient()
  const { data: product } = await supabase.from('products').select('name, description').eq('id', params.id).single()
  if (!product) return { title: 'Produto não encontrado' }
  return { title: product.name, description: product.description }
}

export default async function ProductPage({ params }: PageProps) {
  const supabase = createServerSupabaseClient()
  const { data: product } = await supabase.from('products').select('*').eq('id', params.id).eq('active', true).single()
  if (!product) notFound()

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container py-8 max-w-5xl">
        <Link href="/">
          <button className="flex items-center gap-1.5 text-sm text-brown-500 hover:text-brown-700 mb-8 transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Voltar para a coleção
          </button>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Image */}
          <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-brown-50 border border-brown-100 shadow-sm">
            <Image
              src={product.image_url || 'https://images.unsplash.com/photo-1594938298603-c8148c4b4e39?w=800&q=80'}
              alt={product.name}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>

          {/* Details */}
          <div className="flex flex-col justify-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-1.5 bg-brown-50 border border-brown-200 rounded-full px-3 py-1 mb-4 w-fit">
              <Heart className="h-3 w-3 text-brown-400 fill-brown-300" />
              <span className="text-xs font-semibold text-brown-500 uppercase tracking-wider">Exclusivo</span>
            </div>

            <h1 className="font-serif text-3xl md:text-4xl font-bold text-brown-800 mb-3 leading-tight">
              {product.name}
            </h1>

            <p className="text-brown-600 leading-relaxed mb-6">{product.description}</p>

            {/* Price */}
            <div className="flex items-baseline gap-2 mb-6">
              <span className="font-serif text-4xl font-bold text-brown-700">
                {formatCurrency(product.price)}
              </span>
              <span className="text-brown-400 text-sm">por peça</span>
            </div>

            {/* Sizes */}
            <div className="mb-6">
              <p className="text-xs font-semibold text-brown-500 uppercase tracking-wider mb-3">
                Tamanhos disponíveis
              </p>
              <div className="flex flex-wrap gap-2">
                {(product as Product).sizes.map((size) => (
                  <div key={size} className="w-11 h-11 flex items-center justify-center border-2 border-brown-200 rounded-lg text-sm font-bold text-brown-600 hover:border-brown-500 hover:text-brown-800 transition-colors">
                    {size}
                  </div>
                ))}
              </div>
            </div>

            {/* Info grid */}
            <div className="grid grid-cols-2 gap-3 mb-8">
              <div className="bg-brown-50 border border-brown-100 rounded-xl p-3 flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-brown-400 shrink-0" />
                <div>
                  <p className="text-xs text-brown-400">Pagamento</p>
                  <p className="text-sm font-semibold text-brown-700">PIX</p>
                </div>
              </div>
              <div className="bg-brown-50 border border-brown-100 rounded-xl p-3 flex items-center gap-2">
                <Truck className="h-4 w-4 text-brown-400 shrink-0" />
                <div>
                  <p className="text-xs text-brown-400">Entrega</p>
                  <p className="text-sm font-semibold text-brown-700">Todo Brasil</p>
                </div>
              </div>
            </div>

            {/* CTA */}
            <Link href={`/order/${product.id}`}>
              <button className="w-full bg-brown-600 hover:bg-brown-700 text-white font-bold text-base py-4 rounded-2xl flex items-center justify-center gap-2 transition-colors shadow-md">
                <ShoppingBag className="h-5 w-5" />
                Fazer Encomenda
              </button>
            </Link>
            <p className="text-center text-xs text-brown-400 mt-3">
              Produção sob encomenda · 100% algodão
            </p>
          </div>
        </div>
      </div>

      {/* Footer mini */}
      <footer className="border-t border-brown-100 mt-16 py-6 text-center text-xs text-brown-400">
        © {new Date().getFullYear()} Maranatha Moda Católica — Irapuã, SP
      </footer>
    </div>
  )
}
