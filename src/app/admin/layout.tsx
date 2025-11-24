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

const menuItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/bookings', label: 'Bookings', icon: Calendar },
  { href: '/admin/customers', label: 'Customers', icon: Users },
  { href: '/admin/services', label: 'Services', icon: Scissors },
  { href: '/admin/staff', label: 'Staff', icon: UserCog },
];

function AdminHeader() {
  const getPageTitle = () => {
    const pathname = usePathname();
    const currentItem = menuItems.find(item => item.href === pathname);
    return currentItem?.label || 'Dashboard';
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex h-16 shrink-0 items-center gap-4 border-b bg-background px-4 shadow-sm md:px-6">
      <div className="flex items-center gap-2">
         <SidebarTrigger className="md:hidden" />
         <Logo className="h-6 w-auto text-primary hidden md:block" />
      </div>

      <div className="flex-1 md:ml-[244px] group-data-[state=collapsed]/sidebar-wrapper:md:ml-[54px] transition-all duration-300">
         <h1 className="text-lg font-semibold text-foreground">{getPageTitle()}</h1>
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

function AdminSidebar() {
    const pathname = usePathname();
    const { state } = useSidebar();
    
    return (
        <Sidebar>
          <SidebarHeader>
             <div
              className={cn(
                'flex items-center gap-3 p-4 transition-all duration-300',
                 state === 'collapsed' ? 'justify-center' : 'justify-between'
              )}
            >
              <Logo className={cn("h-6 w-auto text-primary", state === 'collapsed' ? "block" : "hidden")} />
              <span className={cn("font-bold text-lg text-primary", state === 'collapsed' ? "hidden" : "block")}>
                Shear Bliss
              </span>
              <SidebarTrigger />
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
    )
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="min-h-screen w-full bg-muted/40">
        <AdminSidebar />
        <div className="flex flex-col md:ml-[260px] group-data-[state=collapsed]/sidebar-wrapper:md:ml-[68px] transition-all duration-300">
          <AdminHeader />
          <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8 mt-16">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
