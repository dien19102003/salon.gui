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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { bookings } from '@/lib/data';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Pencil } from 'lucide-react';

export const metadata = {
  title: 'Hồ sơ của tôi | Eggstech Salon',
  description: 'Quản lý hồ sơ, xem các cuộc hẹn sắp tới và lịch sử đặt chỗ của bạn.',
};

const upcomingAppointments = bookings.filter(b => b.status === 'Confirmed' && new Date(b.date) >= new Date());
const pastAppointments = bookings.filter(b => b.status === 'Completed' || new Date(b.date) < new Date());

export default function ProfilePage() {
  const user = {
    name: 'Alex Smith',
    email: 'alex.s@example.com',
    avatar: 'https://picsum.photos/seed/alex-smith/100/100'
  };

  return (
    <div className="container py-12 md:py-20">
      <div className="flex flex-col items-center justify-center space-y-4 text-center">
        <Avatar className="h-24 w-24">
          <AvatarImage src={user.avatar} alt={user.name} data-ai-hint="person" />
          <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="space-y-1">
          <h1 className="text-2xl font-bold">{user.name}</h1>
          <p className="text-muted-foreground">{user.email}</p>
        </div>
      </div>

      <Tabs defaultValue="appointments" className="mt-12">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="appointments">Lịch hẹn sắp tới</TabsTrigger>
          <TabsTrigger value="history">Lịch sử đặt chỗ</TabsTrigger>
          <TabsTrigger value="profile">Chỉnh sửa hồ sơ</TabsTrigger>
        </TabsList>

        <TabsContent value="appointments">
          <Card>
            <CardHeader>
              <CardTitle>Lịch hẹn sắp tới</CardTitle>
              <CardDescription>
                Đây là các cuộc hẹn đã lên lịch của bạn. Chúng tôi rất mong được gặp bạn!
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Dịch vụ</TableHead>
                    <TableHead>Nhà tạo mẫu</TableHead>
                    <TableHead>Ngày & Giờ</TableHead>
                    <TableHead className="text-right">Hành động</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {upcomingAppointments.length > 0 ? (
                    upcomingAppointments.map((booking) => (
                      <TableRow key={booking.id}>
                        <TableCell className="font-medium">{booking.serviceName}</TableCell>
                        <TableCell>{booking.stylistName}</TableCell>
                        <TableCell>{new Date(booking.date).toLocaleDateString()} lúc {booking.time}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="outline" size="sm">Quản lý</Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center h-24">Không có lịch hẹn sắp tới.</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Lịch sử đặt chỗ</CardTitle>
              <CardDescription>
                Hồ sơ về các lần ghé thăm trước đây của bạn tại Eggstech Salon.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Dịch vụ</TableHead>
                    <TableHead>Nhà tạo mẫu</TableHead>
                    <TableHead>Ngày</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead className="text-right">Giá</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pastAppointments.map((booking) => (
                    <TableRow key={booking.id}>
                      <TableCell className="font-medium">{booking.serviceName}</TableCell>
                      <TableCell>{booking.stylistName}</TableCell>
                      <TableCell>{new Date(booking.date).toLocaleDateString()}</TableCell>
                      <TableCell>
                         <Badge
                            variant={
                              booking.status === 'Completed' ? 'default' : 'secondary'
                            }
                            className={cn({
                              'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200': booking.status === 'Completed',
                              'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200': booking.status === 'Cancelled',
                            })}
                          >
                            {booking.status === 'Completed' ? 'Hoàn thành' : 'Đã hủy'}
                          </Badge>
                      </TableCell>
                      <TableCell className="text-right">${booking.price}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Chỉnh sửa hồ sơ</CardTitle>
              <CardDescription>
                Thực hiện thay đổi thông tin cá nhân của bạn tại đây.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Họ và tên</Label>
                <Input id="name" defaultValue={user.name} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Địa chỉ Email</Label>
                <Input id="email" type="email" defaultValue={user.email} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Số điện thoại</Label>
                <Input id="phone" type="tel" placeholder="(123) 456-7890" />
              </div>
              <Button className="rounded-full">Lưu thay đổi</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
