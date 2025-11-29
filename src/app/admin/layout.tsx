'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  useSidebar,
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
  MenuIcon
} from 'lucide-react';
import { Logo } from '@/components/icons/logo';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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

const inter = Inter({
  subsets: ['latin', 'vietnamese'],
  variable: '--font-sans',
});

const menuItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/bookings', label: 'Bookings', icon: Calendar },
  { href: '/admin/customers', label: 'Khách hàng', icon: Users },
  { href: '/admin/services', label: 'Dịch vụ', icon: Scissors },
  { href: '/admin/staff', label: 'Nhân viên', icon: UserCog },
];

function AdminHeader() {
    const { toggleSidebar } = useSidebar();

  return (
    <header className="fixed top-0 left-0 right-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 shadow-sm md:px-6">
        <div className="flex items-center gap-2">
            <Button
                variant="ghost"
                size="icon"
                className="shrink-0"
                onClick={toggleSidebar}
            >
                <MenuIcon className="h-5 w-5" />
                <span className="sr-only">Toggle Sidebar</span>
            </Button>
             <Link href="/admin" className="hidden md:block">
                <Logo className="h-6 w-auto text-primary" />
             </Link>
        </div>

        <div className="flex flex-1 items-center justify-end gap-4">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                     <Avatar className="h-9 w-9 border-2 border-border">
                        <AvatarImage src="https://picsum.photos/seed/admin-user/40/40" alt="Admin" data-ai-hint="person" />
                        <AvatarFallback>AU</AvatarFallback>
                    </Avatar>
                </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                    <div className="flex flex-col">
                    <span>Admin User</span>
                    <span className="text-xs font-normal text-muted-foreground">admin@shearbliss.com</span>
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
        <SidebarContent>
            <SidebarMenu>
            {menuItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                <Link href={item.href} className="contents">
                    <SidebarMenuButton
                    isActive={pathname.startsWith(item.href)}
                    tooltip={item.label}
                    >
                    <item.icon className="h-5 w-5" />
                    <span>
                        {item.label}
                    </span>
                    </SidebarMenuButton>
                </Link>
                </SidebarMenuItem>
            ))}
            </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
            <SidebarMenu>
            <SidebarMenuItem>
                <Link href="/login" className="contents">
                    <SidebarMenuButton tooltip="Logout">
                        <LogOut className="h-5 w-5" />
                        <span>Logout</span>
                    </SidebarMenuButton>
                </Link>
            </SidebarMenuItem>
            </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className={cn('min-h-screen w-full bg-muted/40 font-sans', inter.variable)}>
        <AdminSidebar />
        <div className="flex flex-col mt-16 md:ml-[260px] group-data-[state=collapsed]/sidebar-wrapper:md:ml-[70px] transition-all duration-300">
          <AdminHeader />
          <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
