import Link from 'next/link'
import { Instagram, MapPin } from 'lucide-react'

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur border-b border-brown-100 shadow-sm">
      {/* Top bar */}
      <div className="bg-brown-500 text-white py-1.5 text-center text-xs tracking-widest uppercase font-medium">
        Encomendas abertas — Irapuã / SP
      </div>

      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex flex-col leading-none">
          <span className="font-serif text-2xl font-bold text-brown-700 tracking-wide">
            Maranatha
          </span>
          <span className="text-[10px] tracking-[0.3em] uppercase text-brown-400 font-medium">
            Moda Católica
          </span>
        </Link>

        {/* Nav */}
        <nav className="hidden sm:flex items-center gap-6">
          <Link href="/" className="text-sm font-medium text-brown-600 hover:text-brown-800 transition-colors">
            Coleção
          </Link>
          <Link href="/#about" className="text-sm font-medium text-brown-600 hover:text-brown-800 transition-colors">
            Sobre
          </Link>
          <Link href="/#contact" className="text-sm font-medium text-brown-600 hover:text-brown-800 transition-colors">
            Contato
          </Link>
        </nav>

        {/* Instagram */}
        <a
          href="https://instagram.com/vista.maranatha"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-brown-500 hover:text-brown-700 transition-colors"
        >
          <Instagram className="h-4 w-4" />
          <span className="hidden sm:inline text-xs font-medium">@vista.maranatha</span>
        </a>
      </div>
    </header>
  )
}
