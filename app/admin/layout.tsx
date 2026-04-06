import { AdminSidebar } from '@/components/admin-sidebar'

export const metadata = {
  title: { default: 'Admin', template: '%s | Admin' },
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-zinc-950">
      <AdminSidebar />
      <main className="pl-64">
        <div className="p-8">{children}</div>
      </main>
    </div>
  )
}
