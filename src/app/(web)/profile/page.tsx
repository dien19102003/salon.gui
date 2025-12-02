"use client";

import { useEffect, useState } from "react";

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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useIdentityStore } from "@/hooks/use-identity-store";
import { salonApi } from "@/lib/api-client";

type CustomerDetail = {
  id: string;
  code?: string | null;
  name: string;
  email?: string | null;
  phone?: string | null;
  streetAddress?: string | null;
  note?: string | null;
};

export default function ProfilePage() {
  const { user, isAuthenticated, isLoading } = useIdentityStore();
  const [customer, setCustomer] = useState<CustomerDetail | null>(null);
  const [isLoadingCustomer, setIsLoadingCustomer] = useState(false);

  useEffect(() => {
    const loadCustomer = async () => {
      if (!user?.id) {
        setCustomer(null);
        return;
      }

      setIsLoadingCustomer(true);

      try {
        const response = await salonApi.get<any>(
          `/Customer/GetDetailByAccountId/${encodeURIComponent(user.id)}`
        );

        const data = (response as any).data ?? response;

        setCustomer({
          id: data.id,
          code: data.code,
          name: data.name,
          email: data.email,
          phone: data.phone,
          streetAddress: data.streetAddress,
          note: data.note,
        });
      } catch (error: any) {
        // Nếu backend trả 400 vì chưa có khách hàng gắn với account,
        // không coi là lỗi nghiêm trọng, chỉ đơn giản là chưa có hồ sơ.
        if (error?.status !== 400) {
          // eslint-disable-next-line no-console
          console.error("Không thể tải thông tin khách hàng", error);
        }

        setCustomer(null);
      } finally {
        setIsLoadingCustomer(false);
      }
    };

    loadCustomer();
  }, [user?.id]);

  if (isLoading || isLoadingCustomer) {
    return (
      <div className="container py-12 md:py-20">
        <p>Đang tải hồ sơ...</p>
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
        <TabsList className="grid w-full grid-cols-1 sm:grid-cols-2">
          <TabsTrigger value="profile">Thông tin hồ sơ</TabsTrigger>
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
              {customer.streetAddress && (
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Địa chỉ</p>
                  <p className="font-medium">{customer.streetAddress}</p>
                </div>
              )}
              {customer.note && (
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Ghi chú</p>
                  <p className="font-medium">{customer.note}</p>
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
