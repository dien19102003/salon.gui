'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { customers, bookings } from '@/lib/data';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, DollarSign, Gift, Calendar, Phone, Mail } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';


export default function CustomerDetailPage({ params }: { params: { id: string } }) {
  const customer = customers.find(c => c.id === params.id);
  const customerBookings = bookings.filter(b => b.customerEmail === customer?.email);

  if (!customer) {
    return (
        <div className="container py-12 md:py-20 text-center">
            <h1 className="text-2xl font-bold">Customer not found</h1>
            <Button asChild variant="link">
                <Link href="/admin/customers">Go back to customers</Link>
            </Button>
        </div>
    )
  }

  return (
    <div className="space-y-6">
        <div className="flex items-center gap-4">
            <Button asChild variant="outline" size="icon">
                <Link href="/admin/customers">
                    <ArrowLeft className="h-4 w-4" />
                    <span className="sr-only">Back to Customers</span>
                </Link>
            </Button>
            <h1 className="text-2xl font-bold">Chi tiết khách hàng</h1>
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
             <div className="lg:col-span-1 flex flex-col gap-6">
                <Card>
                    <CardHeader className="flex flex-col items-center text-center">
                        <Avatar className="h-24 w-24 mb-4">
                            <AvatarImage src={`https://picsum.photos/seed/${customer.name.replace(/\s/g, '')}/100/100`} alt={customer.name} data-ai-hint="person" />
                            <AvatarFallback>{customer.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <CardTitle>{customer.name}</CardTitle>
                        <CardDescription>ID: {customer.id}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center gap-3 text-sm">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            <span>{customer.email}</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            <span>{customer.phone}</span>
                        </div>
                         <div className="flex items-center gap-3 text-sm">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span>Joined on {customer.joinDate}</span>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Ví tiền</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">Số dư</span>
                            <span className="font-bold text-2xl text-primary">${customer.walletBalance.toFixed(2)}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Tổng chi</span>
                            <span>${customer.totalSpent.toFixed(2)}</span>
                        </div>
                        <Button className="w-full">Thêm tiền</Button>
                    </CardContent>
                </Card>
             </div>
             <div className="lg:col-span-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Lịch sử đặt dịch vụ</CardTitle>
                        <CardDescription>{customerBookings.length} dịch vụ đã đặt</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                <TableHead>Dịch vụ</TableHead>
                                <TableHead>Stylist</TableHead>
                                <TableHead>Ngày</TableHead>
                                <TableHead>Trạng thái</TableHead>
                                <TableHead className="text-right">Giá</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {customerBookings.map((booking) => (
                                    <TableRow key={booking.id}>
                                    <TableCell className="font-medium">{booking.serviceName}</TableCell>
                                    <TableCell>{booking.stylistName}</TableCell>
                                    <TableCell>{new Date(booking.date).toLocaleDateString()}</TableCell>
                                    <TableCell>
                                        <Badge
                                            className={cn({
                                                'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300 border-green-200': booking.status === 'Completed',
                                                'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300 border-blue-200': booking.status === 'Confirmed',
                                                'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300 border-yellow-200': booking.status === 'Pending',
                                                'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300 border-red-200': booking.status === 'Cancelled',
                                            }, 'font-medium')}
                                            variant="outline"
                                            >
                                            {booking.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">${booking.price.toFixed(2)}</TableCell>
                                    </TableRow>
                                ))}
                                {customerBookings.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={5} className="h-24 text-center">
                                            Chưa có lịch sử đặt dịch vụ.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
             </div>
        </div>
    </div>
  );
}
