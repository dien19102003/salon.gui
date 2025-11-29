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
import { stylists as allStylists } from '@/lib/data';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, PlusCircle, Star } from 'lucide-react';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { DataTable, type ColumnDef } from '@/components/ui/data-table';
import type { Stylist } from '@/lib/data';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

// Simulate an API call
const fetchStylists: (page: number, size: number) => Promise<{ meta: any; data: Stylist[]; }> = async (page, size) => {
  const total = allStylists.length;
  const pageCount = Math.ceil(total / size);
  const start = (page - 1) * size;
  const end = start + size;
  const data = allStylists.slice(start, end);

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

export default function StaffPage() {
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
      key: 'skills',
      title: 'Skills',
      render: (_, record) => (
        <div className="flex flex-wrap gap-1">
          {record.skills.slice(0, 3).map(skill => (
            <Badge key={skill} variant="secondary">{skill}</Badge>
          ))}
        </div>
      )
    },
    {
      key: 'rating',
      title: 'Rating',
      render: (_, record) => (
        <div className="flex items-center gap-1">
            <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
            <span>{record.rating.toFixed(1)} ({record.reviews} reviews)</span>
        </div>
        )
    },
    {
        key: 'status',
        title: 'Status',
        render: () => <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">Active</Badge>
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
            <DropdownMenuItem>View Schedule</DropdownMenuItem>
            <DropdownMenuItem>Edit</DropdownMenuItem>
            <DropdownMenuItem className="text-destructive">Deactivate</DropdownMenuItem>
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
            <CardTitle>Staff Management</CardTitle>
            <CardDescription>
              Manage your talented team of stylists.
            </CardDescription>
          </div>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Stylist
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <DataTable columns={columns} fetchData={fetchStylists} />
      </CardContent>
    </Card>
  );
}
