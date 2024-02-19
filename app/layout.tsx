import type { Metadata } from 'next'
import { jakarta } from './ui/fonts'
import './globals.scss'
import { ThemeProvider } from './contexts/ThemeContext'
import { BoardProvider } from './contexts/BoardContext'
import { AuthProvider } from './contexts/AuthContext'

export const metadata: Metadata = {
  title: 'Kanban Dashboard App',
  description: 'dashboard app created with next.js by @mdollinger',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  return (
    <html lang="en">
      <body className={jakarta.className}>
        <AuthProvider>
          <ThemeProvider>
            <BoardProvider>
              <section>
                {children}
              </section>
            </BoardProvider>
          </ThemeProvider>
        </AuthProvider>

      </body>
    </html>
  )
}
