import type { Metadata } from 'next'
import { Playfair_Display, Inter } from 'next/font/google'
import { Toaster } from 'sonner'
import './globals.css'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Maranatha — Moda Católica',
    template: '%s | Maranatha',
  },
  description:
    'Moda católica por encomenda. Vista sua fé com estilo. Irapuã - SP.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${playfair.variable} ${inter.variable}`}>
      <body className="font-sans antialiased">
        {children}
        <Toaster
          richColors
          position="top-right"
          toastOptions={{
            style: {
              background: '#FFFFFF',
              border: '1px solid hsl(36 30% 82%)',
              color: 'hsl(22 45% 14%)',
            },
          }}
        />
      </body>
    </html>
  )
}
