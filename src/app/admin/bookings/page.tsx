
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
import { bookings as allBookings } from '@/lib/data';
import {
  PlusCircle,
  MoreHorizontal
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Link from 'next/link';
import { DataTable, type ColumnDef, type ApiResponse, type FetchData } from '@/components/ui/data-table';
import { Booking } from '@/lib/data';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

const fetchBookings: FetchData<Booking> = async (page, size) => {
  // Trong một ứng dụng thực tế, bạn sẽ tìm nạp điều này từ một API
  // const response = await fetch(`/api/bookings?page=${page}&size=${size}`);
  // const result: ApiResponse<Booking> = await response.json();
  // return result;

  const total = allBookings.length;
  const pageCount = Math.ceil(total / size);
  const start = (page - 1) * size;
  const end = start + size;
  const data = allBookings.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(start, end);

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
    }, 300); // Mô phỏng độ trễ mạng
  });
};

export default function BookingsPage() {

  const columns: ColumnDef<Booking>[] = [
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
