'use client'

import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import Link from 'next/link'
import { CheckCircle2, MessageCircle, ShoppingBag, Heart } from 'lucide-react'
import { Navbar } from '@/components/navbar'
import { PixQRCode } from '@/components/pix-qr-code'
import { generateWhatsAppOrderLink } from '@/lib/whatsapp'
import { formatCurrency } from '@/lib/utils'

function SuccessContent() {
  const params = useSearchParams()
  const customerName = params.get('customerName') || ''
  const customerPhone = params.get('customerPhone') || ''
  const productName = params.get('productName') || ''
  const size = params.get('size') || ''
  const quantity = parseInt(params.get('quantity') || '1')
  const total = parseFloat(params.get('total') || '0')
  const pixKey = params.get('pixKey') || ''

  const whatsappLink = generateWhatsAppOrderLink({
    vendorNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '5517981274774',
    customerName,
    customerPhone,
    productName,
    size,
    quantity,
    total,
  })

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container py-8 max-w-lg">
        {/* Confirmação */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-50 border-2 border-green-200 mb-4">
            <CheckCircle2 className="h-8 w-8 text-green-500" />
          </div>
          <h1 className="font-serif text-3xl font-bold text-brown-800 mb-2">Encomenda Registrada!</h1>
          <p className="text-brown-500 text-sm">
            Realize o pagamento via PIX e confirme pelo WhatsApp.
          </p>
        </div>

        {/* Resumo */}
        <div className="bg-white border border-brown-100 rounded-2xl p-5 mb-5 shadow-sm">
          <h3 className="text-xs font-bold text-brown-400 uppercase tracking-widest mb-4">
            Resumo do Pedido
          </h3>
          <div className="space-y-2.5 text-sm">
            {[
              { label: 'Produto', value: productName },
              { label: 'Cliente', value: customerName },
              { label: 'Tamanho', value: size },
              { label: 'Quantidade', value: quantity },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between">
                <span className="text-brown-400">{label}</span>
                <span className="text-brown-700 font-medium">{value}</span>
              </div>
            ))}
            <div className="flex justify-between pt-3 border-t border-brown-100">
              <span className="font-semibold text-brown-700">Total</span>
              <span className="font-serif font-bold text-brown-700 text-xl">{formatCurrency(total)}</span>
            </div>
          </div>
        </div>

        {/* PIX */}
        {pixKey ? (
          <div className="bg-white border border-brown-100 rounded-2xl p-6 mb-5 shadow-sm">
            <h3 className="text-xs font-bold text-brown-400 uppercase tracking-widest mb-6 text-center">
              Pagamento via PIX
            </h3>
            <PixQRCode
              pixKey={pixKey}
              amount={total}
              merchantName="MARANATHA"
              merchantCity="IRAPUA"
              description={`Encomenda ${productName}`}
            />
          </div>
        ) : (
          <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-5 mb-5 text-center">
            <p className="text-yellow-700 text-sm">
              A chave PIX ainda não foi configurada. Entre em contato pelo WhatsApp.
            </p>
          </div>
        )}

        {/* WhatsApp CTA */}
        <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
          <button className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition-colors text-base shadow-md mb-3">
            <MessageCircle className="h-5 w-5" />
            Confirmar pelo WhatsApp
          </button>
        </a>
        <p className="text-xs text-brown-400 text-center mb-6">
          Clique para abrir o WhatsApp com a mensagem já preenchida
        </p>

        <Link href="/">
          <button className="w-full border-2 border-brown-200 text-brown-600 hover:bg-brown-50 font-semibold py-3 rounded-2xl flex items-center justify-center gap-2 transition-colors text-sm">
            <ShoppingBag className="h-4 w-4" />
            Ver mais peças
          </button>
        </Link>
      </div>

      <footer className="border-t border-brown-100 mt-12 py-6 text-center text-xs text-brown-400">
        <div className="flex items-center justify-center gap-1.5 mb-1">
          <Heart className="h-3 w-3 text-brown-300 fill-brown-200" />
          <span>Maranatha Moda Católica</span>
        </div>
        Irapuã — SP
      </footer>
    </div>
  )
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-brown-400">Carregando...</div>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  )
}
