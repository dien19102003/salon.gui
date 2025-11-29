
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Building, Menu } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from '@/lib/utils';
import { Logo } from '../icons/logo';
import { useBranch } from '@/context/site-branch-context';
import { branches } from '@/lib/data';


const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/services', label: 'Services' },
  { href: '/stylists', label: 'Stylists' },
  { href: '/contact', label: 'Contact' },
  { href: '/profile', label: 'My Profile' },
];

function BranchSelector() {
    const { selectedBranch, setSelectedBranch } = useBranch();
    
    // In a real app, this might come from an API
    const availableBranches = branches;

    return (
        <div className="flex items-center gap-2">
            <Building className="h-4 w-4 text-muted-foreground" />
            <Select value={selectedBranch} onValueChange={setSelectedBranch}>
                <SelectTrigger className="w-auto border-none bg-transparent shadow-none focus:ring-0 text-xs text-muted-foreground pr-2 h-auto py-0">
                    <SelectValue placeholder="Select Branch" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Branches</SelectItem>
                    {availableBranches.map(branch => (
                        <SelectItem key={branch.id} value={branch.id}>{branch.name}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
}

export function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Logo className="h-6 w-auto" />
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'transition-colors hover:text-primary',
                  pathname === link.href ? 'text-primary' : 'text-foreground/60'
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Mobile Nav */}
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <Link href="/" className="mb-8">
              <Logo className="h-6 w-auto" />
            </Link>
            <nav className="flex flex-col space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'text-lg transition-colors hover:text-primary',
                    pathname === link.href ? 'text-primary' : 'text-foreground/80'
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </SheetContent>
        </Sheet>

        <div className="flex flex-1 items-center justify-between space-x-4 md:justify-end">
          <BranchSelector />
          <nav className="flex items-center">
            <Button asChild className="rounded-full shadow-sm">
              <Link href="/book">Book Now</Link>
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
}
