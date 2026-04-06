export type Size = 'P' | 'M' | 'G' | 'GG' | 'XG'
export type OrderStatus = 'pending' | 'paid'

export interface Product {
  id: string
  name: string
  description: string
  price: number
  image_url: string
  sizes: Size[]
  active: boolean
  created_at: string
  updated_at: string
}

export interface Order {
  id: string
  product_id: string
  customer_name: string
  customer_phone: string
  size: Size
  quantity: number
  total_price: number
  status: OrderStatus
  created_at: string
  updated_at: string
  // Join com product
  product?: Product
}

export interface Setting {
  key: string
  value: string
  updated_at: string
}

export interface OrderFormData {
  customer_name: string
  customer_phone: string
  size: Size
  quantity: number
}

export interface ReportSummary {
  total_revenue: number
  paid_revenue: number
  pending_revenue: number
  total_orders: number
  paid_orders: number
  pending_orders: number
  total_shirts: number
  sizes: Record<Size, number>
}
