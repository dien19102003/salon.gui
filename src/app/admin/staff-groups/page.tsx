
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
import { staffGroups as allStaffGroups } from '@/lib/data';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, PlusCircle, ArrowUpRight } from 'lucide-react';
import { DataTable, type ColumnDef, type FetchData } from '@/components/ui/data-table';
import type { StaffGroup } from '@/lib/data';
import Link from 'next/link';

// Simulate an API call
const fetchStaffGroups: FetchData<StaffGroup> = async (page, size) => {
    // In a real app, you would fetch this from an API
    // const response = await fetch(`/api/staff-groups?page=${page}&size=${size}`);
    // const result: ApiResponse<StaffGroup> = await response.json();
    // return result;

  const total = allStaffGroups.length;
  const pageCount = Math.ceil(total / size);
  const start = (page - 1) * size;
  const end = start + size;
  const data = allStaffGroups.slice(start, end);

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
    }, 300); // Simulate network delay
  });
};

export default function StaffGroupsPage() {
  const columns: ColumnDef<StaffGroup>[] = [
    {
      key: 'name',
      title: 'Tên nhóm',
      pathValue: 'name',
      render: (value) => <span className="font-medium">{value}</span>
    },
    {
      key: 'description',
      title: 'Mô tả',
      pathValue: 'description',
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
