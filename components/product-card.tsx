'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ShoppingBag } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import type { Product } from '@/types'

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="group bg-white rounded-2xl overflow-hidden border border-brown-100 hover:border-brown-300 hover:shadow-lg transition-all duration-300">
      {/* Image */}
      <div className="relative overflow-hidden aspect-[4/5] bg-brown-50">
        <Image
          src={product.image_url || 'https://images.unsplash.com/photo-1594938298603-c8148c4b4e39?w=500&q=80'}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
        {/* Overlay com botão */}
        <div className="absolute inset-0 bg-brown-900/0 group-hover:bg-brown-900/20 transition-all duration-300 flex items-end p-4">
          <Link href={`/products/${product.id}`} className="w-full translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
            <button className="w-full bg-white text-brown-700 font-semibold text-sm py-2.5 rounded-xl flex items-center justify-center gap-2 hover:bg-brown-50 shadow-md">
              <ShoppingBag className="h-4 w-4" />
              Ver detalhes
            </button>
          </Link>
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        {/* Tamanhos */}
        <div className="flex flex-wrap gap-1 mb-2">
          {product.sizes.map((size) => (
            <span key={size} className="text-[10px] font-semibold text-brown-500 bg-brown-50 border border-brown-200 px-1.5 py-0.5 rounded">
              {size}
            </span>
          ))}
        </div>

        <h3 className="font-serif font-bold text-brown-800 text-base leading-tight mb-1 line-clamp-1">
          {product.name}
        </h3>
        <p className="text-brown-500 text-xs line-clamp-2 mb-3 leading-relaxed">
          {product.description}
        </p>

        <div className="flex items-center justify-between pt-2 border-t border-brown-100">
          <span className="font-serif font-bold text-brown-700 text-lg">
            {formatCurrency(product.price)}
          </span>
          <Link href={`/products/${product.id}`}>
            <button className="bg-brown-500 hover:bg-brown-600 text-white text-xs font-semibold px-4 py-2 rounded-full transition-colors">
              Encomendar
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}
