import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { Button } from '@/components/ui/button'
import { ProductForm } from '../../product-form'

interface PageProps {
  params: { id: string }
}

export const metadata = { title: 'Editar Produto' }

export default async function EditProductPage({ params }: PageProps) {
  const supabase = createServerSupabaseClient()
  const { data: product } = await supabase
    .from('products')
    .select('*')
    .eq('id', params.id)
    .single()

  if (!product) notFound()

  return (
    <div>
      <div className="mb-8">
        <Link href="/admin/products">
          <Button variant="ghost" size="sm" className="text-zinc-400 hover:text-white mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para produtos
          </Button>
        </Link>
        <h1 className="text-2xl font-black text-white">Editar Produto</h1>
        <p className="text-zinc-500 text-sm mt-1 line-clamp-1">{product.name}</p>
      </div>
      <ProductForm product={product} mode="edit" />
    </div>
  )
}
