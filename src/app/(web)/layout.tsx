import { Footer } from '@/components/layout/footer';
import { Header } from '@/components/layout/header';
import { MobileNav } from '@/components/layout/mobile-nav';
import { BranchProvider } from '@/context/site-branch-context';

export default function WebLayout({ children }: { children: React.ReactNode }) {
  return (
    <BranchProvider>
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <MobileNav />
        {/* Add padding to the bottom to avoid content being hidden by the mobile nav */}
        <div className="h-16 md:hidden"></div>
      </div>
    </BranchProvider>
  );
}
