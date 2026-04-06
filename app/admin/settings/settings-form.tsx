'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Loader2, QrCode, Phone, Store } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PixQRCode } from '@/components/pix-qr-code'

interface SettingsFormProps {
  settings: Record<string, string>
}

export function SettingsForm({ settings }: SettingsFormProps) {
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    pix_key: settings.pix_key || '',
    whatsapp_number: settings.whatsapp_number || '',
    store_name: settings.store_name || '',
    merchant_name: settings.merchant_name || 'LOJA',
    merchant_city: settings.merchant_city || 'BRASIL',
  })

  async function handleSave() {
    setLoading(true)
    try {
      const entries = Object.entries(form)
      await Promise.all(
        entries.map(([key, value]) =>
          fetch('/api/settings', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ key, value }),
          })
        )
      )
      toast.success('Configurações salvas!')
    } catch {
      toast.error('Erro ao salvar configurações')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-4xl">
      {/* PIX Settings */}
      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <QrCode className="h-5 w-5 text-red-400" />
            Configurações PIX
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label className="text-zinc-300">Chave PIX *</Label>
            <Input
              value={form.pix_key}
              onChange={(e) => setForm({ ...form, pix_key: e.target.value })}
              placeholder="CPF, CNPJ, e-mail, telefone ou chave aleatória"
              className="bg-zinc-800 border-zinc-700 text-white"
            />
            <p className="text-xs text-zinc-500">
              Esta chave será exibida para o cliente na tela de pagamento
            </p>
          </div>
          <div className="space-y-2">
            <Label className="text-zinc-300">Nome do lojista (PIX)</Label>
            <Input
              value={form.merchant_name}
              onChange={(e) => setForm({ ...form, merchant_name: e.target.value })}
              placeholder="NOME LOJA"
              maxLength={25}
              className="bg-zinc-800 border-zinc-700 text-white"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-zinc-300">Cidade (PIX)</Label>
            <Input
              value={form.merchant_city}
              onChange={(e) => setForm({ ...form, merchant_city: e.target.value })}
              placeholder="SAO PAULO"
              maxLength={15}
              className="bg-zinc-800 border-zinc-700 text-white"
            />
          </div>
          {form.pix_key && (
            <div className="pt-2 border-t border-zinc-800">
              <p className="text-xs text-zinc-500 mb-3">Preview do QR Code:</p>
              <PixQRCode
                pixKey={form.pix_key}
                amount={0}
                merchantName={form.merchant_name}
                merchantCity={form.merchant_city}
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Store Settings */}
      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Store className="h-5 w-5 text-red-400" />
            Loja
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label className="text-zinc-300">Nome da loja</Label>
            <Input
              value={form.store_name}
              onChange={(e) => setForm({ ...form, store_name: e.target.value })}
              placeholder="DROP STORE"
              className="bg-zinc-800 border-zinc-700 text-white"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-zinc-300 flex items-center gap-2">
              <Phone className="h-4 w-4" />
              WhatsApp do vendedor
            </Label>
            <Input
              value={form.whatsapp_number}
              onChange={(e) => setForm({ ...form, whatsapp_number: e.target.value })}
              placeholder="5511999999999 (com DDD e DDI)"
              className="bg-zinc-800 border-zinc-700 text-white"
            />
            <p className="text-xs text-zinc-500">
              Formato: 5511999999999 (55 = Brasil, 11 = DDD, restante = número)
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="lg:col-span-2">
        <Button
          onClick={handleSave}
          disabled={loading}
          className="bg-red-500 hover:bg-red-600 text-white font-bold"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Salvando...
            </>
          ) : (
            'Salvar configurações'
          )}
        </Button>
      </div>
    </div>
  )
}
