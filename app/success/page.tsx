'use client'

import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import Link from 'next/link'
import { CheckCircle2, MessageCircle, ArrowLeft, ShoppingBag } from 'lucide-react'
import { Button } from '@/components/ui/button'
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
    vendorNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '5511999999999',
    customerName,
    customerPhone,
    productName,
    size,
    quantity,
    total,
  })

  return (
    <div className="min-h-screen bg-black">
      <Navbar />

      <div className="container py-8 max-w-xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/10 border border-green-500/30 mb-4">
            <CheckCircle2 className="h-8 w-8 text-green-400" />
          </div>
          <h1 className="text-3xl font-black text-white mb-2">Encomenda Registrada!</h1>
          <p className="text-zinc-400">
            Agora realize o pagamento via PIX e envie a confirmação pelo WhatsApp.
          </p>
        </div>

        {/* Order Summary */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 mb-6">
          <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-4">
            Resumo da Encomenda
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-zinc-500">Produto</span>
              <span className="text-white font-medium">{productName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">Cliente</span>
              <span className="text-white font-medium">{customerName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">Tamanho</span>
              <span className="text-white font-medium">{size}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">Quantidade</span>
              <span className="text-white font-medium">{quantity}</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-zinc-800">
              <span className="text-zinc-400 font-semibold">Total</span>
              <span className="text-red-400 font-black text-lg">{formatCurrency(total)}</span>
            </div>
          </div>
        </div>

        {/* PIX Section */}
        {pixKey ? (
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 mb-6">
            <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-6 text-center">
              Pagamento via PIX
            </h3>
            <PixQRCode
              pixKey={pixKey}
              amount={total}
              merchantName="LOJA"
              merchantCity="BRASIL"
              description={`Encomenda ${productName}`}
            />
          </div>
        ) : (
          <div className="bg-zinc-900 border border-yellow-500/20 rounded-xl p-5 mb-6 text-center">
            <p className="text-yellow-400 text-sm">
              A chave PIX ainda não foi configurada. Entre em contato pelo WhatsApp para obter os
              dados de pagamento.
            </p>
          </div>
        )}

        {/* WhatsApp CTA */}
        <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
          <Button
            size="xl"
            className="w-full bg-green-600 hover:bg-green-700 text-white font-black uppercase tracking-wide mb-4"
          >
            <MessageCircle className="mr-2 h-6 w-6" />
            Enviar confirmação pelo WhatsApp
          </Button>
        </a>

        <p className="text-xs text-zinc-600 text-center mb-8">
          Clique acima para abrir o WhatsApp com a mensagem de confirmação já preenchida.
        </p>

        {/* Back links */}
        <div className="flex gap-3">
          <Link href="/" className="flex-1">
            <Button
              variant="outline"
              className="w-full border-zinc-700 text-zinc-400 hover:text-white hover:bg-zinc-900"
            >
              <ShoppingBag className="mr-2 h-4 w-4" />
              Ver mais produtos
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-zinc-400">Carregando...</div>
    </div>}>
      <SuccessContent />
    </Suspense>
  )
}
