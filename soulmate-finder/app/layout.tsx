import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/lib/auth-context"
import { ScrollManager } from "@/components/scroll-manager"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "WIYS - Who Is Your Soulmate?",
  description: "Discover your soulmate with AI-powered insights",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <ScrollManager />
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
