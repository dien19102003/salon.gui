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

type OrderRow = {
  id: string;
  code?: string | null;
  customerName: string;
  customerPhone?: string | null;
  siteName?: string | null;
  issuedAt: string;
  totalAmount: number;
  state: number;
  isWalkIn?: boolean | null;
};

// Helper function to format price to VND format (1,xxx,xxx đ)
const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('vi-VN').format(price) + ' đ';
};

const getStateLabel = (state: number): string => {
  const stateMap: Record<number, string> = {
    1: 'Nháp',
    2: 'Đã xác nhận',
    3: 'Đang xử lý',
    4: 'Chờ thanh toán',
    5: 'Đã thanh toán',
    6: 'Đã hoàn thành',
    7: 'Đã hủy',
  };
  return stateMap[state] || 'Không xác định';
};

const getStateVariant = (state: number): string => {
  if (state === 5 || state === 6) return 'text-green-700 bg-green-50 border-green-200';
  if (state === 2 || state === 3) return 'text-blue-700 bg-blue-50 border-blue-200';
  if (state === 4) return 'text-yellow-700 bg-yellow-50 border-yellow-200';
  if (state === 7) return 'text-red-700 bg-red-50 border-red-200';
  return 'text-gray-700 bg-gray-50 border-gray-200';
};

// Gọi API thật: POST /Order/GetPage
const fetchOrders: FetchData<OrderRow> = async (page, size) => {
  const body = {
    page,
    size,
  };

  const response = await salonApi.post<any>('/Order/GetPage', body);

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

  const items: OrderRow[] = (response.data ?? []).map((item: any) => ({
    id: item.id,
    code: item.code,
    customerName: item.customer?.name ?? '',
    customerPhone: item.customer?.phone ?? null,
    siteName: item.site?.name ?? null,
    issuedAt: item.issuedAt,
    totalAmount: item.totalAmount ?? 0,
    state: item.state,
    isWalkIn: item.isWalkIn ?? false,
  }));

  return {
    meta: apiMeta,
    data: items,
  };
};

export default function OrdersPage() {

  const columns: ColumnDef<OrderRow>[] = [
    {
      key: 'code',
      title: 'Mã đơn hàng',
      pathValue: 'code',
      render: (_, record) => (
        <div className="font-medium">{record.code || 'N/A'}</div>
      )
    },
    {
      key: 'customer',
      title: 'Khách hàng',
      render: (_, record) => (
        <div>
          <div className="font-medium">{record.customerName}</div>
          {record.customerPhone && (
            <div className="text-xs text-muted-foreground">{record.customerPhone}</div>
          )}
        </div>
      )
    },
    {
      key: 'site',
      title: 'Chi nhánh',
      pathValue: 'siteName',
    },
    {
      key: 'issuedAt',
      title: 'Thời gian',
      render: (_, record) => (
        <div>
          {format(new Date(record.issuedAt), 'PPP')}
          <div className="text-xs text-muted-foreground">
            {format(new Date(record.issuedAt), 'HH:mm')}
          </div>
        </div>
      )
    },
    {
      key: 'totalAmount',
      title: 'Tổng tiền',
      render: (_, record) => (
        <div className="font-medium">{formatPrice(record.totalAmount)}</div>
      )
    },
    {
      key: 'isWalkIn',
      title: 'Loại',
      render: (_, record) => (
        record.isWalkIn ? (
          <Badge variant="outline" className="text-orange-700 bg-orange-50 border-orange-200">
            Khách vãng lai
          </Badge>
        ) : (
          <Badge variant="outline" className="text-blue-700 bg-blue-50 border-blue-200">
            Từ booking
          </Badge>
        )
      )
    },
    {
      key: 'status',
      title: 'Trạng thái',
      render: (_, record) => (
        <Badge
          variant="outline"
          className={cn(getStateVariant(record.state), 'font-medium py-1')}
        >
          {getStateLabel(record.state)}
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
              <DropdownMenuItem asChild>
                <Link href={`/admin/orders/${record.id}`}>Xem chi tiết</Link>
              </DropdownMenuItem>
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
            <CardTitle>Đơn hàng</CardTitle>
            <CardDescription>
              Quản lý tất cả các đơn hàng của salon.
            </CardDescription>
          </div>
          <Button asChild>
            <Link href="/admin/orders/new">
              <PlusCircle className="mr-2 h-4 w-4" />
              Tạo đơn hàng vãng lai
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <DataTable columns={columns} fetchData={fetchOrders} />
      </CardContent>
    </Card>
  );
}

