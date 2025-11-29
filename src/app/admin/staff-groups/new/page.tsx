
'use client';

import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Scissors } from 'lucide-react';
import { services } from '@/lib/data';
import { Switch } from '@/components/ui/switch';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function NewStaffGroupPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button asChild variant="outline" size="icon" className="h-8 w-8">
          <Link href="/admin/staff-groups">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back to Staff Groups</span>
          </Link>
        </Button>
        <h1 className="text-xl font-semibold sm:text-2xl">Tạo nhóm nhân viên mới</h1>
      </div>
      <form className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1 flex flex-col gap-6">
            <Card>
                <CardHeader>
                    <CardTitle>Thông tin nhóm</CardTitle>
                    <CardDescription>Cung cấp tên và mô tả cho nhóm mới.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Tên nhóm</Label>
                        <Input id="name" placeholder="Ví dụ: Stylist cấp cao" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="description">Mô tả</Label>
                        <Textarea id="description" placeholder="Mô tả vai trò và trách nhiệm của nhóm." rows={4} />
                    </div>
                </CardContent>
            </Card>
        </div>
        <div className="lg:col-span-2">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Scissors className="h-5 w-5"/>Phân công dịch vụ</CardTitle>
                    <CardDescription>Chọn các dịch vụ mà nhóm này được phép thực hiện.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ScrollArea className="h-96">
                        <div className="space-y-4">
                            {services.map(service => (
                                <div key={service.id} className="flex items-center justify-between rounded-lg border p-4">
                                    <div>
                                        <p className="font-medium">{service.name}</p>
                                        <p className="text-sm text-muted-foreground">${service.price.toFixed(2)} - {service.duration} phút</p>
                                    </div>
                                    <Switch id={`service-${service.id}`} />
                                </div>
                            ))}
                        </div>
                    </ScrollArea>
                </CardContent>
                <CardFooter className="border-t pt-6 flex justify-end gap-2">
                    <Button variant="outline" asChild><Link href="/admin/staff-groups">Hủy</Link></Button>
                    <Button>Tạo nhóm</Button>
                </CardFooter>
            </Card>
        </div>
      </form>
    </div>
  );
}
