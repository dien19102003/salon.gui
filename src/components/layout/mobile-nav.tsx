'use client';

import { Home, Scissors, Calendar, User } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { cn } from '@/lib/utils';

const navItems = [
  { href: '/', icon: Home, label: 'Trang chủ' },
  { href: '/services', icon: Scissors, label: 'Dịch vụ' },
  { href: '/book', icon: Calendar, label: 'Đặt lịch' },
  { href: '/profile', icon: User, label: 'Hồ sơ' },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-0 z-50 w-full border-t bg-background/95 backdrop-blur-sm md:hidden">
      <nav className="flex h-16 items-center justify-around">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center gap-1 p-2 text-sm font-medium',
                isActive
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-primary'
              )}
            >
              <item.icon className="h-6 w-6" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
