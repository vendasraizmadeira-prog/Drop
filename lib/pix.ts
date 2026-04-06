/**
 * Gerador de payload PIX estático (BR.GOV.BCB.PIX)
 * Segue o padrão EMV QR Code para pagamentos instantâneos
 */

function crc16(str: string): string {
  let crc = 0xffff
  for (let i = 0; i < str.length; i++) {
    crc ^= str.charCodeAt(i) << 8
    for (let j = 0; j < 8; j++) {
      if (crc & 0x8000) {
        crc = (crc << 1) ^ 0x1021
      } else {
        crc <<= 1
      }
      crc &= 0xffff
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, '0')
}

function field(id: string, value: string): string {
  const len = value.length.toString().padStart(2, '0')
  return `${id}${len}${value}`
}

export function generatePixPayload(options: {
  pixKey: string
  merchantName: string
  merchantCity: string
  amount?: number
  description?: string
  txId?: string
}): string {
  const { pixKey, merchantName, merchantCity, amount, description, txId = '***' } = options

  // Campo 26: Merchant Account Info (PIX)
  let mai = field('00', 'BR.GOV.BCB.PIX') + field('01', pixKey)
  if (description) {
    mai += field('02', description.substring(0, 72))
  }
  const merchantAccountInfo = field('26', mai)

  // Campo 54: Valor (opcional)
  const amountField = amount && amount > 0 ? field('54', amount.toFixed(2)) : ''

  // Campo 62: Additional Data Field (TXID)
  const additionalData = field('62', field('05', txId.substring(0, 25)))

  // Montar payload sem CRC
  const payload =
    field('00', '01') + // Payload Format Indicator
    merchantAccountInfo + // Merchant Account Info
    field('52', '0000') + // Merchant Category Code
    field('53', '986') + // Transaction Currency (BRL)
    amountField + // Amount (opcional)
    field('58', 'BR') + // Country Code
    field('59', merchantName.substring(0, 25)) + // Merchant Name
    field('60', merchantCity.substring(0, 15)) + // Merchant City
    additionalData + // Additional Data
    '6304' // CRC placeholder

  return payload + crc16(payload)
}
