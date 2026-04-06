import { createServerSupabaseClient } from '@/lib/supabase-server'
import { ProductCard } from '@/components/product-card'
import { Navbar } from '@/components/navbar'
import { Flame, MessageCircle, Truck, Shield } from 'lucide-react'
import type { Product } from '@/types'

export const revalidate = 60

export default async function HomePage() {
  let products: Product[] = []
  try {
    const supabase = createServerSupabaseClient()
    const { data } = await supabase
      .from('products')
      .select('*')
      .eq('active', true)
      .order('created_at', { ascending: false })
    products = data || []
  } catch {
    products = []
  }

  return (
    <div className="min-h-screen bg-black">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-zinc-800">
        <div className="absolute inset-0 bg-gradient-to-br from-red-950/30 via-black to-black" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-red-500/5 rounded-full blur-3xl" />
        <div className="container relative py-20 md:py-32">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-full px-4 py-1.5 mb-6">
              <Flame className="h-4 w-4 text-red-400" />
              <span className="text-sm font-semibold text-red-400 uppercase tracking-wider">
                Pré-venda ativa
              </span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-white leading-none tracking-tight mb-6">
              ESTILO SEM
              <br />
              <span className="text-red-500">LIMITE</span>
            </h1>
            <p className="text-lg text-zinc-400 mb-8 max-w-lg">
              Camisetas exclusivas por encomenda. Cada peça produzida com qualidade premium,
              pensada pra quem vive o estilo streetwear de verdade.
            </p>
            <div className="flex flex-wrap gap-4 text-sm text-zinc-400">
              <div className="flex items-center gap-2">
                <Truck className="h-4 w-4 text-red-400" />
                <span>Entrega em todo Brasil</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-red-400" />
                <span>Pagamento seguro via PIX</span>
              </div>
              <div className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4 text-red-400" />
                <span>Suporte via WhatsApp</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="container py-12 md:py-20">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-3xl font-black text-white uppercase tracking-tight">
              Coleção
            </h2>
            <p className="text-zinc-500 mt-1">
              {products?.length || 0} peças disponíveis
            </p>
          </div>
          <div className="h-px flex-1 bg-gradient-to-r from-zinc-800 to-transparent mx-6" />
        </div>

        {products && products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product: Product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 rounded-full bg-zinc-900 flex items-center justify-center mb-4">
              <Flame className="h-8 w-8 text-zinc-700" />
            </div>
            <p className="text-zinc-400 text-lg font-medium">Novidades em breve</p>
            <p className="text-zinc-600 text-sm mt-1">Fique ligado no próximo drop</p>
          </div>
        )}
      </section>

      {/* Contact Section */}
      <section id="contact" className="border-t border-zinc-800 bg-zinc-950">
        <div className="container py-16 text-center">
          <h3 className="text-2xl font-black text-white mb-3">Dúvidas? Fala com a gente</h3>
          <p className="text-zinc-400 mb-6">
            Atendimento rápido pelo WhatsApp de segunda a sábado
          </p>
          <a
            href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '5511999999999'}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold px-6 py-3 rounded-lg transition-colors"
          >
            <MessageCircle className="h-5 w-5" />
            Chamar no WhatsApp
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-800 py-6 text-center text-sm text-zinc-600">
        <p>© {new Date().getFullYear()} Drop Store. Todos os direitos reservados.</p>
      </footer>
    </div>
  )
}
