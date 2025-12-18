import type React from "react"
// ... existing code ...
import type { Metadata } from "next"
import { Manrope } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const manrope = Manrope({ 
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "700", "800"]
})

export const metadata: Metadata = {
  // <CHANGE> Updated metadata for EventSponsorHub
  title: "EventSponsorHub - Event Sponsorship Reviews & ROI Insights",
  description:
    "Discover honest feedback from past event sponsors. Make smarter sponsorship decisions backed by real-world experiences.",
  generator: "v0.app",
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${manrope.variable} font-display antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
