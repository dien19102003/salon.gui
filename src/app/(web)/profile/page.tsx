"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useIdentityStore } from "@/hooks/use-identity-store";
import { useCustomer } from "@/context/customer-context";
import { salonApi } from "@/lib/api-client";

type BookingRow = {
  id: string;
  code?: string | null;
  bookingDate: string;
  startTime: number;
  endTime: number;
  siteName?: string | null;
  staffName?: string | null;
  state: number;
  note?: string | null;
};

const formatTime = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
};

const getStateLabel = (state: number): string => {
  const stateMap: Record<number, string> = {
    1: 'Chờ xác nhận',
    2: 'Đã xác nhận',
    3: 'Đang phục vụ',
    4: 'Đã hoàn thành',
    5: 'Khách không đến',
    6: 'Đã hủy',
  };
  return stateMap[state] || 'Không xác định';
};

const getStateVariant = (state: number): string => {
  if (state === 2 || state === 4) return 'text-green-700 bg-green-50 border-green-200';
  if (state === 1) return 'text-yellow-700 bg-yellow-50 border-yellow-200';
  if (state === 6 || state === 5) return 'text-red-700 bg-red-50 border-red-200';
  if (state === 3) return 'text-blue-700 bg-blue-50 border-blue-200';
  return 'text-gray-700 bg-gray-50 border-gray-200';
};

export default function ProfilePage() {
  const { user, isAuthenticated, isLoading } = useIdentityStore();
  const { customer, loading: loadingCustomer } = useCustomer();
  const [bookings, setBookings] = useState<BookingRow[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(false);

  useEffect(() => {
    const loadBookings = async () => {
      if (!customer?.id) {
        setBookings([]);
        return;
      }

      setLoadingBookings(true);
      try {
        const filter = {
          page: 1,
          size: 100,
          customerId: {
            method: 'Or',
            values: [customer.id],
          },
        };
        const response = await salonApi.post<any>('/Booking/GetPage', filter);
        const bookingsData = (response.data ?? []) as any[];

        const mappedBookings: BookingRow[] = bookingsData.map((item: any) => ({
          id: item.id,
          code: item.code,
          bookingDate: item.bookingDate,
          startTime: item.startTime,
          endTime: item.endTime,
          siteName: item.site?.name ?? null,
          staffName: item.staff?.name ?? null,
          state: item.state,
          note: item.note ?? null,
        }));

        setBookings(mappedBookings);
      } catch (error) {
        console.error('Failed to load bookings:', error);
        setBookings([]);
      } finally {
        setLoadingBookings(false);
      }
    };

    loadBookings();
  }, [customer?.id]);

  if (isLoading || loadingCustomer) {
    return (
      <div className="container py-12 md:py-20">
        <Skeleton className="h-8 w-48 mb-4" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!isAuthenticated || !customer) {
    return (
      <div className="container py-12 md:py-20">
        <p>Bạn cần đăng nhập để xem hồ sơ khách hàng.</p>
      </div>
    );
  }

  const displayName = customer.name || user?.name || "Khách hàng";
  const displayEmail = customer.email || "";

  return (
    <div className="container py-12 md:py-20">
      <div className="flex flex-col items-center justify-center space-y-4 text-center">
        <Avatar className="h-24 w-24">
          <AvatarImage
            src=""
            alt={displayName}
            data-ai-hint="person"
          />
          <AvatarFallback>{displayName.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="space-y-1">
          <h1 className="text-2xl font-bold">{displayName}</h1>
          {displayEmail && (
            <p className="text-muted-foreground">{displayEmail}</p>
          )}
        </div>
      </div>

      <Tabs defaultValue="profile" className="mt-12">
        <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3">
          <TabsTrigger value="profile">Thông tin hồ sơ</TabsTrigger>
          <TabsTrigger value="bookings">Lịch hẹn</TabsTrigger>
          <TabsTrigger value="account">Thông tin tài khoản</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Thông tin khách hàng</CardTitle>
              <CardDescription>
                Thông tin cá nhân được đồng bộ từ hệ thống salon.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Họ và tên</p>
                <p className="font-medium">{customer.name}</p>
              </div>
              {customer.phone && (
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Số điện thoại</p>
                  <p className="font-medium">{customer.phone}</p>
                </div>
              )}
              {customer.code && (
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Mã khách hàng</p>
                  <p className="font-medium">{customer.code}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bookings">
          <Card>
            <CardHeader>
              <CardTitle>Lịch hẹn của tôi</CardTitle>
              <CardDescription>
                Danh sách các lịch hẹn đã đặt tại salon.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loadingBookings ? (
                <div className="space-y-4">
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                </div>
              ) : bookings.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  Bạn chưa có lịch hẹn nào.
                </p>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Mã đặt lịch</TableHead>
                        <TableHead>Ngày & Giờ</TableHead>
                        <TableHead>Chi nhánh</TableHead>
                        <TableHead>Nhà tạo mẫu</TableHead>
                        <TableHead>Trạng thái</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {bookings.map((booking) => (
                        <TableRow key={booking.id}>
                          <TableCell className="font-medium">
                            {booking.code || 'N/A'}
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">
                                {format(new Date(booking.bookingDate), 'PPP', { locale: vi })}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {formatTime(booking.startTime)} - {formatTime(booking.endTime)}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            {booking.siteName || 'N/A'}
                          </TableCell>
                          <TableCell>
                            {booking.staffName || 'Chưa chỉ định'}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={cn(getStateVariant(booking.state), 'font-medium py-1')}
                            >
                              {getStateLabel(booking.state)}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="account">
          <Card>
            <CardHeader>
              <CardTitle>Thông tin tài khoản</CardTitle>
              <CardDescription>
                Thông tin được lấy từ accessToken hiện tại.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Account ID</p>
                <p className="font-mono text-sm break-all">{user?.id}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Tên tài khoản</p>
                <p className="font-medium">{user?.name}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Scope</p>
                <Badge>{user?.scope}</Badge>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Issuer</p>
                <p className="font-mono text-sm">{user?.iss}</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
