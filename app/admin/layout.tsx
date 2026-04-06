import { AdminSidebar } from '@/components/admin-sidebar'

export const metadata = {
  title: { default: 'Admin', template: '%s | Admin' },
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-zinc-950">
      <AdminSidebar />
      {/* Desktop: padding-left para sidebar fixa | Mobile: padding-top para top bar */}
      <main className="lg:pl-64 pt-14 lg:pt-0">
        <div className="p-4 md:p-8">{children}</div>
      </main>
    </div>
  )
}
