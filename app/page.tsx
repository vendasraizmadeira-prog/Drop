import { createServerSupabaseClient } from '@/lib/supabase-server'
import { ProductCard } from '@/components/product-card'
import { Navbar } from '@/components/navbar'
import { MessageCircle, Instagram, MapPin, Heart, ShieldCheck, Truck } from 'lucide-react'
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
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden bg-brown-50 border-b border-brown-100">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIgMS44LTQgNC00czQgMS44IDQgNC0xLjggNC00IDQtNC0xLjgtNC00eiIgZmlsbD0iI0Q0QzBBOCIgZmlsbC1vcGFjaXR5PSIuMiIvPjwvZz48L3N2Zz4=')] opacity-60" />

        <div className="container relative py-16 md:py-28">
          <div className="max-w-2xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white border border-brown-200 rounded-full px-4 py-1.5 mb-6 shadow-sm">
              <Heart className="h-3.5 w-3.5 text-brown-500 fill-brown-300" />
              <span className="text-xs font-semibold text-brown-600 uppercase tracking-widest">
                Vista sua fé
              </span>
            </div>

            <h1 className="font-serif text-4xl md:text-6xl font-bold text-brown-800 leading-tight mb-5">
              Moda que
              <br />
              <span className="italic text-brown-500">inspira e conecta</span>
            </h1>

            <p className="text-brown-600 text-base md:text-lg leading-relaxed mb-8 max-w-lg mx-auto">
              Peças exclusivas por encomenda, feitas com carinho para quem vive e
              expressa a fé no dia a dia. De Irapuã para todo o Brasil.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-5 text-sm text-brown-500">
              <div className="flex items-center gap-2">
                <Truck className="h-4 w-4" />
                <span>Entrega em todo Brasil</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4" />
                <span>Pagamento seguro via PIX</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>Irapuã — SP</span>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative divider */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brown-300 to-transparent" />
      </section>

      {/* Products */}
      <section className="container py-12 md:py-20">
        <div className="text-center mb-12">
          <p className="text-xs tracking-[0.3em] uppercase text-brown-400 font-semibold mb-2">
            Coleção
          </p>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-brown-800">
            Nossas Peças
          </h2>
          <div className="flex items-center justify-center gap-3 mt-3">
            <div className="h-px w-12 bg-brown-300" />
            <Heart className="h-3 w-3 text-brown-400 fill-brown-300" />
            <div className="h-px w-12 bg-brown-300" />
          </div>
          <p className="text-brown-500 text-sm mt-3">
            {products.length} peça{products.length !== 1 ? 's' : ''} disponível{products.length !== 1 ? 'veis' : ''}
          </p>
        </div>

        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product: Product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 rounded-full bg-brown-100 flex items-center justify-center mb-4">
              <Heart className="h-7 w-7 text-brown-300" />
            </div>
            <p className="text-brown-600 font-medium">Em breve novas peças</p>
            <p className="text-brown-400 text-sm mt-1">Siga no Instagram para acompanhar</p>
          </div>
        )}
      </section>

      {/* About */}
      <section id="about" className="bg-brown-50 border-t border-brown-100">
        <div className="container py-16 md:py-20">
          <div className="max-w-2xl mx-auto text-center">
            <p className="text-xs tracking-[0.3em] uppercase text-brown-400 font-semibold mb-3">
              Nossa história
            </p>
            <h3 className="font-serif text-3xl font-bold text-brown-800 mb-5">
              Sobre a Maranatha
            </h3>
            <p className="text-brown-600 leading-relaxed mb-4">
              Nascida em Irapuã — SP, a Maranatha é uma marca de moda católica criada
              para quem deseja vestir a fé com beleza e propósito.
            </p>
            <p className="text-brown-600 leading-relaxed mb-8">
              Cada peça é produzida sob encomenda, com atenção aos detalhes e ao
              significado por trás de cada criação. Aqui a moda encontra a espiritualidade.
            </p>
            <a
              href="https://instagram.com/vista.maranatha"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-brown-500 hover:bg-brown-600 text-white font-semibold px-6 py-3 rounded-full transition-colors text-sm"
            >
              <Instagram className="h-4 w-4" />
              @vista.maranatha
            </a>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="border-t border-brown-100 bg-white">
        <div className="container py-14 text-center">
          <h3 className="font-serif text-2xl font-bold text-brown-800 mb-2">
            Fale conosco
          </h3>
          <p className="text-brown-500 mb-6 text-sm">
            Atendimento via WhatsApp · Segunda a sábado
          </p>
          <a
            href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '5517981274774'}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold px-7 py-3 rounded-full transition-colors"
          >
            <MessageCircle className="h-5 w-5" />
            Chamar no WhatsApp
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-brown-800 text-brown-300 py-8">
        <div className="container text-center space-y-2">
          <p className="font-serif text-white text-lg font-semibold">Maranatha</p>
          <p className="text-xs tracking-widest uppercase text-brown-400">Moda Católica</p>
          <div className="flex items-center justify-center gap-1.5 text-xs text-brown-500 pt-1">
            <MapPin className="h-3 w-3" />
            <span>Irapuã — SP</span>
          </div>
          <p className="text-xs text-brown-600 pt-2">
            © {new Date().getFullYear()} Maranatha Moda Católica. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  )
}
