'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  ShoppingBag,
  Package,
  ClipboardList,
  BarChart3,
  LogOut,
  ChevronRight,
  Settings,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

const navItems = [
  {
    label: 'Produtos',
    href: '/admin/products',
    icon: Package,
  },
  {
    label: 'Encomendas',
    href: '/admin/orders',
    icon: ClipboardList,
  },
  {
    label: 'Relatórios',
    href: '/admin/reports',
    icon: BarChart3,
  },
  {
    label: 'Configurações',
    href: '/admin/settings',
    icon: Settings,
  },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    toast.success('Sessão encerrada')
    router.push('/admin/login')
    router.refresh()
  }

  return (
    <aside className="fixed left-0 top-0 z-30 h-screen w-64 bg-zinc-950 border-r border-zinc-800 flex flex-col">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 h-16 border-b border-zinc-800">
        <div className="flex items-center justify-center w-8 h-8 rounded bg-red-500">
          <ShoppingBag className="h-4 w-4 text-white" />
        </div>
        <div>
          <p className="font-black text-white text-sm uppercase tracking-tight">Drop Store</p>
          <p className="text-xs text-zinc-500">Painel Admin</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all',
                isActive
                  ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                  : 'text-zinc-400 hover:bg-zinc-900 hover:text-white'
              )}
            >
              <item.icon className="h-4 w-4 flex-shrink-0" />
              <span>{item.label}</span>
              {isActive && <ChevronRight className="ml-auto h-4 w-4" />}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t border-zinc-800">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-zinc-400 hover:bg-zinc-900 hover:text-red-400 transition-all w-full"
        >
          <LogOut className="h-4 w-4" />
          <span>Sair</span>
        </button>
      </div>
    </aside>
  )
}
