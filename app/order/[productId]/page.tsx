import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { Navbar } from '@/components/navbar'
import { Button } from '@/components/ui/button'
import { formatCurrency } from '@/lib/utils'
import { OrderForm } from './order-form'

interface PageProps {
  params: { productId: string }
}

export default async function OrderPage({ params }: PageProps) {
  const supabase = createServerSupabaseClient()

  const { data: product } = await supabase
    .from('products')
    .select('*')
    .eq('id', params.productId)
    .eq('active', true)
    .single()

  if (!product) notFound()

  // Busca chave PIX das configurações
  const { data: pixSetting } = await supabase
    .from('settings')
    .select('value')
    .eq('key', 'pix_key')
    .single()

  const pixKey = pixSetting?.value || ''

  return (
    <div className="min-h-screen bg-black">
      <Navbar />

      <div className="container py-8 max-w-4xl">
        <Link href={`/products/${product.id}`}>
          <Button variant="ghost" size="sm" className="text-zinc-400 hover:text-white mb-8">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product Summary */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
            <div className="relative aspect-square rounded-lg overflow-hidden mb-4">
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
            </div>
            <h2 className="text-xl font-black text-white mb-2">{product.name}</h2>
            <p className="text-zinc-400 text-sm mb-4 line-clamp-2">{product.description}</p>
            <div className="flex items-center justify-between border-t border-zinc-800 pt-4">
              <span className="text-zinc-400 text-sm">Preço por peça</span>
              <span className="text-red-400 font-black text-2xl">
                {formatCurrency(product.price)}
              </span>
            </div>
          </div>

          {/* Order Form */}
          <div>
            <h1 className="text-2xl font-black text-white mb-2">Fazer Encomenda</h1>
            <p className="text-zinc-400 text-sm mb-6">
              Preencha os dados abaixo. Após confirmar, você receberá as instruções de pagamento
              via PIX.
            </p>
            <OrderForm
              product={product}
              pixKey={pixKey}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
