'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { formatCurrency } from '@/lib/utils'
import type { Product, Size } from '@/types'

interface OrderFormProps {
  product: Product
  pixKey: string
}

export function OrderForm({ product, pixKey }: OrderFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    customer_name: '',
    customer_phone: '',
    size: '' as Size | '',
    quantity: 1,
  })

  const total = product.price * form.quantity

  function formatPhone(value: string) {
    const cleaned = value.replace(/\D/g, '')
    if (cleaned.length <= 2) return cleaned
    if (cleaned.length <= 7) return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2)}`
    if (cleaned.length <= 11) return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7, 11)}`
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.size) { toast.error('Selecione um tamanho'); return }
    setLoading(true)
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product_id: product.id,
          customer_name: form.customer_name.trim(),
          customer_phone: form.customer_phone.replace(/\D/g, ''),
          size: form.size,
          quantity: form.quantity,
          total_price: total,
        }),
      })
      if (!res.ok) { const e = await res.json(); throw new Error(e.message) }
      const { order } = await res.json()
      const params = new URLSearchParams({
        orderId: order.id,
        customerName: form.customer_name,
        customerPhone: form.customer_phone.replace(/\D/g, ''),
        productName: product.name,
        size: form.size,
        quantity: form.quantity.toString(),
        total: total.toString(),
        pixKey,
      })
      router.push(`/success?${params.toString()}`)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Erro ao criar encomenda')
    } finally {
      setLoading(false)
    }
  }

  const inputClass = "w-full bg-white border border-brown-200 text-brown-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brown-300 focus:border-brown-400 placeholder:text-brown-300 transition-all"

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Nome */}
      <div>
        <label className="block text-sm font-semibold text-brown-700 mb-1.5">Nome completo *</label>
        <input
          type="text"
          placeholder="Seu nome completo"
          value={form.customer_name}
          onChange={(e) => setForm({ ...form, customer_name: e.target.value })}
          required
          className={inputClass}
        />
      </div>

      {/* WhatsApp */}
      <div>
        <label className="block text-sm font-semibold text-brown-700 mb-1.5">WhatsApp *</label>
        <input
          type="tel"
          placeholder="(17) 99999-9999"
          value={form.customer_phone}
          onChange={(e) => setForm({ ...form, customer_phone: formatPhone(e.target.value) })}
          required
          maxLength={15}
          className={inputClass}
        />
      </div>

      {/* Tamanho + Quantidade lado a lado */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-semibold text-brown-700 mb-1.5">Tamanho *</label>
          <Select value={form.size} onValueChange={(v) => setForm({ ...form, size: v as Size })} required>
            <SelectTrigger className="bg-white border-brown-200 text-brown-700 focus:ring-brown-300 rounded-xl">
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent className="bg-white border-brown-200">
              {product.sizes.map((size) => (
                <SelectItem key={size} value={size} className="text-brown-700 focus:bg-brown-50">
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-brown-700 mb-1.5">Quantidade</label>
          <Select value={form.quantity.toString()} onValueChange={(v) => setForm({ ...form, quantity: parseInt(v) })}>
            <SelectTrigger className="bg-white border-brown-200 text-brown-700 focus:ring-brown-300 rounded-xl">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-white border-brown-200">
              {[...Array(10)].map((_, i) => (
                <SelectItem key={i + 1} value={(i + 1).toString()} className="text-brown-700 focus:bg-brown-50">
                  {i + 1} peça{i + 1 > 1 ? 's' : ''}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Total */}
      <div className="bg-brown-50 border border-brown-200 rounded-xl p-4">
        <div className="flex justify-between text-xs text-brown-400 mb-1.5">
          <span>{formatCurrency(product.price)} × {form.quantity}</span>
          <span>subtotal</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="font-semibold text-brown-700">Total a pagar</span>
          <span className="font-serif text-2xl font-bold text-brown-700">{formatCurrency(total)}</span>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-brown-600 hover:bg-brown-700 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition-colors disabled:opacity-60 text-base shadow-md"
      >
        {loading ? (
          <><Loader2 className="h-5 w-5 animate-spin" /> Processando...</>
        ) : (
          'Finalizar Encomenda'
        )}
      </button>
    </form>
  )
}
