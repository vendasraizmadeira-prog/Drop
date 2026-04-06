import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ProductForm } from '../product-form'

export const metadata = { title: 'Novo Produto' }

export default function NewProductPage() {
  return (
    <div>
      <div className="mb-8">
        <Link href="/admin/products">
          <Button variant="ghost" size="sm" className="text-zinc-400 hover:text-white mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para produtos
          </Button>
        </Link>
        <h1 className="text-2xl font-black text-white">Novo Produto</h1>
        <p className="text-zinc-500 text-sm mt-1">Preencha os dados para criar um novo produto</p>
      </div>
      <ProductForm mode="create" />
    </div>
  )
}
