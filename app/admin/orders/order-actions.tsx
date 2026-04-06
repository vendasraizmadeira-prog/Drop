'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { CheckCircle, MessageCircle, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { generateWhatsAppContactLink } from '@/lib/whatsapp'
import type { Order } from '@/types'

export function OrderActions({ order }: { order: Order }) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function markAsPaid() {
    if (!confirm(`Confirmar pagamento do pedido de ${order.customer_name}?`)) return
    setLoading(true)
    try {
      const res = await fetch(`/api/orders/${order.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'paid' }),
      })
      if (!res.ok) throw new Error('Erro ao atualizar')
      toast.success('Pedido marcado como pago!')
      router.refresh()
    } catch {
      toast.error('Erro ao atualizar pedido')
    } finally {
      setLoading(false)
    }
  }

  const whatsappLink = generateWhatsAppContactLink(
    order.customer_phone,
    `Olá ${order.customer_name}! Confirmamos seu pedido. 😊`
  )

  return (
    <div className="flex items-center justify-end gap-1">
      {order.status === 'pending' && (
        <Button
          size="sm"
          onClick={markAsPaid}
          disabled={loading}
          className="bg-green-600/20 hover:bg-green-600 text-green-400 hover:text-white border border-green-600/30 text-xs"
        >
          {loading ? (
            <Loader2 className="h-3 w-3 animate-spin" />
          ) : (
            <>
              <CheckCircle className="h-3 w-3 mr-1" />
              Pago
            </>
          )}
        </Button>
      )}
      <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
        <Button
          size="sm"
          variant="outline"
          className="border-zinc-700 text-zinc-400 hover:text-green-400 hover:border-green-500/50 text-xs"
        >
          <MessageCircle className="h-3 w-3 mr-1" />
          Contato
        </Button>
      </a>
    </div>
  )
}
