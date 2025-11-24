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
  SidebarInset,
  SidebarFooter,
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
  PanelLeft,
} from 'lucide-react';
import { Logo } from '@/components/icons/logo';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { useSidebar, SidebarTrigger } from '@/components/ui/sidebar';

const menuItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/bookings', label: 'Bookings', icon: Calendar },
  { href: '/admin/customers', label: 'Customers', icon: Users },
  { href: '/admin/services', label: 'Services', icon: Scissors },
  { href: '/admin/staff', label: 'Staff', icon: UserCog },
];

function AdminHeader() {
  const pathname = usePathname();

  // Get page title from pathname
  const getPageTitle = () => {
    const path = pathname.split('/').pop();
    if (!path || path === 'admin') return 'Dashboard';
    return path.charAt(0).toUpperCase() + path.slice(1);
  };

  return (
    <header className="sticky top-0 z-20 flex h-16 shrink-0 items-center gap-4 border-b border-sidebar-border bg-sidebar px-6">
      <SidebarTrigger className="text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground" />

      <h1 className="text-xl font-semibold text-sidebar-foreground">
        {getPageTitle()}
      </h1>

      <div className="flex-1"></div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="flex items-center gap-3 rounded-lg px-3 py-2 h-auto hover:bg-sidebar-accent text-sidebar-foreground hover:text-sidebar-accent-foreground">
            <div className="hidden md:flex flex-col items-end">
              <span className="font-medium text-sm">Admin User</span>
              <span className="text-xs text-sidebar-foreground/70">admin@shearbliss.com</span>
            </div>
            <Avatar className="h-9 w-9 border-2 border-sidebar-accent">
              <AvatarImage src="https://picsum.photos/seed/admin-user/40/40" alt="Admin" data-ai-hint="person" />
              <AvatarFallback className="bg-sidebar-accent text-sidebar-accent-foreground">AU</AvatarFallback>
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
            <span>Settings</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <LifeBuoy className="mr-2 h-4 w-4" />
            <span>Support</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href="/login" className="cursor-pointer">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Logout</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}


export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-admin-background admin-layout-wrapper">
        <Sidebar className="!top-16 !bottom-auto !h-[calc(100vh-4rem)]">
          <SidebarHeader>
            <div
              className={cn(
                'flex items-center gap-2 p-4',
                'group-data-[collapsible=icon]:justify-center'
              )}
            >
              <Logo className="h-7 w-auto text-sidebar-primary" />
              <span className="font-bold text-lg text-sidebar-primary group-data-[collapsible=icon]:hidden">
                Shear Bliss
              </span>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <Link href={item.href} className="contents">
                    <SidebarMenuButton
                      isActive={pathname === item.href}
                      tooltip={item.label}
                    >
                      <item.icon />
                      <span>{item.label}</span>
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
                    <LogOut />
                    <span>Logout</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>
        <SidebarInset className="flex flex-col">
          <AdminHeader />
          <main className="flex-1 overflow-auto p-6 md:p-8 bg-admin-background">{children}</main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
