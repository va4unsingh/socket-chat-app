'use client';

import { usePathname } from 'next/navigation';
import { Footer } from './footer';

export function FooterWrapper() {
  const pathname = usePathname();
  const hideFooter = pathname === '/chat';

  if (hideFooter) {
    return null;
  }

  return <Footer />;
}