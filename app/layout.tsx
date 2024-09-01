import type { Metadata } from 'next'
import { Bodoni_Moda } from 'next/font/google'
import './globals.css'

const inter = Bodoni_Moda({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Dev Diner',
  description: 'Feed your devs responsibly!',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
