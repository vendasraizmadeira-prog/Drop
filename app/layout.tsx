import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Toaster } from 'sonner'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'Drop Store — Camisetas por Encomenda',
    template: '%s | Drop Store',
  },
  description: 'Camisetas exclusivas por encomenda. Estilo streetwear, qualidade premium.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className="dark">
      <body className={inter.className}>
        {children}
        <Toaster
          richColors
          theme="dark"
          position="top-right"
          toastOptions={{
            style: {
              background: 'hsl(0 0% 7%)',
              border: '1px solid hsl(0 0% 16%)',
              color: 'hsl(0 0% 98%)',
            },
          }}
        />
      </body>
    </html>
  )
}
