'use client';

import { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { format } from 'date-fns';
import { ArrowLeft, Calendar as CalendarIcon, Plus, X } from 'lucide-react';

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
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { salonApi } from '@/lib/api-client';
import { useSite } from '@/context/site-branch-context';

type Customer = {
  id: string;
  name: string;
  email?: string | null;
  phone?: string | null;
};

type Service = {
  id: string;
  name: string;
  code?: string | null;
  estimatedTime: number;
};

type Staff = {
  id: string;
  name: string;
  code?: string | null;
};

type SelectedService = {
  serviceId: string;
  quantity: number;
  note?: string;
};

export default function NewBookingPage() {
  const router = useRouter();
  const { selectedSiteId, sites } = useSite();

  // Form state
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [customerId, setCustomerId] = useState<string>('');
  const [staffId, setStaffId] = useState<string>('');
  const [note, setNote] = useState<string>('');
  const [selectedServices, setSelectedServices] = useState<SelectedService[]>([]);
  const [currentServiceId, setCurrentServiceId] = useState<string>('');
  const [currentServiceQuantity, setCurrentServiceQuantity] = useState<number>(1);

  // Data loading state
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [staffs, setStaffs] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Load Customers
        const customersResponse = await salonApi.post<any>('/Customer/GetAll', {});
        const customersData = (customersResponse.data ?? customersResponse) as any[];
        setCustomers(customersData.map((c: any) => ({
          id: c.id,
          name: c.name,
          email: c.email,
          phone: c.phone,
        })));

        // Load Services
        const servicesResponse = await salonApi.post<any>('/Service/GetAll', {});
        const servicesData = (servicesResponse.data ?? servicesResponse) as any[];
        setServices(servicesData.map((s: any) => ({
          id: s.id,
          name: s.name,
          code: s.code,
          estimatedTime: s.estimatedTime ?? 0,
        })));

        // Load Staffs (optional)
        try {
          const staffsResponse = await salonApi.post<any>('/Staff/GetAll', {});
          const staffsData = (staffsResponse.data ?? staffsResponse) as any[];
          setStaffs(staffsData.map((s: any) => ({
            id: s.id,
            name: s.name,
            code: s.code,
          })));
        } catch (err) {
          // Staff API might fail, ignore
          console.warn('Could not load staffs:', err);
        }
      } catch (err) {
        console.error('Failed to load data:', err);
        setError('Không thể tải dữ liệu. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Generate time slots (9:00 - 18:00, every 30 minutes)
  const generateTimeSlots = () => {
    const slots: string[] = [];
    for (let hour = 9; hour < 18; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeStr = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        slots.push(timeStr);
      }
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  const handleAddService = () => {
    if (!currentServiceId) return;

    const service = services.find(s => s.id === currentServiceId);
    if (!service) return;

    // Check if service already added
    if (selectedServices.some(s => s.serviceId === currentServiceId)) {
      setError('Dịch vụ này đã được thêm vào.');
      return;
    }

    setSelectedServices([
      ...selectedServices,
      {
        serviceId: currentServiceId,
        quantity: currentServiceQuantity,
        note: '',
      },
    ]);

    setCurrentServiceId('');
    setCurrentServiceQuantity(1);
    setError(null);
  };

  const handleRemoveService = (serviceId: string) => {
    setSelectedServices(selectedServices.filter(s => s.serviceId !== serviceId));
  };

  const handleUpdateServiceQuantity = (serviceId: string, quantity: number) => {
    setSelectedServices(selectedServices.map(s =>
      s.serviceId === serviceId ? { ...s, quantity } : s
    ));
  };

  const handleUpdateServiceNote = (serviceId: string, note: string) => {
    setSelectedServices(selectedServices.map(s =>
      s.serviceId === serviceId ? { ...s, note } : s
    ));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    // Validation
    if (!selectedDate) {
      setError('Vui lòng chọn ngày đặt lịch.');
      return;
    }

    if (!selectedTime) {
      setError('Vui lòng chọn thời gian đặt lịch.');
      return;
    }

    if (!selectedSiteId) {
      setError('Vui lòng chọn chi nhánh từ header.');
      return;
    }

    if (!customerId) {
      setError('Vui lòng chọn khách hàng.');
      return;
    }

    if (selectedServices.length === 0) {
      setError('Vui lòng thêm ít nhất một dịch vụ.');
      return;
    }

    try {
      setSubmitting(true);

      // Combine date and time
      const [hours, minutes] = selectedTime.split(':').map(Number);
      const bookingDate = new Date(selectedDate);
      bookingDate.setHours(hours, minutes, 0, 0);

      // Prepare payload
      // Backend mong đợi Unix timestamp (seconds) - Int64 format
      const payload = {
        booking: {
          bookingDate: Math.floor(bookingDate.getTime() / 1000), // Unix timestamp in seconds (Int64)
          siteId: selectedSiteId,
          customerId,
          staffId: staffId || null,
          note: note || null,
        },
        services: selectedServices.map(s => ({
          serviceId: s.serviceId,
          quantity: s.quantity,
          note: s.note || null,
        })),
      };

      const response = await salonApi.post<any>('/Booking', payload);

      // Success - redirect to bookings list
      router.push('/admin/bookings');
    } catch (err: any) {
      console.error('Failed to create booking:', err);
      const errorMessage = err?.payload?.message || err?.message || 'Không thể tạo đặt lịch. Vui lòng thử lại.';
      setError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button asChild variant="outline" size="icon">
            <Link href="/admin/bookings">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Quay lại Đặt chỗ</span>
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">Thêm Đặt chỗ mới</h1>
        </div>
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">Đang tải dữ liệu...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error && !submitting) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button asChild variant="outline" size="icon">
            <Link href="/admin/bookings">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Quay lại Đặt chỗ</span>
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">Thêm Đặt chỗ mới</h1>
        </div>
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-destructive">{error}</p>
            <Button onClick={() => window.location.reload()} className="mt-4">
              Thử lại
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

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
          <p className="text-muted-foreground">
            Tạo một cuộc hẹn mới cho khách hàng đến trực tiếp hoặc qua điện thoại.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Thông tin cơ bản</CardTitle>
              <CardDescription>
                Chọn chi nhánh, khách hàng và nhân viên (nếu có).
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="site">Chi nhánh *</Label>
                <div className="p-3 bg-muted rounded-md border">
                  {selectedSiteId ? (() => {
                    const selectedSite = sites.find(s => s.id === selectedSiteId);
                    return (
                      <div className="font-medium">
                        {selectedSite?.name || 'Đang tải...'}
                        {selectedSite?.code && ` (${selectedSite.code})`}
                      </div>
                    );
                  })() : (
                    <div className="text-muted-foreground">Vui lòng chọn chi nhánh từ header</div>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  Chi nhánh được chọn từ dropdown ở header phía trên
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="customer">Khách hàng *</Label>
                <Select value={customerId} onValueChange={setCustomerId} required>
                  <SelectTrigger id="customer">
                    <SelectValue placeholder="Chọn khách hàng" />
                  </SelectTrigger>
                  <SelectContent>
                    {customers.map(customer => (
                      <SelectItem key={customer.id} value={customer.id}>
                        {customer.name} {customer.email && `(${customer.email})`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="staff">Nhân viên (tùy chọn)</Label>
                <Select value={staffId} onValueChange={setStaffId}>
                  <SelectTrigger id="staff">
                    <SelectValue placeholder="Chọn nhân viên (để trống nếu không cần)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Không chọn</SelectItem>
                    {staffs.map(staff => (
                      <SelectItem key={staff.id} value={staff.id}>
                        {staff.name} {staff.code && `(${staff.code})`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="note">Ghi chú</Label>
                <Textarea
                  id="note"
                  placeholder="Ghi chú về đặt lịch..."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Thời gian đặt lịch</CardTitle>
              <CardDescription>
                Chọn ngày và giờ cho cuộc hẹn.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Ngày *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        'w-full justify-start text-left font-normal',
                        !selectedDate && 'text-muted-foreground'
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {selectedDate ? format(selectedDate, 'PPP') : <span>Chọn một ngày</span>}
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
                <Label>Thời gian *</Label>
                <Select value={selectedTime} onValueChange={setSelectedTime} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn thời gian" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeSlots.map(time => (
                      <SelectItem key={time} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Dịch vụ</CardTitle>
            <CardDescription>
              Thêm các dịch vụ cho cuộc hẹn này. Phải có ít nhất một dịch vụ.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Select value={currentServiceId} onValueChange={setCurrentServiceId}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Chọn dịch vụ" />
                </SelectTrigger>
                <SelectContent>
                  {services
                    .filter(s => !selectedServices.some(ss => ss.serviceId === s.id))
                    .map(service => (
                      <SelectItem key={service.id} value={service.id}>
                        {service.name} ({service.estimatedTime} phút)
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              <Input
                type="number"
                min="1"
                value={currentServiceQuantity}
                onChange={(e) => setCurrentServiceQuantity(Number(e.target.value) || 1)}
                className="w-24"
                placeholder="SL"
              />
              <Button
                type="button"
                onClick={handleAddService}
                disabled={!currentServiceId}
              >
                <Plus className="h-4 w-4 mr-2" />
                Thêm
              </Button>
            </div>

            {selectedServices.length > 0 && (
              <div className="space-y-2">
                {selectedServices.map(selected => {
                  const service = services.find(s => s.id === selected.serviceId);
                  if (!service) return null;

                  return (
                    <div
                      key={selected.serviceId}
                      className="flex items-center gap-2 p-3 border rounded-md"
                    >
                      <div className="flex-1">
                        <div className="font-medium">{service.name}</div>
                        <div className="text-sm text-muted-foreground">
                          Thời gian: {service.estimatedTime} phút
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Label className="text-sm">Số lượng:</Label>
                        <Input
                          type="number"
                          min="1"
                          value={selected.quantity}
                          onChange={(e) =>
                            handleUpdateServiceQuantity(
                              selected.serviceId,
                              Number(e.target.value) || 1
                            )
                          }
                          className="w-20"
                        />
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveService(selected.serviceId)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  );
                })}
              </div>
            )}

            {selectedServices.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">
                Chưa có dịch vụ nào được thêm. Vui lòng thêm ít nhất một dịch vụ.
              </p>
            )}
          </CardContent>
        </Card>

        {error && (
          <div className="mt-4 p-4 bg-destructive/10 text-destructive rounded-md">
            {error}
          </div>
        )}

        <div className="mt-6 flex justify-end gap-4">
          <Button type="button" variant="outline" asChild>
            <Link href="/admin/bookings">Hủy</Link>
          </Button>
          <Button type="submit" disabled={submitting}>
            {submitting ? 'Đang tạo...' : 'Tạo Đặt chỗ'}
          </Button>
        </div>
      </form>
    </div>
  );
}
