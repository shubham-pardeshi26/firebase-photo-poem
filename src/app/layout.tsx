
import type { Metadata } from 'next';
import { Lora } from 'next/font/google'; // Changed import for Lora
import { GeistSans, GeistMono } from 'geist/font';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from '@/contexts/AuthContext'; // Added AuthProvider

// Lora font configuration
const lora = Lora({
  variable: '--font-lora',
  subsets: ['latin'],
  weight: ['400', '700'],
  display: 'swap',
});

// GeistSans and GeistMono configurations using CSS variables from geist/font
// These are typically automatically handled if you import them directly in the className like below

export const metadata: Metadata = {
  title: 'Photo Poet',
  description: 'Generate poems from your photos with AI',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${GeistSans.variable} ${GeistMono.variable} ${lora.variable} font-sans antialiased`}>
        <AuthProvider> {/* Wrapped with AuthProvider */}
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
    