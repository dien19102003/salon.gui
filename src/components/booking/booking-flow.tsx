'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, CheckCircle, ArrowRight, ArrowLeft, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { salonApi, authUser } from '@/lib/api-client';
import { useCustomer } from '@/context/customer-context';

// Helper để lấy customer từ localStorage trực tiếp (fallback)
const getCustomerFromStorage = (): { id: string; name: string } | null => {
  if (typeof window === 'undefined' || !window.localStorage) return null;
  try {
    const stored = window.localStorage.getItem('customerData');
    if (stored) {
      const customer = JSON.parse(stored);
      return customer?.id ? customer : null;
    }
  } catch {
    return null;
  }
  return null;
};

// Helper function to format price to VND format (1,xxx,xxx đ)
const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('vi-VN').format(price) + ' đ';
};

type Service = {
  id: string;
  name: string;
  price: number;
  duration?: number;
};

type Stylist = {
  id: string;
  name: string;
};

interface BookingFlowProps {
  services: Service[];
  stylists: Stylist[];
  siteId: string | null;
  initialServiceId?: string;
  initialStylistId?: string;
}

const steps = [
  { id: 1, title: 'Chọn Dịch vụ' },
  { id: 2, title: 'Chọn Nhà tạo mẫu' },
  { id: 3, title: 'Chọn Ngày & Giờ' },
  { id: 4, title: 'Thông tin của bạn' },
  { id: 5, title: 'Xác nhận' },
];

const availableTimes = [
  '09:00 SA', '09:30 SA', '10:00 SA', '10:30 SA',
  '11:00 SA', '11:30 SA', '01:00 CH', '01:30 CH',
  '02:00 CH', '02:30 CH', '03:00 CH', '03:30 CH',
];


export function BookingFlow({ services, stylists, siteId, initialServiceId, initialStylistId }: BookingFlowProps) {
  const router = useRouter();
  const { customer, loading: customerLoading, loadCustomer } = useCustomer();
  const [currentStep, setCurrentStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [selectedServices, setSelectedServices] = useState<Set<string>>(
    new Set(initialServiceId ? [initialServiceId] : [])
  );
  const [selectedStylist, setSelectedStylist] = useState<Stylist | undefined>(
    stylists.find(s => s.id === initialStylistId)
  );
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = useState<string | undefined>();

  // Tự động load customer khi component mount hoặc khi vào step 4
  useEffect(() => {
    // Load customer ngay khi component mount nếu chưa có
    if (!customer && !customerLoading) {
      loadCustomer();
    }
  }, [customer, customerLoading, loadCustomer]);

  // Đảm bảo customer được load khi vào step 4
  useEffect(() => {
    if (currentStep === 4 && !customer && !customerLoading) {
      loadCustomer();
    }
  }, [currentStep, customer, customerLoading, loadCustomer]);

  const nextStep = async () => {
    setDirection(1);
    if (currentStep < 5) {
      // Nếu đang chuyển sang step 4 và chưa có customer, thử load lại
      if (currentStep === 3 && !customer && !customerLoading) {
        await loadCustomer();
      }
      setCurrentStep(currentStep + 1);
    }
  };
  const prevStep = () => {
    setDirection(-1);
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const toggleService = (serviceId: string) => {
    setSelectedServices(prev => {
      const next = new Set(prev);
      if (next.has(serviceId)) {
        next.delete(serviceId);
      } else {
        next.add(serviceId);
      }
      return next;
    });
  };

  const isStepValid = (step: number) => {
    switch (step) {
      case 1: return selectedServices.size > 0;
      case 2: return !!selectedStylist;
      case 3: return !!selectedDate && !!selectedTime;
      case 4: {
        // Kiểm tra customer từ context hoặc từ localStorage
        if (customer) return true;
        if (customerLoading) return false;
        // Kiểm tra localStorage như fallback
        const storedCustomer = getCustomerFromStorage();
        if (storedCustomer) return true;
        // Nếu không có customer và không đang loading, kiểm tra xem user có đăng nhập không
        const currentUser = authUser.getCurrentUser();
        return !!currentUser?.id; // Cho phép tiếp tục nếu đã đăng nhập (sẽ load customer trong handleSubmit)
      }
      default: return false;
    }
  };

  const handleSubmit = async () => {
    if (!siteId || !selectedDate || !selectedTime || selectedServices.size === 0) {
      setError('Vui lòng điền đầy đủ thông tin.');
      return;
    }

    // Nếu đang loading customer, đợi một chút
    if (customerLoading) {
      setError('Đang tải thông tin khách hàng. Vui lòng đợi...');
      return;
    }

    // Lấy customer ID từ context hoặc localStorage
    let customerIdToUse = customer?.id;
    
    // Nếu chưa có trong context, thử lấy từ localStorage
    if (!customerIdToUse) {
      const storedCustomer = getCustomerFromStorage();
      if (storedCustomer?.id) {
        customerIdToUse = storedCustomer.id;
        console.log('Using customer from localStorage:', customerIdToUse);
      }
    }

    // Nếu vẫn chưa có, thử load từ API
    if (!customerIdToUse) {
      const currentUser = authUser.getCurrentUser();
      if (!currentUser?.id) {
        setError('Vui lòng đăng nhập để đặt lịch.');
        return;
      }

      try {
        // Thử load customer trực tiếp từ API để lấy ID ngay lập tức
        const response = await salonApi.get<any>(
          `/Customer/GetDetailByAccountId/${currentUser.id}`
        );
        const customerData = (response.data ?? response) as any;
        
        if (customerData && customerData.id) {
          customerIdToUse = customerData.id;
          // Cập nhật context để lần sau không cần load lại
          await loadCustomer();
        } else {
          setError('Không tìm thấy thông tin khách hàng. Vui lòng liên hệ quản trị viên.');
          return;
        }
      } catch (err: any) {
        console.error('Failed to load customer before booking:', err);
        if (err?.status === 404 || err?.response?.status === 404) {
          setError('Tài khoản của bạn chưa được liên kết với khách hàng. Vui lòng liên hệ quản trị viên.');
        } else {
          setError('Không thể tải thông tin khách hàng. Vui lòng thử lại.');
        }
        return;
      }
    }

    // Đảm bảo có customerId
    if (!customerIdToUse) {
      setError('Không thể xác định thông tin khách hàng. Vui lòng thử lại.');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      // Parse time from format "09:00 SA" or "01:00 CH"
      const timeStr = selectedTime.replace(' SA', '').replace(' CH', '');
      const [hours, minutes] = timeStr.split(':').map(Number);
      let hour24 = hours;
      if (selectedTime.includes('CH')) {
        // Chiều: 01:00 CH = 13:00, 12:00 CH = 12:00
        if (hours !== 12) {
          hour24 = hours + 12;
        }
      } else if (selectedTime.includes('SA')) {
        // Sáng: 12:00 SA = 00:00, các giờ khác giữ nguyên
        if (hours === 12) {
          hour24 = 0;
        }
      }

      const bookingDate = new Date(selectedDate);
      bookingDate.setHours(hour24, minutes, 0, 0);

      // Tạo booking với customerId từ context
      // Backend mong đợi Unix timestamp (seconds) - Int64 format
      const bookingPayload = {
        booking: {
          bookingDate: Math.floor(bookingDate.getTime() / 1000), // Unix timestamp in seconds (Int64)
          siteId,
          customerId: customerIdToUse || customer?.id,
          staffId: selectedStylist?.id || null,
          note: null,
        },
        services: Array.from(selectedServices).map(serviceId => ({
          serviceId,
          quantity: 1,
          note: null,
        })),
      };

      console.log('Submitting booking:', bookingPayload);
      const bookingResponse = await salonApi.post<any>('/Booking', bookingPayload);
      console.log('Booking created successfully:', bookingResponse);
      
      // Success - move to confirmation step
      setCurrentStep(5);
    } catch (err: any) {
      console.error('Failed to create booking:', err);
      const errorMessage = err?.payload?.message || err?.message || err?.payload?.error || 'Không thể tạo đặt lịch. Vui lòng thử lại.';
      setError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };
  
  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? '100%' : '-100%',
      opacity: 0,
    }),
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <div className="flex items-center justify-between">
            <CardTitle className="font-headline text-2xl">
              Bước {currentStep}: {steps[currentStep - 1].title}
            </CardTitle>
            <div className="flex space-x-1">
                {steps.map(step => (
                    <div key={step.id} className={cn("h-2 w-8 rounded-full", currentStep >= step.id ? "bg-primary" : "bg-muted")}></div>
                ))}
            </div>
        </div>
      </CardHeader>
      <CardContent className="relative h-96">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={currentStep}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="absolute w-full p-1"
          >
            {currentStep === 1 && (
              <div className="space-y-4">
                <p className="text-muted-foreground">Chọn dịch vụ bạn muốn đặt.</p>
                <div className="space-y-2 max-h-80 overflow-y-auto">
                  {services.map(service => {
                    const isSelected = selectedServices.has(service.id);
                    return (
                      <div
                        key={service.id}
                        className={cn(
                          "flex items-center space-x-3 p-3 border rounded-lg cursor-pointer transition-colors",
                          isSelected ? "bg-primary/10 border-primary" : "hover:bg-muted"
                        )}
                        onClick={() => toggleService(service.id)}
                      >
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={() => toggleService(service.id)}
                        />
                        <div className="flex-1 flex justify-between items-center">
                          <span className="font-medium">{service.name}</span>
                          <span className="text-muted-foreground ml-4">{formatPrice(service.price)}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
                {selectedServices.size > 0 && (
                  <p className="text-sm text-muted-foreground">
                    Đã chọn {selectedServices.size} dịch vụ
                  </p>
                )}
              </div>
            )}
            
            {currentStep === 2 && (
              <div className="space-y-4">
                 <p className="text-muted-foreground">Chọn nhà tạo mẫu yêu thích của bạn.</p>
                 <Select
                  onValueChange={(id) => setSelectedStylist(stylists.find(s => s.id === id))}
                  defaultValue={selectedStylist?.id}
                >
                  <SelectTrigger className="text-base py-6">
                    <SelectValue placeholder="Chọn một nhà tạo mẫu..." />
                  </SelectTrigger>
                  <SelectContent>
                    {stylists.map(stylist => (
                      <SelectItem key={stylist.id} value={stylist.id} className="py-2">
                        {stylist.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {currentStep === 3 && selectedServices.size > 0 && selectedStylist && (
               <div className="space-y-4">
                <p className="text-muted-foreground">Chọn ngày và giờ cho cuộc hẹn của bạn.</p>
               <Popover>
                 <PopoverTrigger asChild>
                   <Button
                     variant={"outline"}
                     className={cn(
                       "w-full justify-start text-left font-normal text-base py-6",
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
                     onSelect={(date) => {setSelectedDate(date); setSelectedTime(undefined);}}
                     initialFocus
                     disabled={(date) => date < new Date(new Date().setDate(new Date().getDate() - 1))}
                   />
                 </PopoverContent>
               </Popover>

                {selectedDate && (
                  <div className="space-y-4">
                    <p className="text-muted-foreground text-sm">Chọn một thời gian có sẵn:</p>
                    <div className="grid grid-cols-3 gap-2 md:grid-cols-4">
                        {availableTimes.map((time) => (
                        <Button
                            key={time}
                            variant={selectedTime === time ? 'default' : 'outline'}
                            className={cn("text-base justify-center py-6 rounded-lg", selectedTime === time && "shadow-lg")}
                            onClick={() => setSelectedTime(time)}
                        >
                            {time}
                        </Button>
                        ))}
                    </div>
                  </div>
                )}
             </div>
            )}

            {currentStep === 4 && (
                <div className="space-y-4">
                    {customerLoading ? (
                      <>
                        <p className="text-muted-foreground">Đang tải thông tin khách hàng...</p>
                        <div className="p-4 bg-muted rounded-md space-y-2">
                          <p className="text-muted-foreground">Vui lòng đợi...</p>
                        </div>
                      </>
                    ) : customer ? (
                      <>
                        <p className="text-muted-foreground">Thông tin của bạn:</p>
                        <div className="p-4 bg-muted rounded-md space-y-2">
                          <p><strong>Họ và tên:</strong> {customer.name}</p>
                          {customer.email && <p><strong>Email:</strong> {customer.email}</p>}
                          {customer.phone && <p><strong>Số điện thoại:</strong> {customer.phone}</p>}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Thông tin này được lấy từ tài khoản đã đăng nhập. Nếu cần thay đổi, vui lòng cập nhật trong hồ sơ.
                        </p>
                      </>
                    ) : (
                      <>
                        <p className="text-muted-foreground">
                          {authUser.getCurrentUser()?.id 
                            ? 'Đang tải thông tin khách hàng...' 
                            : 'Vui lòng đăng nhập để đặt lịch.'}
                        </p>
                        {authUser.getCurrentUser()?.id ? (
                          <div className="p-4 bg-muted rounded-md space-y-2">
                            <p className="text-muted-foreground">Vui lòng đợi...</p>
                          </div>
                        ) : (
                          <Button asChild>
                            <a href="/login">Đăng nhập</a>
                          </Button>
                        )}
                      </>
                    )}
                </div>
            )}

            {currentStep === 5 && selectedServices.size > 0 && selectedStylist && selectedDate && selectedTime && (
                <div className="text-center space-y-4 flex flex-col items-center">
                    <CheckCircle className="h-16 w-16 text-green-500" />
                    <h2 className="text-2xl font-bold">Lịch hẹn đã được xác nhận!</h2>
                    <p className="text-muted-foreground">Một xác nhận đã được gửi đến email của bạn.</p>
                    <Card className="text-left w-full max-w-sm">
                        <CardContent className="p-4 space-y-2">
                            <div>
                                <strong>Dịch vụ:</strong>
                                <ul className="list-disc list-inside mt-1">
                                  {Array.from(selectedServices).map(serviceId => {
                                    const service = services.find(s => s.id === serviceId);
                                    return service ? (
                                      <li key={serviceId}>{service.name} - {formatPrice(service.price)}</li>
                                    ) : null;
                                  })}
                                </ul>
                            </div>
                            <p><strong>Tổng cộng:</strong> {formatPrice(
                              Array.from(selectedServices).reduce((total, serviceId) => {
                                const service = services.find(s => s.id === serviceId);
                                return total + (service?.price ?? 0);
                              }, 0)
                            )}</p>
                            <p><strong>Nhà tạo mẫu:</strong> {selectedStylist.name}</p>
                            <p><strong>Ngày:</strong> {format(selectedDate, "PPP")}</p>
                            <p><strong>Thời gian:</strong> {selectedTime}</p>
                        </CardContent>
                    </Card>
                </div>
            )}

          </motion.div>
        </AnimatePresence>
        {error && (
          <div className="mt-4 p-3 bg-destructive/10 text-destructive rounded-md text-sm">
            {error}
          </div>
        )}
      </CardContent>
      <div className="flex items-center justify-between border-t p-4">
        <Button variant="outline" onClick={prevStep} disabled={currentStep === 1} className="rounded-full">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Quay lại
        </Button>
        {currentStep < 4 ? (
            <Button onClick={nextStep} disabled={!isStepValid(currentStep)} className="rounded-full">
                Tiếp theo
                <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
        ) : currentStep === 4 ? (
            <Button 
              onClick={handleSubmit} 
              disabled={!isStepValid(currentStep) || submitting} 
              className="rounded-full"
            >
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang xử lý...
                </>
              ) : (
                'Xác nhận Đặt chỗ'
              )}
            </Button>
        ) : (
            <Button asChild className="rounded-full">
                <a href="/">Hoàn tất</a>
            </Button>
        )}
      </div>
    </Card>
  );
}
