
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
import { MoreHorizontal, PlusCircle } from 'lucide-react';
import { DataTable, type ColumnDef } from '@/components/ui/data-table';
import type { StaffGroup } from '@/lib/data';

// Simulate an API call
const fetchStaffGroups: (page: number, size: number) => Promise<{ meta: any; data: StaffGroup[]; }> = async (page, size) => {
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
      title: <span className="sr-only">Actions</span>,
      className: 'text-right',
      render: () => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button aria-haspopup="true" size="icon" variant="ghost">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem>Edit</DropdownMenuItem>
            <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
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
              Quản lý các nhóm nhân viên trong salon của bạn.
            </CardDescription>
          </div>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Thêm nhóm
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <DataTable columns={columns} fetchData={fetchStaffGroups} />
      </CardContent>
    </Card>
  );
}
