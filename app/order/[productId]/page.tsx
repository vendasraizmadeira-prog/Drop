import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { Navbar } from '@/components/navbar'
import { formatCurrency } from '@/lib/utils'
import { OrderForm } from './order-form'

interface PageProps {
  params: { productId: string }
}

export default async function OrderPage({ params }: PageProps) {
  const supabase = createServerSupabaseClient()
  const { data: product } = await supabase.from('products').select('*').eq('id', params.productId).eq('active', true).single()
  if (!product) notFound()

  const { data: pixSetting } = await supabase.from('settings').select('value').eq('key', 'pix_key').single()
  const pixKey = pixSetting?.value || ''

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container py-8 max-w-4xl">
        <Link href={`/products/${product.id}`}>
          <button className="flex items-center gap-1.5 text-sm text-brown-500 hover:text-brown-700 mb-8 transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </button>
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Resumo do produto */}
          <div className="bg-white border border-brown-100 rounded-2xl p-5 shadow-sm h-fit">
            <div className="relative aspect-[4/3] rounded-xl overflow-hidden mb-4 bg-brown-50">
              <Image
                src={product.image_url || 'https://images.unsplash.com/photo-1594938298603-c8148c4b4e39?w=500&q=80'}
                alt={product.name}
                fill
                className="object-cover"
                sizes="400px"
              />
            </div>
            <h2 className="font-serif font-bold text-brown-800 text-lg mb-1">{product.name}</h2>
            <p className="text-brown-500 text-sm mb-4 line-clamp-2">{product.description}</p>
            <div className="flex items-center justify-between border-t border-brown-100 pt-4">
              <span className="text-brown-400 text-sm">Preço por peça</span>
              <span className="font-serif font-bold text-brown-700 text-xl">{formatCurrency(product.price)}</span>
            </div>
          </div>

          {/* Formulário */}
          <div>
            <h1 className="font-serif text-2xl font-bold text-brown-800 mb-1">Fazer Encomenda</h1>
            <p className="text-brown-500 text-sm mb-6">
              Preencha os dados abaixo. Após confirmar, você receberá as instruções de pagamento via PIX.
            </p>
            <OrderForm product={product} pixKey={pixKey} />
          </div>
        </div>
      </div>

      <footer className="border-t border-brown-100 mt-16 py-6 text-center text-xs text-brown-400">
        © {new Date().getFullYear()} Maranatha Moda Católica — Irapuã, SP
      </footer>
    </div>
  )
}
