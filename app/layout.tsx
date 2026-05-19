import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from 'sonner';
import './globals.css';
import { Navbar } from '@/components/Navbar';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'FoodDash - Order Management',
  description: 'Order your favourite food with real-time tracking',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navbar />
        <main className="max-w-6xl mx-auto px-4 py-6">{children}</main>
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: { fontFamily: 'inherit' },
          }}
          richColors
        />
      </body>
    </html>
  );
}
