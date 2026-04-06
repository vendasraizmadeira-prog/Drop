'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Loader2, ImageIcon } from 'lucide-react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { formatCurrency } from '@/lib/utils'
import type { Product, Size } from '@/types'

const SIZES: Size[] = ['P', 'M', 'G', 'GG', 'XG']

interface ProductFormProps {
  product?: Product
  mode: 'create' | 'edit'
}

export function ProductForm({ product, mode }: ProductFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    name: product?.name || '',
    description: product?.description || '',
    price: product?.price?.toString() || '',
    image_url: product?.image_url || '',
    sizes: product?.sizes || (['P', 'M', 'G', 'GG', 'XG'] as Size[]),
    active: product?.active ?? true,
  })

  function toggleSize(size: Size) {
    setForm((prev) => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter((s) => s !== size)
        : [...prev.sizes, size],
    }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (form.sizes.length === 0) {
      toast.error('Selecione pelo menos um tamanho')
      return
    }

    const price = parseFloat(form.price)
    if (isNaN(price) || price <= 0) {
      toast.error('Preço inválido')
      return
    }

    setLoading(true)
    try {
      const url = mode === 'edit' ? `/api/products/${product!.id}` : '/api/products'
      const method = mode === 'edit' ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, price }),
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.message || 'Erro ao salvar produto')
      }

      toast.success(mode === 'edit' ? 'Produto atualizado!' : 'Produto criado!')
      router.push('/admin/products')
      router.refresh()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erro ao salvar')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      {/* Nome */}
      <div className="space-y-2">
        <Label className="text-zinc-300">Nome do produto *</Label>
        <Input
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="Ex: Camiseta Oversized Básica"
          required
          className="bg-zinc-900 border-zinc-700 text-white"
        />
      </div>

      {/* Descrição */}
      <div className="space-y-2">
        <Label className="text-zinc-300">Descrição</Label>
        <Textarea
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          placeholder="Descrição do produto, materiais, detalhes..."
          rows={3}
          className="bg-zinc-900 border-zinc-700 text-white resize-none"
        />
      </div>

      {/* Preço */}
      <div className="space-y-2">
        <Label className="text-zinc-300">Preço (R$) *</Label>
        <Input
          type="number"
          step="0.01"
          min="0"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
          placeholder="59.90"
          required
          className="bg-zinc-900 border-zinc-700 text-white"
        />
        {form.price && !isNaN(parseFloat(form.price)) && (
          <p className="text-xs text-zinc-500">
            Valor: {formatCurrency(parseFloat(form.price))}
          </p>
        )}
      </div>

      {/* Imagem URL */}
      <div className="space-y-2">
        <Label className="text-zinc-300">URL da imagem</Label>
        <Input
          value={form.image_url}
          onChange={(e) => setForm({ ...form, image_url: e.target.value })}
          placeholder="https://..."
          className="bg-zinc-900 border-zinc-700 text-white"
        />
        {form.image_url && (
          <div className="relative w-32 h-32 rounded-lg overflow-hidden border border-zinc-700">
            <Image
              src={form.image_url}
              alt="Preview"
              fill
              className="object-cover"
              onError={() => setForm({ ...form, image_url: '' })}
            />
          </div>
        )}
        {!form.image_url && (
          <div className="w-32 h-32 rounded-lg border border-zinc-700 bg-zinc-900 flex items-center justify-center">
            <ImageIcon className="h-8 w-8 text-zinc-600" />
          </div>
        )}
      </div>

      {/* Tamanhos */}
      <div className="space-y-3">
        <Label className="text-zinc-300">Tamanhos disponíveis *</Label>
        <div className="flex gap-3">
          {SIZES.map((size) => (
            <button
              key={size}
              type="button"
              onClick={() => toggleSize(size)}
              className={`w-12 h-12 rounded-lg border text-sm font-bold transition-all ${
                form.sizes.includes(size)
                  ? 'bg-red-500 border-red-500 text-white'
                  : 'border-zinc-700 text-zinc-400 hover:border-zinc-500'
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Status */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => setForm({ ...form, active: !form.active })}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            form.active ? 'bg-red-500' : 'bg-zinc-700'
          }`}
        >
          <span
            className={`inline-block h-4 w-4 rounded-full bg-white transition-transform ${
              form.active ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
        <Label className="text-zinc-300 cursor-pointer" onClick={() => setForm({ ...form, active: !form.active })}>
          {form.active ? 'Produto ativo (visível na loja)' : 'Produto inativo (oculto na loja)'}
        </Label>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <Button
          type="submit"
          disabled={loading}
          className="bg-red-500 hover:bg-red-600 text-white font-bold"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Salvando...
            </>
          ) : mode === 'edit' ? (
            'Salvar alterações'
          ) : (
            'Criar produto'
          )}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          className="border-zinc-700 text-zinc-400 hover:text-white"
        >
          Cancelar
        </Button>
      </div>
    </form>
  )
}
