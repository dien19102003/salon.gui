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
  SidebarTrigger,
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
  ChevronLeft,
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
  subsets: ['latin'],
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
        {/* Sidebar Trigger */}
        <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={toggleSidebar}
        >
            <MenuIcon className="h-5 w-5" />
            <span className="sr-only">Toggle Sidebar</span>
        </Button>

        {/* Dynamic margin for main content */}
        <div className="flex-1 md:ml-[260px] group-data-[state=collapsed]/sidebar-wrapper:md:ml-[70px] transition-all duration-300">
            {/* Header content can go here if needed, or it can be empty */}
        </div>


      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="flex items-center gap-3 rounded-lg px-3 py-2 h-auto text-foreground">
            <div className="hidden md:flex flex-col items-end">
              <span className="font-medium text-sm">Admin User</span>
              <span className="text-xs text-muted-foreground">admin@shearbliss.com</span>
            </div>
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
    </header>
  );
}

function AdminSidebar() {
  const pathname = usePathname();
  const { state, toggleSidebar } = useSidebar();

  return (
    <Sidebar>
      <SidebarHeader>
        <div
          className={cn(
            'flex h-16 items-center border-b px-4 transition-all duration-300',
             'justify-between'
          )}
        >
          <div
            className={cn(
              'flex items-center gap-2',
              state === 'collapsed' && 'justify-center'
            )}
          >
             <Link href="/admin">
                <Logo
                className={cn(
                    'h-6 w-auto text-primary transition-all duration-300',
                    state === 'collapsed' ? 'hidden' : 'block'
                )}
                />
             </Link>
          </div>
          {/* Use SidebarTrigger from the library */}
          <Button variant="ghost" size="icon" onClick={toggleSidebar}>
             <ChevronLeft className={cn("h-5 w-5 transition-transform duration-300", state === 'collapsed' ? "rotate-180" : "rotate-0")} />
          </Button>
        </div>
      </SidebarHeader>
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
                  <span
                    className={cn(
                      'transition-opacity duration-200 whitespace-nowrap',
                      state === 'collapsed' ? 'opacity-0 hidden' : 'opacity-100'
                    )}
                  >
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
                <span className={cn("transition-opacity duration-200 whitespace-nowrap", state === 'collapsed' ? "opacity-0 hidden" : "opacity-100")}>Logout</span>
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
        <div className="flex flex-col md:ml-[260px] group-data-[state=collapsed]/sidebar-wrapper:md:ml-[70px] transition-all duration-300">
          <AdminHeader />
          <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8 mt-16">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
