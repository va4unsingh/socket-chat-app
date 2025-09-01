
"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Logo } from './icons';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, LogOut, Settings, Menu } from 'lucide-react';
import { SettingsDialog } from './settings-dialog';
import { useState } from 'react';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
import { ProfileDialog } from './profile-dialog';


export function Header() {
  const [isSignedIn, setIsSignedIn] = useState(true); // Placeholder for auth state

  const handleSignOut = () => {
    setIsSignedIn(false);
  }

  const navLinks = [
    { href: "/chat", label: "Chat" },
    { href: "/pricing", label: "Pricing" },
    { href: "/help", label: "Help" },
    { href: "/support", label: "Support" },
  ];

  return (
    <header className="w-full h-20 flex items-center absolute top-0 z-50">
      <div className="container mx-auto flex items-center w-full px-6 lg:px-10">
        <Link href="/" className="flex items-center justify-center mr-8" prefetch={false}>
          <Logo className="h-6 w-6 text-primary" />
          <span className="ml-3 text-lg font-semibold">WhisperLink</span>
        </Link>
        <nav className="hidden md:flex gap-8 items-center">
          {navLinks.map(link => (
              <Link
              key={link.href}
              href={link.href}
              className="text-base font-medium text-foreground/70 hover:text-foreground transition-colors"
              prefetch={false}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-2">
          {isSignedIn ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src="https://picsum.photos/100/100" data-ai-hint="person face" />
                    <AvatarFallback>U</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">Anonymous</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      m@example.com
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <SettingsDialog>
                  <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />Profile
                  </DropdownMenuItem>
                </SettingsDialog>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <Button variant="outline" asChild>
                <Link href="/login">Sign In</Link>
              </Button>
              <Button asChild>
                <Link href="/signup">Sign Up</Link>
              </Button>
            </div>
          )}
          
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle navigation menu</span>
                </Button>
            </SheetTrigger>
            <SheetContent side="right">
                <div className="flex flex-col h-full">
                  <Link href="/" className="flex items-center justify-center mr-6 mb-8" prefetch={false}>
                      <Logo className="h-6 w-6 text-primary" />
                      <span className="ml-2 text-lg font-semibold">WhisperLink</span>
                  </Link>
                  <nav className="flex flex-col gap-6 text-lg font-medium">
                      {navLinks.map(link => (
                          <Link
                          key={link.href}
                          href={link.href}
                          className="text-muted-foreground hover:text-foreground"
                          prefetch={false}
                          >
                          {link.label}
                          </Link>
                      ))}
                  </nav>
                  {!isSignedIn && (
                      <div className="mt-auto flex flex-col gap-2">
                          <Button variant="outline" asChild size="lg">
                          <Link href="/login">Sign In</Link>
                          </Button>
                          <Button asChild size="lg">
                          <Link href="/signup">Sign Up</Link>
                          </Button>
                      </div>
                  )}
                </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
