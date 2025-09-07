import type { Metadata } from 'next';
import { Manrope } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/src/components/ui/sonner';
import ContextProvider from '@/src/context';
const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
});

export const metadata: Metadata = {
  title: 'AptosAI',
  description: 'Talk to blockchain in Natural Language',
  icons: '/robot.png',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${manrope.variable} antialiased`}
        suppressHydrationWarning
      >
        <ContextProvider>
          <Toaster position={'bottom-right'} />
          {children}
        </ContextProvider>
      </body>
    </html>
  );
}
