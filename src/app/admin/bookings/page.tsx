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
import { DataTable, type ColumnDef } from '@/components/ui/data-table';
import { Booking } from '@/lib/data';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

// Simulate an API call
const fetchBookings: (page: number, size: number) => Promise<{ meta: any; data: Booking[]; }> = async (page, size) => {
  const total = allBookings.length;
  const pageCount = Math.ceil(total / size);
  const start = (page - 1) * size;
  const end = start + size;
  // Sort bookings by date descending
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
    }, 300); // Simulate network delay
  });
};

export default function BookingsPage() {
  const columns: ColumnDef<Booking>[] = [
    {
      key: 'customer',
      title: 'Customer',
      render: (_, record) => (
        <div>
          <div className="font-medium">{record.customerName}</div>
          <div className="text-xs text-muted-foreground">{record.customerEmail}</div>
        </div>
      )
    },
    {
      key: 'service',
      title: 'Service',
      pathValue: 'serviceName',
    },
    {
      key: 'stylist',
      title: 'Stylist',
      pathValue: 'stylistName',
    },
    {
      key: 'dateTime',
      title: 'Date & Time',
      render: (_, record) => (
        <div>
          <div>{format(new Date(record.date), 'PPP')}</div>
          <div className="text-xs text-muted-foreground">{record.time}</div>
        </div>
      )
    },
    {
        key: 'status',
        title: 'Status',
        render: (_, record) => (
            <Badge
                variant="outline"
                className={cn({
                    'bg-green-100 text-green-700 border-green-200': record.status === 'Confirmed' || record.status === 'Completed',
                    'bg-yellow-100 text-yellow-700 border-yellow-200': record.status === 'Pending',
                    'bg-red-100 text-red-700 border-red-200': record.status === 'Cancelled',
                }, 'font-medium py-1')}
                >
                {record.status}
            </Badge>
        )
    },
    {
      key: 'actions',
      title: 'Actions',
      className: 'text-right',
      render: (_, record) => (
        <div className="flex justify-end gap-2">
          <DropdownMenu>
          <DropdownMenuTrigger asChild>
              <Button aria-haspopup="true" size="icon" variant="ghost">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Toggle menu</span>
              </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem>View Details</DropdownMenuItem>
              <DropdownMenuItem>Edit</DropdownMenuItem>
              <DropdownMenuItem className="text-destructive">Cancel</DropdownMenuItem>
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
            <CardTitle>Bookings</CardTitle>
            <CardDescription>
              Manage all appointments for your salon.
            </CardDescription>
          </div>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Booking
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <DataTable columns={columns} fetchData={fetchBookings} />
      </CardContent>
    </Card>
  );
}
