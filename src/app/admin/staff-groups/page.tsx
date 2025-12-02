
'use client';

import * as React from 'react';
import Link from 'next/link';
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
import { DataTable, type ColumnDef, type FetchData } from '@/components/ui/data-table';
import { salonApi } from '@/lib/api-client';

type StaffGroupRow = {
  id: string;
  code?: string | null;
  name: string;
  note?: string | null;
  memberCount?: number;
};

// Gọi API thật: POST /StaffGroup/GetPage
const fetchStaffGroups: FetchData<StaffGroupRow> = async (page, size) => {
  const body = {
    page,
    size,
  };

  const response = await salonApi.post<any>('/StaffGroup/GetPage', body);

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

  const items: StaffGroupRow[] = (response.data ?? []).map((item: any) => ({
    id: item.id,
    code: item.code,
    name: item.name,
    note: item.note,
    memberCount: item.memberCount ?? 0,
  }));

  return {
    meta: apiMeta,
    data: items,
  };
};

export default function StaffGroupsPage() {
  const columns: ColumnDef<StaffGroupRow>[] = [
    {
      key: 'name',
      title: 'Tên nhóm',
      pathValue: 'name',
      render: (value) => <span className="font-medium">{value}</span>
    },
    {
      key: 'note',
      title: 'Ghi chú',
      pathValue: 'note',
    },
    {
      key: 'members',
      title: 'Số lượng nhân viên',
      render: (_, record) => `${record.memberCount} nhân viên`
    },
    {
      key: 'actions',
      title: 'Hành động',
      className: 'text-right',
      render: (_, record) => (
        <div className="flex justify-end gap-2">
            <Button asChild variant="outline" size="sm">
                <Link href={`/admin/staff-groups/${record.id}`}>
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
                <DropdownMenuItem asChild><Link href={`/admin/staff-groups/${record.id}/edit`}>Chỉnh sửa</Link></DropdownMenuItem>
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
            <CardTitle>Nhóm nhân viên</CardTitle>
            <CardDescription>
              Quản lý các nhóm nhân viên và các dịch vụ họ có thể thực hiện.
            </CardDescription>
          </div>
          <Button asChild>
            <Link href="/admin/staff-groups/new">
                 <PlusCircle className="mr-2 h-4 w-4" />
                Thêm nhóm
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <DataTable columns={columns} fetchData={fetchStaffGroups} />
      </CardContent>
    </Card>
  );
}
