'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { ArrowLeft, Calendar as CalendarIcon } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { services, stylists } from '@/lib/data';

const availableTimes = [
  '09:00 SA', '09:30 SA', '10:00 SA', '10:30 SA',
  '11:00 SA', '11:30 SA', '01:00 CH', '01:30 CH',
  '02:00 CH', '02:30 CH', '03:00 CH', '03:30 CH',
];

export default function NewBookingPage() {
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
    const [selectedTime, setSelectedTime] = useState<string | undefined>();

  return (
    <div className="space-y-6">
        <div className="flex items-center gap-4">
            <Button asChild variant="outline" size="icon">
                <Link href="/admin/bookings">
                    <ArrowLeft className="h-4 w-4" />
                    <span className="sr-only">Quay lại Đặt chỗ</span>
                </Link>
            </Button>
            <div className="space-y-1">
                <h1 className="text-2xl font-bold">Thêm Đặt chỗ mới</h1>
                <p className="text-muted-foreground">Tạo một cuộc hẹn mới cho khách hàng đến trực tiếp hoặc qua điện thoại.</p>
            </div>
        </div>
      <Card>
        <CardHeader>
          <CardTitle>Chi tiết cuộc hẹn</CardTitle>
          <CardDescription>
            Điền vào các chi tiết dưới đây để tạo một đặt chỗ mới.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="grid gap-6 lg:grid-cols-2">
            <div className="space-y-6">
                 <div className="space-y-2">
                    <Label htmlFor="customer-name">Tên khách hàng</Label>
                    <Input id="customer-name" placeholder="ví dụ: John Doe" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="customer-email">Email khách hàng</Label>
                    <Input id="customer-email" type="email" placeholder="ví dụ: john@example.com" />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="service">Dịch vụ</Label>
                    <Select>
                        <SelectTrigger>
                            <SelectValue placeholder="Chọn một dịch vụ" />
                        </SelectTrigger>
                        <SelectContent>
                            {services.map(service => (
                                <SelectItem key={service.id} value={service.id}>{service.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="stylist">Nhà tạo mẫu</Label>
                    <Select>
                        <SelectTrigger>
                            <SelectValue placeholder="Chọn một nhà tạo mẫu" />
                        </SelectTrigger>
                        <SelectContent>
                            {stylists.map(stylist => (
                                <SelectItem key={stylist.id} value={stylist.id}>{stylist.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <div className="space-y-6">
                <div className="space-y-2">
                     <Label htmlFor="date">Ngày</Label>
                    <Popover>
                        <PopoverTrigger asChild>
                        <Button
                            variant={"outline"}
                            className={cn(
                            "w-full justify-start text-left font-normal",
                            !selectedDate && "text-muted-foreground"
                            )}
                        >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {selectedDate ? format(selectedDate, "PPP") : <span>Chọn một ngày</span>}
                        </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                        <Calendar
                            mode="single"
                            selected={selectedDate}
                            onSelect={setSelectedDate}
                            initialFocus
                        />
                        </PopoverContent>
                    </Popover>
                </div>

                <div className="space-y-2">
                    <Label>Thời gian</Label>
                    <div className="grid grid-cols-3 gap-2">
                        {availableTimes.map((time) => (
                            <Button
                                key={time}
                                type="button"
                                variant={selectedTime === time ? 'default' : 'outline'}
                                onClick={() => setSelectedTime(time)}
                            >
                                {time}
                            </Button>
                        ))}
                    </div>
                </div>
                 <Button type="submit" className="w-full">Tạo Đặt chỗ</Button>
            </div>

          </form>
        </CardContent>
      </Card>
    </div>
  );
}
