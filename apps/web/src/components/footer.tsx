import Link from 'next/link';
import { Logo } from '@/components/icons';
import { Twitter, Instagram } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-blue-50/5 bg-hero-lines border-t border-border/20 mt-auto">
      <div className="container mx-auto py-12 px-6 lg:px-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2 space-y-4">
              <Link href="/" className="flex items-center gap-2" prefetch={false}>
                  <Logo className="h-7 w-7 text-primary" />
                  <span className="text-xl font-bold">WhisperLink</span>
              </Link>
              <p className="text-muted-foreground max-w-sm">
                  A safe and anonymous space to share your thoughts, stories, and ideas with the world.
              </p>
              <div className="flex space-x-4 mt-4">
                  <Link href="#" className="text-muted-foreground hover:text-primary"><Twitter /></Link>
                  <Link href="#" className="text-muted-foreground hover:text-primary"><Instagram /></Link>
              </div>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="/chat" className="text-muted-foreground hover:text-primary" prefetch={false}>Chat</Link></li>
              <li><Link href="/#features" className="text-muted-foreground hover:text-primary" prefetch={false}>Features</Link></li>
              <li><Link href="/pricing" className="text-muted-foreground hover:text-primary" prefetch={false}>Pricing</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li><Link href="/privacy" className="text-muted-foreground hover:text-primary" prefetch={false}>Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-muted-foreground hover:text-primary" prefetch={false}>Terms of Service</Link></li>
              <li><Link href="/community-guidelines" className="text-muted-foreground hover:text-primary" prefetch={false}>Community Guidelines</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-border/20 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} WhisperLink. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
