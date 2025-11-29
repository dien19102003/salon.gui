
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
import { services as allServices } from '@/lib/data';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, PlusCircle, ArrowUpRight } from 'lucide-react';
import Image from 'next/image';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { DataTable, type ColumnDef, type FetchData } from '@/components/ui/data-table';
import type { Service } from '@/lib/data';
import Link from 'next/link';

const fetchServices: FetchData<Service> = async (page, size) => {
  // In a real app, you would fetch this from an API
  // const response = await fetch(`/api/services?page=${page}&size=${size}`);
  // const result: ApiResponse<Service> = await response.json();
  // return result;

  const total = allServices.length;
  const pageCount = Math.ceil(total / size);
  const start = (page - 1) * size;
  const end = start + size;
  const data = allServices.slice(start, end);

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
    }, 300);
  });
};

export default function ServicesPage() {

  const columns: ColumnDef<Service>[] = [
    {
      key: 'image',
      title: 'Ảnh',
      render: (_, record) => (
        <Image
          alt={record.name}
          className="aspect-square rounded-md object-cover"
          height="56"
          src={record.image.imageUrl}
          width="56"
          data-ai-hint={record.image.imageHint}
        />
      )
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
      render: (_, record) => <Badge variant="secondary">{record.category}</Badge>
    },
    {
      key: 'duration',
      title: 'Thời lượng',
      render: (_, record) => `${record.duration} phút`
    },
    {
      key: 'price',
      title: 'Giá mặc định',
      pathValue: 'price',
      render: (value) => `$${Number(value).toFixed(2)}`
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
