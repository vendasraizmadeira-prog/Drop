interface WhatsAppOrderMessage {
  vendorNumber: string
  customerName: string
  customerPhone: string
  productName: string
  size: string
  quantity: number
  total: number
}

export function generateWhatsAppOrderLink(data: WhatsAppOrderMessage): string {
  const total = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(data.total)

  const message = [
    'Olá! Fiz uma encomenda!',
    `Nome: ${data.customerName}`,
    `Telefone: ${data.customerPhone}`,
    `Produto: ${data.productName}`,
    `Tamanho: ${data.size}`,
    `Quantidade: ${data.quantity}`,
    `Total: ${total}`,
    '',
    'Já fiz o PIX. Pode confirmar?',
  ].join('\n')

  const number = data.vendorNumber.replace(/\D/g, '')
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`
}

export function generateWhatsAppContactLink(phone: string, message?: string): string {
  const number = phone.replace(/\D/g, '')
  const fullNumber = number.startsWith('55') ? number : `55${number}`
  if (message) {
    return `https://wa.me/${fullNumber}?text=${encodeURIComponent(message)}`
  }
  return `https://wa.me/${fullNumber}`
}
