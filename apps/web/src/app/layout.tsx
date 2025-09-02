import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';
import { FooterWrapper } from '@/components/footer-wrapper';
import { UserProvider } from '@/context/user-context';
import { ThemeProvider } from '@/components/theme-provider';

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
    <html lang="en" className="h-full" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
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
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
        >
          <UserProvider>
            <div className="flex flex-col min-h-[100dvh]">
              {children}
              <FooterWrapper />
            </div>
            <Toaster />
          </UserProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}