'use client';

import { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Plus, X } from 'lucide-react';

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
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { salonApi } from '@/lib/api-client';
import { useSite } from '@/context/site-branch-context';

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

type SelectedOrderItem = {
  serviceId: string;
  quantity: number;
  staffIds: string[];
};

// Helper function to format price to VND format (1,xxx,xxx đ)
const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('vi-VN').format(price) + ' đ';
};

export default function NewWalkInOrderPage() {
  const router = useRouter();
  const { selectedSiteId, sites } = useSite();

  // Form state
  const [customerPhone, setCustomerPhone] = useState<string>('');
  const [customerName, setCustomerName] = useState<string>('');
  const [selectedItems, setSelectedItems] = useState<SelectedOrderItem[]>([]);
  const [currentServiceId, setCurrentServiceId] = useState<string>('');
  const [currentQuantity, setCurrentQuantity] = useState<number>(1);
  const [currentStaffIds, setCurrentStaffIds] = useState<string[]>([]);

  // Data loading state
  const [services, setServices] = useState<Service[]>([]);
  const [staffs, setStaffs] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load services and staffs
  useEffect(() => {
    const loadData = async () => {
      if (!selectedSiteId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Load Services for the selected site
        const servicesFilter: any = {
          page: 1,
          size: 100,
          status: 1, // ActiveOnly
          siteId: selectedSiteId,
          state: {
            method: 'Or',
            values: [1], // ServiceStates.Active = 1
          },
        };
        const servicesResponse = await salonApi.post<any>('/Service/GetPage', servicesFilter);
        const servicesData = (servicesResponse.data ?? []) as any[];
        setServices(servicesData.map((s: any) => ({
          id: s.id,
          name: s.name,
          code: s.code,
          estimatedTime: s.estimatedTime ?? 0,
        })));

        // Load Staffs for the selected site
        const staffsFilter: any = {
          page: 1,
          size: 100,
          status: 1, // ActiveOnly
          siteId: {
            method: 'Or',
            values: [selectedSiteId],
          },
        };
        const staffsResponse = await salonApi.post<any>('/Staff/GetPage', staffsFilter);
        const staffsData = (staffsResponse.data ?? []) as any[];
        setStaffs(staffsData.map((s: any) => ({
          id: s.id,
          name: s.name,
          code: s.code,
        })));
      } catch (err) {
        console.error('Failed to load data:', err);
        setError('Không thể tải dữ liệu. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [selectedSiteId]);

  const handleAddService = () => {
    if (!currentServiceId) {
      setError('Vui lòng chọn dịch vụ.');
      return;
    }

    const service = services.find(s => s.id === currentServiceId);
    if (!service) return;

    // Check if service already added
    if (selectedItems.some(item => item.serviceId === currentServiceId)) {
      setError('Dịch vụ này đã được thêm vào.');
      return;
    }

    setSelectedItems([
      ...selectedItems,
      {
        serviceId: currentServiceId,
        quantity: currentQuantity,
        staffIds: currentStaffIds,
      },
    ]);

    setCurrentServiceId('');
    setCurrentQuantity(1);
    setCurrentStaffIds([]);
    setError(null);
  };

  const handleRemoveItem = (serviceId: string) => {
    setSelectedItems(selectedItems.filter(item => item.serviceId !== serviceId));
  };

  const handleUpdateQuantity = (serviceId: string, quantity: number) => {
    if (quantity < 1) return;
    setSelectedItems(selectedItems.map(item =>
      item.serviceId === serviceId ? { ...item, quantity } : item
    ));
  };

  const handleToggleStaff = (serviceId: string, staffId: string) => {
    setSelectedItems(selectedItems.map(item => {
      if (item.serviceId === serviceId) {
        const staffIds = item.staffIds.includes(staffId)
          ? item.staffIds.filter(id => id !== staffId)
          : [...item.staffIds, staffId];
        return { ...item, staffIds };
      }
      return item;
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    // Validation
    if (!selectedSiteId) {
      setError('Vui lòng chọn chi nhánh từ header.');
      return;
    }

    if (!customerPhone.trim()) {
      setError('Vui lòng nhập số điện thoại khách hàng.');
      return;
    }

    if (selectedItems.length === 0) {
      setError('Vui lòng thêm ít nhất một dịch vụ.');
      return;
    }

    try {
      setSubmitting(true);

      // Prepare payload
      const payload = {
        customerPhone: customerPhone.trim(),
        customerName: customerName.trim() || null,
        siteId: selectedSiteId,
        orderItems: selectedItems.map(item => ({
          serviceId: item.serviceId,
          quantity: item.quantity,
          staffIds: item.staffIds,
        })),
      };

      console.log('Submitting walk-in order:', payload);
      const response = await salonApi.post<any>('/Order/CreateWalkIn', payload);
      console.log('Walk-in order created successfully:', response);

      // Success - redirect to orders list
      router.push('/admin/orders');
    } catch (err: any) {
      console.error('Failed to create walk-in order:', err);
      const errorMessage = err?.payload?.message || err?.message || err?.payload?.error || 'Không thể tạo đơn hàng. Vui lòng thử lại.';
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
            <Link href="/admin/orders">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Quay lại Đơn hàng</span>
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">Tạo đơn hàng khách vãng lai</h1>
        </div>
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">Đang tải dữ liệu...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!selectedSiteId) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button asChild variant="outline" size="icon">
            <Link href="/admin/orders">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Quay lại Đơn hàng</span>
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">Tạo đơn hàng khách vãng lai</h1>
        </div>
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">Vui lòng chọn chi nhánh từ dropdown ở header.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button asChild variant="outline" size="icon">
          <Link href="/admin/orders">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Quay lại Đơn hàng</span>
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">Tạo đơn hàng khách vãng lai</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Thông tin khách hàng</CardTitle>
            <CardDescription>
              Nhập thông tin khách hàng vãng lai. Hệ thống sẽ tự động tìm hoặc tạo khách hàng mới.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="site">Chi nhánh *</Label>
              <div className="p-3 bg-muted rounded-md border">
                <div className="font-medium">
                  {sites.find(s => s.id === selectedSiteId)?.name || 'Đang tải...'}
                  {sites.find(s => s.id === selectedSiteId)?.code && ` (${sites.find(s => s.id === selectedSiteId)?.code})`}
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                Chi nhánh được chọn từ dropdown ở header phía trên
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="customerPhone">Số điện thoại khách hàng *</Label>
              <Input
                id="customerPhone"
                type="tel"
                placeholder="0901234567"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                required
              />
              <p className="text-xs text-muted-foreground">
                Hệ thống sẽ tìm khách hàng theo số điện thoại. Nếu chưa có, sẽ tạo mới.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="customerName">Tên khách hàng (nếu mới)</Label>
              <Input
                id="customerName"
                type="text"
                placeholder="Nguyễn Văn A"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Chỉ cần nhập nếu khách hàng chưa có trong hệ thống. Nếu để trống, sẽ dùng số điện thoại làm tên.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Dịch vụ</CardTitle>
            <CardDescription>
              Thêm các dịch vụ cho đơn hàng này.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Select value={currentServiceId} onValueChange={setCurrentServiceId}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Chọn dịch vụ" />
                </SelectTrigger>
                <SelectContent>
                  {services.map(service => (
                    <SelectItem key={service.id} value={service.id}>
                      {service.name} {service.code && `(${service.code})`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                type="number"
                min="1"
                value={currentQuantity}
                onChange={(e) => setCurrentQuantity(parseInt(e.target.value) || 1)}
                className="w-24"
                placeholder="SL"
              />
              <Button type="button" onClick={handleAddService} disabled={!currentServiceId}>
                <Plus className="mr-2 h-4 w-4" />
                Thêm
              </Button>
            </div>

            {selectedItems.length > 0 && (
              <div className="space-y-3 border-t pt-4">
                {selectedItems.map((item) => {
                  const service = services.find(s => s.id === item.serviceId);
                  return (
                    <div key={item.serviceId} className="p-4 border rounded-lg space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="font-medium">{service?.name || 'N/A'}</div>
                          {service?.code && (
                            <div className="text-sm text-muted-foreground">Mã: {service.code}</div>
                          )}
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveItem(item.serviceId)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="space-y-1">
                          <Label className="text-sm">Số lượng</Label>
                          <div className="flex items-center gap-2">
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => handleUpdateQuantity(item.serviceId, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                            >
                              -
                            </Button>
                            <Input
                              type="number"
                              min="1"
                              value={item.quantity}
                              onChange={(e) => handleUpdateQuantity(item.serviceId, parseInt(e.target.value) || 1)}
                              className="w-20 text-center"
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => handleUpdateQuantity(item.serviceId, item.quantity + 1)}
                            >
                              +
                            </Button>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm">Nhân viên phục vụ (tùy chọn)</Label>
                        <div className="flex flex-wrap gap-2">
                          {staffs.map(staff => (
                            <Badge
                              key={staff.id}
                              variant={item.staffIds.includes(staff.id) ? 'default' : 'outline'}
                              className="cursor-pointer"
                              onClick={() => handleToggleStaff(item.serviceId, staff.id)}
                            >
                              {staff.name}
                            </Badge>
                          ))}
                          {staffs.length === 0 && (
                            <p className="text-sm text-muted-foreground">Không có nhân viên nào</p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {selectedItems.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">
                Chưa có dịch vụ nào. Vui lòng thêm dịch vụ để tiếp tục.
              </p>
            )}
          </CardContent>
        </Card>

        {error && (
          <div className="p-4 bg-destructive/10 text-destructive rounded-md text-sm">
            {error}
          </div>
        )}

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" asChild>
            <Link href="/admin/orders">Hủy</Link>
          </Button>
          <Button type="submit" disabled={submitting || selectedItems.length === 0}>
            {submitting ? 'Đang tạo...' : 'Tạo đơn hàng'}
          </Button>
        </div>
      </form>
    </div>
  );
}

