// src/app/layout.tsx

"use client"

import { Inter } from "next/font/google"
import "./globals.css"
import { cn } from "@/lib/utils"
import { AuthProvider } from "@/lib/auth/auth-context"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ThemeProvider } from "@/lib/theme-context"
import { LoginModalProvider } from "@/components/auth/login-modal-context"
import { ContactModalProvider } from "@/components/contact-modal-context"

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={cn(
        inter.className,
        "min-h-screen bg-background font-sans antialiased"
      )}>
        <ThemeProvider>
          <AuthProvider>
            <LoginModalProvider>
              <ContactModalProvider>
                <div className="flex min-h-screen flex-col">
                  <Header />
                  <main className="flex-1">
                    {children}
                  </main>
                  <Footer />
                </div>
              </ContactModalProvider>
            </LoginModalProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}