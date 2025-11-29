'use client';

import * as React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { customers as allCustomers } from '@/lib/data';
import {
  PlusCircle,
  ArrowUpRight,
  MoreHorizontal
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Link from 'next/link';
import { DataTable, type ColumnDef, type FetchData } from '@/components/ui/data-table';
import { Customer } from '@/lib/data';

// Simulate an API call
const fetchCustomers: FetchData<Customer> = async (page, size) => {
  const total = allCustomers.length;
  const pageCount = Math.ceil(total / size);
  const start = (page - 1) * size;
  const end = start + size;
  const data = allCustomers.slice(start, end);

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        meta: {
          traceId: `trace-${Date.now()}`,
          success: true,
          total,
          page,
          size,
          pageCount,
          canNext: page < pageCount,
          canPrev: page > 1,
        },
        data,
      });
    }, 500); // Simulate network delay
  });
};

export default function CustomersPage() {
  const columns: ColumnDef<Customer>[] = [
    {
      key: 'name',
      title: 'Tên',
      pathValue: 'name',
      render: (value, record) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9">
            <AvatarImage src={`https://picsum.photos/seed/${record.name.replace(/\s/g, '')}/40/40`} alt={record.name} data-ai-hint="person" />
            <AvatarFallback>{record.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="grid gap-0.5">
            <p className="font-medium">{record.name}</p>
            <p className="text-xs text-muted-foreground">{record.id}</p>
          </div>
        </div>
      )
    },
    {
      key: 'email',
      title: 'Email',
      pathValue: 'email',
    },
    {
      key: 'phone',
      title: 'Số điện thoại',
      pathValue: 'phone',
    },
    {
      key: 'totalBookings',
      title: 'Số lần đặt',
      pathValue: 'totalBookings',
      className: 'text-center'
    },
    {
      key: 'totalSpent',
      title: 'Tổng chi',
      pathValue: 'totalSpent',
      render: (value) => `$${Number(value).toFixed(2)}`
    },
    {
      key: 'actions',
      title: 'Actions',
      className: 'text-right',
      render: (_, record) => (
        <div className="flex justify-end gap-2">
           <Button asChild variant="outline" size="sm">
              <Link href={`/admin/customers/${record.id}`}>
                  Chi tiết
                  <ArrowUpRight className="h-4 w-4 ml-2" />
              </Link>
           </Button>
          <DropdownMenu>
          <DropdownMenuTrigger asChild>
              <Button aria-haspopup="true" size="icon" variant="ghost">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Toggle menu</span>
              </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem>Sửa</DropdownMenuItem>
              <DropdownMenuItem className="text-destructive">Xóa</DropdownMenuItem>
          </DropdownMenuContent>
          </DropdownMenu>
     </div>
      )
    }
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Khách hàng</CardTitle>
            <CardDescription>
              Quản lý khách hàng của bạn và xem lịch sử mua hàng của họ.
            </CardDescription>
          </div>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Thêm khách hàng
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <DataTable columns={columns} fetchData={fetchCustomers} />
      </CardContent>
    </Card>
  );
}
