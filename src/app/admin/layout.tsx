
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SiteProvider } from '@/context/site-branch-context';
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  SidebarHeader
} from '@/components/ui/sidebar';
import {
  LayoutDashboard,
  Calendar,
  Users,
  Scissors,
  UserCog,
  LogOut,
  Settings,
  LifeBuoy,
  Users2,
} from 'lucide-react';
import { Logo } from '@/components/icons/logo';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { Inter } from 'next/font/google';
import { useSite } from '@/context/site-branch-context';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';


const fontSans = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

const menuItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/bookings', label: 'Lịch hẹn', icon: Calendar },
  { href: '/admin/customers', label: 'Khách hàng', icon: Users },
  { href: '/admin/services', label: 'Dịch vụ', icon: Scissors },
  { href: '/admin/staff', label: 'Nhân viên', icon: UserCog },
  { href: '/admin/staff-groups', label: 'Nhóm nhân viên', icon: Users2 },
];

function AdminHeader() {
  const pathname = usePathname();
  const currentPage = menuItems.find(item => pathname.startsWith(item.href) && (item.href === '/admin' ? pathname === item.href : true));
  const pageTitle = currentPage ? currentPage.label : 'Admin';
  const { sites, selectedSiteId, setSelectedSiteId, loading: sitesLoading } = useSite();
    
  return (
    <header className="fixed top-0 left-0 right-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 shadow-sm md:px-6">
        <div className="transition-all duration-300 md:w-[260px] group-data-[state=collapsed]/sidebar-wrapper:md:w-[70px] flex items-center gap-4">
             <SidebarTrigger />
             <h1 className="text-lg font-semibold md:text-xl group-data-[state=collapsed]/sidebar-wrapper:hidden">
                {pageTitle}
             </h1>
        </div>

        <div className="flex flex-1 items-center justify-end gap-4">
            {!sitesLoading && sites.length > 0 && (
              <Select
                value={selectedSiteId ?? ''}
                onValueChange={(value) => setSelectedSiteId(value || null)}
              >
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Chọn chi nhánh" />
                </SelectTrigger>
                <SelectContent>
                  {sites.map((site) => (
                    <SelectItem key={site.id} value={site.id}>
                      {site.name} {site.code && `(${site.code})`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                     <Avatar className="h-9 w-9 border-2 border-border">
                        <AvatarFallback>A</AvatarFallback>
                    </Avatar>
                </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                    <div className="flex flex-col">
                    <span>Quản trị viên</span>
                    <span className="text-xs font-normal text-muted-foreground">admin@eggstechsalon.com</span>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Cài đặt</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                    <LifeBuoy className="mr-2 h-4 w-4" />
                    <span>Hỗ trợ</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                    <Link href="/login" className="cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Đăng xuất</span>
                    </Link>
                </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    </header>
  );
}

function AdminSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar>
        <SidebarHeader className="h-16 flex items-center justify-center p-4">
             <Link href="/admin" className="flex items-center gap-2 group-data-[state=expanded]/sidebar-wrapper:opacity-100 opacity-0 transition-opacity duration-300">
                <Logo className="h-7 w-auto text-primary" />
            </Link>
        </SidebarHeader>
        <SidebarContent>
            <SidebarMenu>
            {menuItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                <Link href={item.href} className="contents">
                    <SidebarMenuButton
                    isActive={pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href))}
                    tooltip={item.label}
                    >
                    <item.icon className="h-5 w-5" />
                    <span className="group-data-[state=collapsed]/sidebar-wrapper:hidden">
                        {item.label}
                    </span>
                    </SidebarMenuButton>
                </Link>
                </SidebarMenuItem>
            ))}
            </SidebarMenu>
        </SidebarContent>
    </Sidebar>
  );
}

function AdminLayoutContent({ children }: { children: React.ReactNode }) {
    return (
        <div className={cn('min-h-screen w-full bg-muted/40 font-sans', fontSans.variable)}>
        <AdminSidebar />
        <div className="flex flex-col mt-16 md:ml-[260px] group-data-[state=collapsed]/sidebar-wrapper:md:ml-[70px] transition-all duration-300">
          <AdminHeader />
          <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">{children}</main>
        </div>
      </div>
    )
}

import { CustomerProvider } from '@/context/customer-context';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <SiteProvider>
        <CustomerProvider>
          <AdminLayoutContent>{children}</AdminLayoutContent>
        </CustomerProvider>
      </SiteProvider>
    </SidebarProvider>
  );
}
