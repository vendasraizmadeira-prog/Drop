'use client'

import { Download, Loader2 } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'

type ExportFilter = 'all' | 'paid' | 'pending'

export function ExportButtons() {
  const [loading, setLoading] = useState<ExportFilter | null>(null)

  async function handleExport(filter: ExportFilter) {
    setLoading(filter)
    try {
      const res = await fetch(`/api/reports/export?filter=${filter}`)
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

  const filters: { label: string; filter: ExportFilter; color: string }[] = [
    {
      label: 'Todos',
      filter: 'all',
      color: 'border-zinc-700 text-zinc-300 hover:bg-zinc-800',
    },
    {
      label: 'Pagos',
      filter: 'paid',
      color: 'border-green-500/30 text-green-400 hover:bg-green-500/10',
    },
    {
      label: 'Pendentes',
      filter: 'pending',
      color: 'border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/10',
    },
  ]

  return (
    <div className="flex gap-2">
      {filters.map(({ label, filter, color }) => (
        <Button
          key={filter}
          variant="outline"
          size="sm"
          onClick={() => handleExport(filter)}
          disabled={loading !== null}
          className={`${color} text-xs`}
        >
          {loading === filter ? (
            <Loader2 className="mr-1.5 h-3 w-3 animate-spin" />
          ) : (
            <Download className="mr-1.5 h-3 w-3" />
          )}
          CSV {label}
        </Button>
      ))}
    </div>
  )
}
