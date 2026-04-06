'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
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
    if (cleaned.length <= 11)
      return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7, 11)}`
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!form.size) {
      toast.error('Selecione um tamanho')
      return
    }

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

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.message || 'Erro ao criar encomenda')
      }

      const { order } = await res.json()

      // Redireciona para tela de sucesso
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

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Nome */}
      <div className="space-y-2">
        <Label htmlFor="name" className="text-zinc-300">
          Nome completo *
        </Label>
        <Input
          id="name"
          placeholder="Seu nome completo"
          value={form.customer_name}
          onChange={(e) => setForm({ ...form, customer_name: e.target.value })}
          required
          className="bg-zinc-900 border-zinc-700 text-white placeholder:text-zinc-600 focus-visible:ring-red-500"
        />
      </div>

      {/* Telefone */}
      <div className="space-y-2">
        <Label htmlFor="phone" className="text-zinc-300">
          WhatsApp *
        </Label>
        <Input
          id="phone"
          placeholder="(11) 99999-9999"
          value={form.customer_phone}
          onChange={(e) => setForm({ ...form, customer_phone: formatPhone(e.target.value) })}
          required
          maxLength={15}
          className="bg-zinc-900 border-zinc-700 text-white placeholder:text-zinc-600 focus-visible:ring-red-500"
        />
      </div>

      {/* Tamanho */}
      <div className="space-y-2">
        <Label className="text-zinc-300">Tamanho *</Label>
        <Select
          value={form.size}
          onValueChange={(v) => setForm({ ...form, size: v as Size })}
          required
        >
          <SelectTrigger className="bg-zinc-900 border-zinc-700 text-white focus:ring-red-500">
            <SelectValue placeholder="Selecione o tamanho" />
          </SelectTrigger>
          <SelectContent className="bg-zinc-900 border-zinc-700">
            {product.sizes.map((size) => (
              <SelectItem
                key={size}
                value={size}
                className="text-white focus:bg-zinc-800 focus:text-red-400"
              >
                {size}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Quantidade */}
      <div className="space-y-2">
        <Label htmlFor="quantity" className="text-zinc-300">
          Quantidade
        </Label>
        <Select
          value={form.quantity.toString()}
          onValueChange={(v) => setForm({ ...form, quantity: parseInt(v) })}
        >
          <SelectTrigger className="bg-zinc-900 border-zinc-700 text-white focus:ring-red-500">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-zinc-900 border-zinc-700">
            {[...Array(10)].map((_, i) => (
              <SelectItem
                key={i + 1}
                value={(i + 1).toString()}
                className="text-white focus:bg-zinc-800 focus:text-red-400"
              >
                {i + 1} peça{i + 1 > 1 ? 's' : ''}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Total preview */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
        <div className="flex justify-between items-center text-sm text-zinc-400 mb-2">
          <span>
            {formatCurrency(product.price)} × {form.quantity}
          </span>
          <span>subtotal</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="font-semibold text-white">Total</span>
          <span className="text-2xl font-black text-red-400">{formatCurrency(total)}</span>
        </div>
      </div>

      <Button
        type="submit"
        size="xl"
        disabled={loading}
        className="w-full bg-red-500 hover:bg-red-600 text-white font-black uppercase tracking-wide"
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Processando...
          </>
        ) : (
          'Finalizar Encomenda'
        )}
      </Button>
    </form>
  )
}
