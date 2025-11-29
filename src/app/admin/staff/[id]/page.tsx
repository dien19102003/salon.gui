
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
import { stylists, bookings, branches, staffGroups } from '@/lib/data';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Star, Edit, Calendar, MapPin, Users2 } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { cn } from '@/lib/utils';

export default function StaffDetailPage({ params }: { params: { id: string } }) {
  const stylist = stylists.find(s => s.id === params.id);
  
  if (!stylist) {
    notFound();
  }

  const staffBookings = bookings.filter(b => b.stylistName === stylist.name);
  const branch = branches.find(b => b.id === stylist.branchId);
  const group = staffGroups.find(g => g.id === stylist.groupId);

  return (
    <div className="space-y-6">
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
                <Button asChild variant="outline" size="icon" className="h-8 w-8">
                    <Link href="/admin/staff">
                        <ArrowLeft className="h-4 w-4" />
                        <span className="sr-only">Back to Staff</span>
                    </Link>
                </Button>
                <h1 className="text-xl font-semibold sm:text-2xl">Chi tiết nhân viên</h1>
            </div>
            <Button asChild>
                <Link href={`/admin/staff/${stylist.id}/edit`}>
                    <Edit className="mr-2 h-4 w-4" />
                    Chỉnh sửa
                </Link>
            </Button>
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
             <div className="lg:col-span-1 flex flex-col gap-6">
                <Card>
                    <CardHeader className="flex flex-col items-center text-center">
                        <Avatar className="h-24 w-24 mb-4">
                            <AvatarImage src={stylist.image.imageUrl} alt={stylist.name} data-ai-hint={stylist.image.imageHint} />
                            <AvatarFallback>{stylist.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <CardTitle>{stylist.name}</CardTitle>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                            <span>{stylist.rating.toFixed(1)} ({stylist.reviews} reviews)</span>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4 text-sm">
                        <p className="text-muted-foreground">{stylist.bio}</p>
                         <div className="flex items-center gap-3 pt-4 border-t">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <span>{branch ? branch.name : 'Chưa phân công'}</span>
                        </div>
                         <div className="flex items-center gap-3">
                            <Users2 className="h-4 w-4 text-muted-foreground" />
                            <span>{group ? group.name : 'Chưa phân nhóm'}</span>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Kỹ năng</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-wrap gap-2">
                        {stylist.skills.map(skill => (
                            <Badge key={skill} variant="secondary">{skill}</Badge>
                        ))}
                    </CardContent>
                </Card>
             </div>
             <div className="lg:col-span-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Lịch sử làm việc</CardTitle>
                        <CardDescription>{staffBookings.length} lịch hẹn đã hoàn thành.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                <TableHead>Khách hàng</TableHead>
                                <TableHead>Dịch vụ</TableHead>
                                <TableHead>Ngày</TableHead>
                                <TableHead>Trạng thái</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {staffBookings.slice(0, 10).map((booking) => (
                                    <TableRow key={booking.id}>
                                        <TableCell className="font-medium">{booking.customerName}</TableCell>
                                        <TableCell>{booking.serviceName}</TableCell>
                                        <TableCell>{new Date(booking.date).toLocaleDateString()}</TableCell>
                                        <TableCell>
                                            <Badge
                                                className={cn({
                                                    'bg-green-100 text-green-800': booking.status === 'Completed',
                                                    'bg-blue-100 text-blue-800': booking.status === 'Confirmed',
                                                    'bg-red-100 text-red-800': booking.status === 'Cancelled',
                                                })}
                                                variant="outline"
                                                >
                                                {booking.status}
                                            </Badge>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {staffBookings.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={4} className="h-24 text-center">
                                            Chưa có lịch sử làm việc.
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
