'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Loader2, Upload, X, ImageIcon } from 'lucide-react'
import Image from 'next/image'
import { formatCurrency } from '@/lib/utils'
import type { Product, Size } from '@/types'

const SIZES: Size[] = ['P', 'M', 'G', 'GG', 'XG']

interface ProductFormProps {
  product?: Product
  mode: 'create' | 'edit'
}

export function ProductForm({ product, mode }: ProductFormProps) {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
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

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const data = new FormData()
      data.append('file', file)

      const res = await fetch('/api/upload', { method: 'POST', body: data })
      const json = await res.json()

      if (!res.ok) throw new Error(json.message || 'Erro no upload')

      setForm((prev) => ({ ...prev, image_url: json.url }))
      toast.success('Imagem enviada!')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erro ao enviar imagem')
    } finally {
      setUploading(false)
      // Limpa o input para permitir reenvio do mesmo arquivo
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  function handleRemoveImage() {
    setForm((prev) => ({ ...prev, image_url: '' }))
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

  const inputClass = "w-full bg-zinc-800 border border-zinc-700 text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 placeholder:text-zinc-500"
  const labelClass = "block text-sm font-medium text-zinc-300 mb-1.5"

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">

      {/* Upload de imagem */}
      <div>
        <label className={labelClass}>Imagem do produto</label>

        {form.image_url ? (
          /* Preview da imagem */
          <div className="relative w-full aspect-[4/3] max-w-xs rounded-xl overflow-hidden border border-zinc-700 group">
            <Image
              src={form.image_url}
              alt="Preview"
              fill
              className="object-cover"
              sizes="320px"
            />
            {/* Overlay com ações */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="bg-white text-zinc-800 text-xs font-semibold px-3 py-2 rounded-lg flex items-center gap-1.5 hover:bg-zinc-100"
              >
                <Upload className="h-3.5 w-3.5" />
                Trocar
              </button>
              <button
                type="button"
                onClick={handleRemoveImage}
                className="bg-red-500 text-white text-xs font-semibold px-3 py-2 rounded-lg flex items-center gap-1.5 hover:bg-red-600"
              >
                <X className="h-3.5 w-3.5" />
                Remover
              </button>
            </div>
          </div>
        ) : (
          /* Área de upload */
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="w-full max-w-xs aspect-[4/3] border-2 border-dashed border-zinc-700 rounded-xl flex flex-col items-center justify-center gap-3 hover:border-red-500 hover:bg-zinc-900 transition-all cursor-pointer disabled:opacity-60"
          >
            {uploading ? (
              <>
                <Loader2 className="h-8 w-8 text-zinc-500 animate-spin" />
                <p className="text-sm text-zinc-500">Enviando...</p>
              </>
            ) : (
              <>
                <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center">
                  <ImageIcon className="h-6 w-6 text-zinc-500" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-zinc-400">Clique para enviar</p>
                  <p className="text-xs text-zinc-600 mt-0.5">JPG, PNG ou WEBP · máx. 5MB</p>
                </div>
              </>
            )}
          </button>
        )}

        {/* Input oculto */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      {/* Nome */}
      <div>
        <label className={labelClass}>Nome do produto *</label>
        <input
          type="text"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="Ex: Camiseta Nossa Senhora Aparecida"
          required
          className={inputClass}
        />
      </div>

      {/* Descrição */}
      <div>
        <label className={labelClass}>Descrição</label>
        <textarea
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          placeholder="Descrição do produto, materiais, detalhes..."
          rows={3}
          className={`${inputClass} resize-none`}
        />
      </div>

      {/* Preço */}
      <div>
        <label className={labelClass}>Preço (R$) *</label>
        <input
          type="number"
          step="0.01"
          min="0"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
          placeholder="59.90"
          required
          className={inputClass}
        />
        {form.price && !isNaN(parseFloat(form.price)) && (
          <p className="text-xs text-zinc-500 mt-1">
            Valor: {formatCurrency(parseFloat(form.price))}
          </p>
        )}
      </div>

      {/* Tamanhos */}
      <div>
        <label className={labelClass}>Tamanhos disponíveis *</label>
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

      {/* Status ativo */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => setForm({ ...form, active: !form.active })}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            form.active ? 'bg-red-500' : 'bg-zinc-700'
          }`}
        >
          <span className={`inline-block h-4 w-4 rounded-full bg-white transition-transform ${
            form.active ? 'translate-x-6' : 'translate-x-1'
          }`} />
        </button>
        <span
          className="text-sm text-zinc-300 cursor-pointer"
          onClick={() => setForm({ ...form, active: !form.active })}
        >
          {form.active ? 'Ativo (visível na loja)' : 'Inativo (oculto na loja)'}
        </span>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={loading || uploading}
          className="bg-red-500 hover:bg-red-600 text-white font-bold px-6 py-2.5 rounded-lg transition-colors disabled:opacity-60 flex items-center gap-2"
        >
          {loading ? (
            <><Loader2 className="h-4 w-4 animate-spin" /> Salvando...</>
          ) : mode === 'edit' ? 'Salvar alterações' : 'Criar produto'}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="border border-zinc-700 text-zinc-400 hover:text-white px-6 py-2.5 rounded-lg transition-colors"
        >
          Cancelar
        </button>
      </div>
    </form>
  )
}
