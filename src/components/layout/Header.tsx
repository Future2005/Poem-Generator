
"use client";

import Link from 'next/link';
import { Aperture, Star } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export default function Header() {
  const pathname = usePathname();

  const navItems = [
    { href: '/', label: 'Home', icon: Aperture },
    { href: '/favorites', label: 'Favorites', icon: Star },
  ];

  return (
    <header className="bg-card border-b border-border shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2 text-xl font-semibold text-primary-foreground hover:text-primary-foreground/80 transition-colors">
          <Aperture className="h-7 w-7 text-primary-foreground" />
          <span style={{color: 'hsl(var(--primary-foreground))'}}>ImageVerse</span>
        </Link>
        <nav className="flex items-center gap-2">
          {navItems.map((item) => (
            <Button
              key={item.href}
              variant={pathname === item.href ? 'secondary' : 'ghost'}
              asChild
              className="text-sm"
            >
              <Link href={item.href} className="flex items-center gap-2">
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            </Button>
          ))}
        </nav>
      </div>
    </header>
  );
}
