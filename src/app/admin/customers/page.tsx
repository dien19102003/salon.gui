
'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  PlusCircle,
  ArrowUpRight,
  MoreHorizontal
} from 'lucide-react';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { DataTable, type ColumnDef, type FetchData } from '@/components/ui/data-table';
import { salonApi } from '@/lib/api-client';

type CustomerRow = {
  id: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  totalBookings?: number;
  totalSpent?: number;
};

// Gọi API thật từ backend: POST /Customer/GetPage
const fetchCustomers: FetchData<CustomerRow> = async (page, size) => {
  // Filter tối thiểu theo BaseFilterAdminDto (Page, Size)
  const body = {
    page,
    size,
  };

  const response = await salonApi.post<any>('/Customer/GetPage', body);

  // Giả định backend trả về { meta, data } tương thích với ApiResponse
  // Nếu structure khác, chỉ cần chỉnh lại mapping ở đây.
  const apiMeta = response.meta ?? {
    traceId: response.traceId ?? `trace-${Date.now()}`,
    success: true,
    total: response.total ?? 0,
    page: response.page ?? page,
    size: response.size ?? size,
    pageCount: response.pageCount ?? 0,
    canNext: response.canNext ?? false,
    canPrev: response.canPrev ?? false,
  };

  const items: CustomerRow[] = (response.data ?? []).map((item: any) => ({
    id: item.id,
    name: item.name,
    email: item.email,
    phone: item.phone,
    // TODO: map đúng từ CustomerDataAdminDto nếu cần
    totalBookings: item.totalBookings ?? 0,
    totalSpent: item.totalRevenue ?? 0,
  }));

  return {
    meta: apiMeta,
    data: items,
  };
};

export default function CustomersPage() {
  const columns: ColumnDef<CustomerRow>[] = [
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
