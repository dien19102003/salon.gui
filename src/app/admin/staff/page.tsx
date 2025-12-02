
'use client';

import * as React from 'react';
import Link from 'next/link';
import { MoreHorizontal, PlusCircle, Star, ArrowUpRight } from 'lucide-react';

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
import { Badge } from '@/components/ui/badge';
import { DataTable, type ColumnDef, type FetchData } from '@/components/ui/data-table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { salonApi } from '@/lib/api-client';
import { staffGroups } from '@/lib/data';

type StaffRow = {
  id: string;
  code?: string | null;
  name: string;
  phone?: string | null;
  email?: string | null;
  state: string;
  image?: {
    imageUrl?: string | null;
    imageHint?: string | null;
  } | null;
  groupId?: string | null;
  rating?: number | null;
  reviews?: number | null;
};

// Gọi API thật: POST /Staff/GetPage
const fetchStylists: FetchData<StaffRow> = async (page, size) => {
  const body = {
    page,
    size,
  };

  const response = await salonApi.post<any>('/Staff/GetPage', body);

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

  const items: StaffRow[] = (response.data ?? []).map((item: any) => ({
    id: item.id,
    code: item.code,
    name: item.name,
    phone: item.phone,
    email: item.email,
    state: item.state,
    image: item.account?.avatarLink
      ? {
          imageUrl: item.account.avatarLink,
          imageHint: item.account.name,
        }
      : null,
    groupId: item.groupId ?? null,
    rating: item.rating ?? null,
    reviews: item.reviews ?? null,
  }));

  return {
    meta: apiMeta,
    data: items,
  };
};

export default function StaffPage() {

  const columns: ColumnDef<StaffRow>[] = [
    {
      key: 'name',
      title: 'Stylist',
      render: (_, record) => (
        <div className="flex items-center gap-4">
            <Avatar className="h-12 w-12">
                {record.image?.imageUrl && (
                  <AvatarImage
                    src={record.image.imageUrl}
                    alt={record.name}
                    data-ai-hint={record.image.imageHint ?? ''}
                  />
                )}
                <AvatarFallback>{record.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="font-medium">{record.name}</div>
        </div>
      )
    },
    {
      key: 'group',
      title: 'Nhóm',
      render: (_, record) => {
        const group = staffGroups.find(g => g.id === record.groupId);
        return group ? <Badge variant="secondary">{group.name}</Badge> : 'N/A';
      }
    },
    {
      key: 'rating',
      title: 'Đánh giá',
      render: (_, record) => (
        <div className="flex items-center gap-1">
            <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
            <span>
              {(record.rating ?? 0).toFixed(1)} ({record.reviews ?? 0} reviews)
            </span>
        </div>
        )
    },
    {
        key: 'status',
        title: 'Trạng thái',
        render: () => <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">Active</Badge>
    },
    {
      key: 'actions',
      title: 'Hành động',
      className: 'text-right',
      render: (_, record) => (
        <div className="flex justify-end gap-2">
            <Button asChild variant="outline" size="sm">
                <Link href={`/admin/staff/${record.id}`}>
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
                <DropdownMenuItem asChild><Link href={`/admin/staff/${record.id}/edit`}>Chỉnh sửa</Link></DropdownMenuItem>
                <DropdownMenuItem className="text-destructive">Vô hiệu hóa</DropdownMenuItem>
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
            <CardTitle>Quản lý nhân viên</CardTitle>
            <CardDescription>
              Quản lý đội ngũ stylist tài năng của bạn.
            </CardDescription>
          </div>
          <Button asChild>
            <Link href="/admin/staff/new">
                <PlusCircle className="mr-2 h-4 w-4" />
                Thêm nhân viên
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <DataTable columns={columns} fetchData={fetchStylists} />
      </CardContent>
    </Card>
  );
}
