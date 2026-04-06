'use client'

import { Download, Loader2 } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

type ExportFilter = 'all' | 'paid' | 'pending'

interface ExportButtonsProps {
  productId?: string
}

export function ExportButtons({ productId }: ExportButtonsProps) {
  const [loading, setLoading] = useState<ExportFilter | null>(null)

  async function handleExport(filter: ExportFilter) {
    setLoading(filter)
    try {
      const params = new URLSearchParams({ filter })
      if (productId) params.set('product_id', productId)

      const res = await fetch(`/api/reports/export?${params.toString()}`)
      if (!res.ok) throw new Error('Erro ao exportar')

      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `pedidos-${filter}-${new Date().toISOString().split('T')[0]}.csv`
      a.click()
      URL.revokeObjectURL(url)
      toast.success('CSV exportado!')
    } catch {
      toast.error('Erro ao exportar CSV')
    } finally {
      setLoading(null)
    }
  }

  const filters: { label: string; filter: ExportFilter; style: string }[] = [
    { label: 'Exportar Todos', filter: 'all', style: 'border-zinc-700 text-zinc-300 hover:bg-zinc-800' },
    { label: 'Só Pagos', filter: 'paid', style: 'border-green-500/30 text-green-400 hover:bg-green-500/10' },
    { label: 'Só Pendentes', filter: 'pending', style: 'border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/10' },
  ]

  return (
    <div className="grid grid-cols-3 gap-2">
      {filters.map(({ label, filter, style }) => (
        <button
          key={filter}
          onClick={() => handleExport(filter)}
          disabled={loading !== null}
          className={`flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg border text-xs font-semibold transition-colors disabled:opacity-50 ${style}`}
        >
          {loading === filter ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Download className="h-3.5 w-3.5" />
          )}
          <span>{label}</span>
        </button>
      ))}
    </div>
  )
}
