'use client'

import { useEffect, useState } from 'react'
import QRCode from 'react-qr-code'
import { Copy, Check } from 'lucide-react'
import { generatePixPayload } from '@/lib/pix'
import { formatCurrency } from '@/lib/utils'

interface PixQRCodeProps {
  pixKey: string
  amount: number
  merchantName?: string
  merchantCity?: string
  description?: string
}

export function PixQRCode({ pixKey, amount, merchantName = 'MARANATHA', merchantCity = 'IRAPUA', description }: PixQRCodeProps) {
  const [payload, setPayload] = useState('')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    setPayload(generatePixPayload({ pixKey, merchantName, merchantCity, amount, description }))
  }, [pixKey, amount, merchantName, merchantCity, description])

  async function handleCopy() {
    await navigator.clipboard.writeText(pixKey)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex flex-col items-center gap-4">
      {/* QR Code */}
      <div className="bg-white p-4 rounded-2xl border border-brown-100 shadow-sm">
        <QRCode value={payload || pixKey} size={180} fgColor="#5C3317" />
      </div>

      {/* Valor */}
      {amount > 0 && (
        <div className="text-center">
          <p className="text-xs text-brown-400 mb-0.5">Valor a pagar</p>
          <p className="font-serif text-3xl font-bold text-brown-700">{formatCurrency(amount)}</p>
        </div>
      )}

      {/* Chave PIX */}
      <div className="w-full bg-brown-50 rounded-xl border border-brown-200 p-3">
        <p className="text-[10px] text-brown-400 uppercase tracking-wider font-semibold mb-1">Chave PIX</p>
        <div className="flex items-center gap-2">
          <p className="flex-1 text-sm text-brown-700 font-mono break-all">{pixKey}</p>
          <button
            onClick={handleCopy}
            className="shrink-0 p-1.5 rounded-lg text-brown-400 hover:text-brown-700 hover:bg-brown-100 transition-colors"
          >
            {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <p className="text-xs text-brown-400 text-center">
        Escaneie o QR Code ou copie a chave PIX para pagar
      </p>
    </div>
  )
}
