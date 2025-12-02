
'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  PlusCircle,
  MoreHorizontal
} from 'lucide-react';
import { format } from 'date-fns';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { DataTable, type ColumnDef, type FetchData } from '@/components/ui/data-table';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { salonApi } from '@/lib/api-client';

type BookingRow = {
  id: string;
  customerName: string;
  customerEmail?: string | null;
  serviceName?: string | null;
  stylistName?: string | null;
  date: string;
  time: string;
  status: string;
};

// Gọi API thật: POST /Booking/GetPage
const fetchBookings: FetchData<BookingRow> = async (page, size) => {
  const body = {
    page,
    size,
  };

  const response = await salonApi.post<any>('/Booking/GetPage', body);

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

  const items: BookingRow[] = (response.data ?? []).map((item: any) => ({
    id: item.id,
    customerName: item.customer?.name ?? '',
    customerEmail: item.customer?.email ?? null,
    serviceName: item.code ?? '',
    stylistName: item.staff?.name ?? '',
    date: item.bookingDate,
    time: `${item.startTime} - ${item.endTime}`,
    status: item.state,
  }));

  return {
    meta: apiMeta,
    data: items,
  };
};

export default function BookingsPage() {

  const columns: ColumnDef<BookingRow>[] = [
    {
      key: 'customer',
      title: 'Khách hàng',
      render: (_, record) => (
        <div>
          <div className="font-medium">{record.customerName}</div>
          <div className="text-xs text-muted-foreground">{record.customerEmail}</div>
        </div>
      )
    },
    {
      key: 'service',
      title: 'Dịch vụ',
      pathValue: 'serviceName',
    },
    {
      key: 'stylist',
      title: 'Nhà tạo mẫu',
      pathValue: 'stylistName',
    },
    {
      key: 'dateTime',
      title: 'Ngày & Giờ',
      render: (_, record) => (
        <div>
          <div>{format(new Date(record.date), 'PPP')}</div>
          <div className="text-xs text-muted-foreground">{record.time}</div>
        </div>
      )
    },
    {
        key: 'status',
        title: 'Trạng thái',
        render: (_, record) => (
            <Badge
                variant="outline"
                className={cn({
                    'text-green-700 bg-green-50 border-green-200': record.status === 'Confirmed' || record.status === 'Completed',
                    'text-yellow-700 bg-yellow-50 border-yellow-200': record.status === 'Pending',
                    'text-red-700 bg-red-50 border-red-200': record.status === 'Cancelled',
                }, 'font-medium py-1')}
                >
                {record.status}
            </Badge>
        )
    },
    {
      key: 'actions',
      title: 'Hành động',
      className: 'text-right',
      render: (_, record) => (
        <div className="flex justify-end gap-2">
          <DropdownMenu>
          <DropdownMenuTrigger asChild>
              <Button aria-haspopup="true" size="icon" variant="ghost">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Chuyển đổi menu</span>
              </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
              <DropdownMenuLabel>Hành động</DropdownMenuLabel>
              <DropdownMenuItem>Xem chi tiết</DropdownMenuItem>
              <DropdownMenuItem>Sửa</DropdownMenuItem>
              <DropdownMenuItem className="text-destructive">Hủy bỏ</DropdownMenuItem>
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
            <CardTitle>Lịch hẹn</CardTitle>
            <CardDescription>
              Quản lý tất cả các cuộc hẹn cho salon của bạn.
            </CardDescription>
          </div>
          <Button asChild>
            <Link href="/admin/bookings/new">
                <PlusCircle className="mr-2 h-4 w-4" />
                Thêm lịch hẹn
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <DataTable columns={columns} fetchData={fetchBookings} />
      </CardContent>
    </Card>
  );
}
