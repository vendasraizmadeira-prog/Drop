import { Badge } from '@/components/ui/badge'
import type { OrderStatus } from '@/types'

export function StatusBadge({ status }: { status: OrderStatus }) {
  if (status === 'paid') {
    return <Badge variant="success">Pago</Badge>
  }
  return <Badge variant="warning">Pendente</Badge>
}
