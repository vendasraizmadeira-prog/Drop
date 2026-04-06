'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Trash2, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'

export function DeleteProductButton({
  productId,
  productName,
}: {
  productId: string
  productName: string
}) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleDelete() {
    setLoading(true)
    try {
      const res = await fetch(`/api/products/${productId}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Erro ao deletar produto')
      toast.success('Produto removido!')
      setOpen(false)
      router.refresh()
    } catch {
      toast.error('Erro ao deletar produto')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Button
        size="sm"
        variant="outline"
        onClick={() => setOpen(true)}
        className="border-zinc-700 text-red-400 hover:bg-red-500/10 hover:border-red-500/50"
      >
        <Trash2 className="h-3 w-3" />
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-zinc-900 border-zinc-700">
          <DialogHeader>
            <DialogTitle className="text-white">Confirmar exclusão</DialogTitle>
            <DialogDescription className="text-zinc-400">
              Tem certeza que deseja remover <strong className="text-white">{productName}</strong>?
              Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              className="border-zinc-700 text-zinc-300"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleDelete}
              disabled={loading}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Deletar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
