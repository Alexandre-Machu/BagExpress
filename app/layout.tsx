import type { Metadata } from 'next'
import './globals.css'
import { LanguageProvider } from '@/contexts/LanguageContext'
import AuthProvider from '@/components/AuthProvider'

export const metadata: Metadata = {
  title: 'BagExpress - Luggage Delivery',
  description: 'Express delivery service for your luggage. Travel light, we handle the rest.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <LanguageProvider>
            {children}
          </LanguageProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
