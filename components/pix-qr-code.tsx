'use client'

import { useEffect, useState } from 'react'
import QRCode from 'react-qr-code'
import { Copy, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { generatePixPayload } from '@/lib/pix'
import { formatCurrency } from '@/lib/utils'

interface PixQRCodeProps {
  pixKey: string
  amount: number
  merchantName?: string
  merchantCity?: string
  description?: string
}

export function PixQRCode({
  pixKey,
  amount,
  merchantName = 'LOJA',
  merchantCity = 'BRASIL',
  description,
}: PixQRCodeProps) {
  const [payload, setPayload] = useState('')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const pix = generatePixPayload({
      pixKey,
      merchantName,
      merchantCity,
      amount,
      description,
    })
    setPayload(pix)
  }, [pixKey, amount, merchantName, merchantCity, description])

  async function handleCopy() {
    await navigator.clipboard.writeText(pixKey)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex flex-col items-center gap-4">
      {/* QR Code */}
      <div className="bg-white p-4 rounded-xl shadow-lg">
        <QRCode value={payload || pixKey} size={200} />
      </div>

      {/* Valor */}
      <div className="text-center">
        <p className="text-sm text-zinc-400 mb-1">Valor a pagar</p>
        <p className="text-3xl font-black text-red-400">{formatCurrency(amount)}</p>
      </div>

      {/* Chave PIX */}
      <div className="w-full bg-zinc-900 rounded-lg border border-zinc-700 p-3">
        <p className="text-xs text-zinc-500 mb-1 uppercase tracking-wider font-semibold">
          Chave PIX
        </p>
        <div className="flex items-center gap-2">
          <p className="flex-1 text-sm text-zinc-200 font-mono break-all">{pixKey}</p>
          <Button
            size="icon"
            variant="ghost"
            onClick={handleCopy}
            className="shrink-0 text-zinc-400 hover:text-white"
          >
            {copied ? (
              <Check className="h-4 w-4 text-green-400" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      <p className="text-xs text-zinc-500 text-center">
        Escaneie o QR Code ou copie a chave PIX acima para realizar o pagamento
      </p>
    </div>
  )
}
