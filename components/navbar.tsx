import Link from 'next/link'
import { ShoppingBag } from 'lucide-react'

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-800 bg-black/95 backdrop-blur supports-[backdrop-filter]:bg-black/80">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex items-center justify-center w-9 h-9 rounded bg-red-500">
            <ShoppingBag className="h-5 w-5 text-white" />
          </div>
          <span className="font-black text-xl text-white tracking-tight uppercase">
            {process.env.NEXT_PUBLIC_STORE_NAME || 'DROP STORE'}
          </span>
        </Link>

        <nav className="flex items-center gap-6">
          <Link
            href="/"
            className="text-sm font-medium text-zinc-400 hover:text-white transition-colors"
          >
            Coleção
          </Link>
          <Link
            href="/#contact"
            className="text-sm font-medium text-zinc-400 hover:text-white transition-colors"
          >
            Contato
          </Link>
        </nav>
      </div>
    </header>
  )
}
