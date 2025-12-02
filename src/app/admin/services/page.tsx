
'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MoreHorizontal, PlusCircle, ArrowUpRight } from 'lucide-react';

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
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { DataTable, type ColumnDef, type FetchData } from '@/components/ui/data-table';
import { salonApi } from '@/lib/api-client';

type ServiceRow = {
  id: string;
  code?: string | null;
  name: string;
  description?: string | null;
  estimatedTime: number;
  state: string;
  image?: {
    imageUrl?: string | null;
    imageHint?: string | null;
  } | null;
  category?: string | null;
  duration?: number | null;
  price?: number | null;
};

// Gọi API thật: POST /Service/GetPage
const fetchServices: FetchData<ServiceRow> = async (page, size) => {
  const body = {
    page,
    size,
  };

  const response = await salonApi.post<any>('/Service/GetPage', body);

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

  const items: ServiceRow[] = (response.data ?? []).map((item: any) => ({
    id: item.id,
    code: item.code,
    name: item.name,
    description: item.description,
    estimatedTime: item.estimatedTime,
    state: item.state,
    image: item.image ?? null,
    category: item.category ?? null,
    duration: item.duration ?? item.estimatedTime ?? null,
    price: item.price ?? null,
  }));

  return {
    meta: apiMeta,
    data: items,
  };
};

export default function ServicesPage() {

  const columns: ColumnDef<ServiceRow>[] = [
    {
      key: 'image',
      title: 'Ảnh',
      render: (_, record) => {
        const imageUrl = record.image?.imageUrl ?? undefined;
        const imageHint = record.image?.imageHint ?? '';

        if (!imageUrl) {
          return (
            <div className="flex h-14 w-14 items-center justify-center rounded-md bg-muted text-xs text-muted-foreground">
              N/A
            </div>
          );
        }

        return (
          <Image
            alt={record.name}
            className="aspect-square rounded-md object-cover"
            height={56}
            src={imageUrl}
            width={56}
            data-ai-hint={imageHint}
          />
        );
      }
    },
    {
      key: 'name',
      title: 'Tên dịch vụ',
      pathValue: 'name',
      render: (value) => <span className="font-medium">{value}</span>
    },
    {
      key: 'category',
      title: 'Danh mục',
      render: (_, record) => (
        <Badge variant="secondary">
          {record.category || 'Không có'}
        </Badge>
      )
    },
    {
      key: 'duration',
      title: 'Thời lượng',
      render: (_, record) => `${record.duration ?? record.estimatedTime} phút`
    },
    {
      key: 'price',
      title: 'Giá mặc định',
      pathValue: 'price',
      render: (value) => {
        const numeric = Number(value ?? 0);
        return numeric > 0 ? `$${numeric.toFixed(2)}` : 'Chưa thiết lập';
      }
    },
    {
        key: 'status',
        title: 'Trạng thái',
        render: () => {
            return <Switch defaultChecked={true} aria-label="Toggle service status" />
        }
    },
    {
      key: 'actions',
      title: 'Hành động',
      className: 'text-right',
      render: (_, record) => (
         <div className="flex justify-end gap-2">
           <Button asChild variant="outline" size="sm">
              <Link href={`/admin/services/${record.id}`}>
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
                <DropdownMenuLabel>Hành động</DropdownMenuLabel>
                <DropdownMenuItem>Sửa</DropdownMenuItem>
                <DropdownMenuItem className="text-destructive">Xóa</DropdownMenuItem>
            </DropdownMenuContent>
            </DropdownMenu>
        </div>
      )
    }
  ];

  return (
    <Card className="shadow-none border-border">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Quản lý dịch vụ</CardTitle>
            <CardDescription>
              Quản lý dịch vụ, giá cả và tình trạng còn trống của salon.
            </CardDescription>
          </div>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Thêm dịch vụ
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <DataTable columns={columns} fetchData={fetchServices} />
      </CardContent>
    </Card>
  );
}
