import { Facebook, Instagram, Twitter } from 'lucide-react';
import Link from 'next/link';
import { Logo } from '../icons/logo';
import { Button } from '../ui/button';

export function Footer() {
  return (
    <footer className="w-full border-t bg-card">
      <div className="container py-8">
        <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
          <div className="flex flex-col items-center gap-2 md:items-start">
            <Logo className="h-6 w-auto text-primary" />
            <p className="text-sm text-muted-foreground">
              Vẻ đẹp của bạn, niềm đam mê của chúng tôi.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" asChild>
              <Link href="#" aria-label="Twitter">
                <Twitter className="h-5 w-5" />
              </Link>
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <Link href="#" aria-label="Facebook">
                <Facebook className="h-5 w-5" />
              </Link>
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <Link href="#" aria-label="Instagram">
                <Instagram className="h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
        <div className="mt-8 border-t pt-4 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Shear Bliss. Đã đăng ký Bản quyền.</p>
        </div>
      </div>
    </footer>
  );
}
