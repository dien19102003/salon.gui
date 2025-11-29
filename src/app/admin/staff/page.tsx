
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
import { stylists as allStylists, staffGroups } from '@/lib/data';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, PlusCircle, Star, ArrowUpRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { DataTable, type ColumnDef, type FetchData } from '@/components/ui/data-table';
import type { Stylist } from '@/lib/data';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Link from 'next/link';
import { useBranch } from '@/context/admin-branch-context';

const fetchStylists: FetchData<Stylist> = async (page, size, context) => {
    const { branchId } = context || {};

    // In a real app, you would fetch this from an API
    // const response = await fetch(`/api/stylists?page=${page}&size=${size}&branchId=${branchId}`);
    // const result: ApiResponse<Stylist> = await response.json();
    // return result;

    const filteredStylists = branchId === 'all'
        ? allStylists
        : allStylists.filter(stylist => stylist.branchId === branchId);

    const total = filteredStylists.length;
    const pageCount = Math.ceil(total / size);
    const start = (page - 1) * size;
    const end = start + size;
    const data = filteredStylists.slice(start, end);

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

export default function StaffPage() {
    const { selectedBranch } = useBranch();

  const columns: ColumnDef<Stylist>[] = [
    {
      key: 'name',
      title: 'Stylist',
      render: (_, record) => (
        <div className="flex items-center gap-4">
            <Avatar className="h-12 w-12">
                <AvatarImage src={record.image.imageUrl} alt={record.name} data-ai-hint={record.image.imageHint} />
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
            <span>{record.rating.toFixed(1)} ({record.reviews} reviews)</span>
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
        <DataTable columns={columns} fetchData={fetchStylists} fetchContext={{ branchId: selectedBranch }}/>
      </CardContent>
    </Card>
  );
}
