'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ShoppingBag } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { formatCurrency } from '@/lib/utils'
import type { Product } from '@/types'

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Card className="group overflow-hidden bg-zinc-900 border-zinc-800 hover:border-red-500 transition-all duration-300">
      <div className="relative overflow-hidden aspect-square">
        <Image
          src={product.image_url || 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=500&q=80'}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <Link href={`/products/${product.id}`}>
            <Button className="w-full bg-red-500 hover:bg-red-600 text-white font-bold" size="lg">
              <ShoppingBag className="mr-2 h-5 w-5" />
              Ver Detalhes
            </Button>
          </Link>
        </div>
      </div>

      <CardContent className="p-4">
        <div className="flex flex-wrap gap-1 mb-2">
          {product.sizes.map((size) => (
            <Badge
              key={size}
              variant="outline"
              className="text-xs border-zinc-700 text-zinc-400"
            >
              {size}
            </Badge>
          ))}
        </div>
        <h3 className="font-bold text-white text-lg leading-tight mb-1 line-clamp-1">
          {product.name}
        </h3>
        <p className="text-zinc-400 text-sm line-clamp-2 mb-3">{product.description}</p>
        <div className="flex items-center justify-between">
          <span className="text-red-400 font-black text-xl">
            {formatCurrency(product.price)}
          </span>
          <Link href={`/products/${product.id}`}>
            <Button
              variant="outline"
              size="sm"
              className="border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white"
            >
              Encomendar
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
