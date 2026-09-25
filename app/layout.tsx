import { Analytics } from '@vercel/analytics/next'
import type { Metadata } from 'next'
import {
  Playfair_Display,
  Cormorant_Garamond,
  Dancing_Script,
  Jost,
} from 'next/font/google'
import { LoveBubbleBackground } from '@/components/love-bubble-background'
import './globals.css'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  variable: '--font-cormorant',
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
  display: 'swap',
})

const dancing = Dancing_Script({
  subsets: ['latin'],
  variable: '--font-dancing',
  weight: ['400', '500', '600', '700'],
  display: 'swap',
})

const jost = Jost({
  subsets: ['latin'],
  variable: '--font-jost',
  weight: ['300', '400', '500', '600'],
  style: ['normal', 'italic'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Julia & Suliaman — Our Bright Forever',
  description: 'A bright, private anniversary story for Julia Helen Campbell and Suliaman Wahid Kallon.',
  openGraph: {
    title: 'Julia & Suliaman',
    description: 'Our bright forever.',
    type: 'website',
  },
}

export const viewport = {
  themeColor: '#FFF8E8',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${cormorant.variable} ${dancing.variable} ${jost.variable}`}
    >
      <body className="bg-background font-jost antialiased">
        <LoveBubbleBackground />
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
