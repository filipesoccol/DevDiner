import type { Metadata } from 'next'
import { Bodoni_Moda } from 'next/font/google'
import './globals.css'
import { WalletProvider } from './components/WalletProvider'

const inter = Bodoni_Moda({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'DevDiner - Feed Your Devs Responsibly',
  description: 'A survey application for collecting developers\' dietary preferences to serve better meal options during in-person events. Powered by Web3Auth, XMTP, and Stackr micro-rollups.',
  keywords: ['DevDiner', 'developer survey', 'dietary preferences', 'Web3Auth', 'XMTP', 'Stackr', 'micro-rollups', 'blockchain'],
  authors: [{ name: 'DevDiner Team' }],
  openGraph: {
    title: 'DevDiner - Feed Your Devs Responsibly',
    description: 'Collect developer dietary data for better event catering',
    url: 'https://devdiner.filipe.contact/',
    siteName: 'DevDiner',
    images: [
      {
        url: 'https://devdiner.filipe.contact/og-image.jpg', // You'll need to create and host this image
        width: 1200,
        height: 630,
        alt: 'DevDiner - Developer Dietary Survey',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DevDiner - Feed Your Devs Responsibly',
    description: 'Collect developer dietary data for better event catering',
    images: ['https://devdiner.filipe.contact/twitter-image.jpg'], // You'll need to create and host this image
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <WalletProvider>
          {children}
        </WalletProvider>
      </body>
    </html>
  )
}
