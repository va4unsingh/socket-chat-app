import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';
import { FooterWrapper } from '@/components/footer-wrapper';

export const metadata: Metadata = {
  title: 'WhisperLink',
  description: 'Connect and chat anonymously with people from around the world.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full dark" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className={cn(
          'font-body antialiased h-full bg-background',
          'font-body'
        )}
        suppressHydrationWarning
      >
        <div className="flex flex-col min-h-screen">
          {children}
          <FooterWrapper />
        </div>
        <Toaster />
      </body>
    </html>
  );
}