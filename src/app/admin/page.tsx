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
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DollarSign,
  Users,
  CalendarCheck,
  ArrowUpRight,
  Scissors
} from 'lucide-react';
import { bookings, services } from '@/lib/data';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { RevenueChart, ServicesChart } from '@/components/admin/dashboard-charts';
import { ChartConfig } from "@/components/ui/chart"

export const metadata = {
  title: 'Bảng điều khiển | Eggstech Salon Admin',
  description: 'Tổng quan về hoạt động salon của bạn.',
};

const serviceChartData = services.slice(0, 4).map(s => ({ service: s.name, bookings: Math.floor(Math.random() * 50) + 10, fill: `var(--color-chart-${services.findIndex(cs => cs.id === s.id) + 1})` }));

const serviceChartConfig = services.slice(0, 4).reduce((acc, s, i) => {
  acc[s.name] = {
    label: s.name,
    color: `hsl(var(--chart-${i + 1}))`
  }
  return acc;
}, {} as ChartConfig)


export default function AdminDashboardPage() {
  const todaysBookings = bookings.filter(b => b.date === '2024-07-28'); // Sử dụng ngày cố định để demo
  const totalRevenue = bookings.filter(b => b.status === 'Completed').reduce((sum, b) => sum + b.price, 0);
  const newCustomers = 573;
  const totalBookings = bookings.length;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng doanh thu</CardTitle>
            <DollarSign className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">+20.1% so với tháng trước</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng số lượt đặt</CardTitle>
            <CalendarCheck className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{totalBookings}</div>
            <p className="text-xs text-muted-foreground">+180.1% so với tháng trước</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng số dịch vụ</CardTitle>
            <Scissors className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{services.length}</div>
            <p className="text-xs text-muted-foreground">2 dịch vụ mới trong tháng này</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Khách hàng mới</CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{newCustomers}</div>
            <p className="text-xs text-muted-foreground">+201 kể từ tháng trước</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Tổng quan doanh thu</CardTitle>
            <CardDescription>Doanh thu hàng tháng trong 6 tháng qua.</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <RevenueChart />
          </CardContent>
        </Card>
        <Card className="lg:col-span-3 flex flex-col">
          <CardHeader>
            <CardTitle>Dịch vụ phổ biến</CardTitle>
            <CardDescription>Phân bổ lượt đặt theo loại dịch vụ.</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex items-center justify-center pb-0">
            <ServicesChart serviceChartData={serviceChartData} serviceChartConfig={serviceChartConfig} />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center">
          <div className="grid gap-2">
            <CardTitle>Lượt đặt gần đây</CardTitle>
            <CardDescription>
              Các cuộc hẹn mới nhất được lên lịch tại salon.
            </CardDescription>
          </div>
          <Button asChild size="sm" className="ml-auto gap-1">
            <Link href="/admin/bookings">
              Xem tất cả
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Khách hàng</TableHead>
                <TableHead>Dịch vụ</TableHead>
                <TableHead>Nhà tạo mẫu</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className="text-right">Giá</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bookings.slice(0, 5).map(booking => (
                <TableRow key={booking.id}>
                  <TableCell>
                    <div className="font-medium">{booking.customerName}</div>
                    <div className="text-sm text-muted-foreground">
                      {booking.customerEmail}
                    </div>
                  </TableCell>
                  <TableCell>{booking.serviceName}</TableCell>
                  <TableCell>{booking.stylistName}</TableCell>
                  <TableCell>
                    <Badge
                      className={cn({
                        'bg-green-100 text-green-700 border-green-200': booking.status === 'Confirmed' || booking.status === 'Completed',
                        'bg-yellow-100 text-yellow-700 border-yellow-200': booking.status === 'Pending',
                        'bg-red-100 text-red-700 border-red-200': booking.status === 'Cancelled',
                      }, 'font-medium')}
                      variant="outline"
                    >
                      {booking.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">${booking.price.toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
