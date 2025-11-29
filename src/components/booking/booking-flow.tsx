'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, CheckCircle, ArrowRight, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Service, Stylist } from '@/lib/data';

interface BookingFlowProps {
  services: Service[];
  stylists: Stylist[];
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


export function BookingFlow({ services, stylists, initialServiceId, initialStylistId }: BookingFlowProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [direction, setDirection] = useState(1);

  const [selectedService, setSelectedService] = useState<Service | undefined>(
    services.find(s => s.id === initialServiceId)
  );
  const [selectedStylist, setSelectedStylist] = useState<Stylist | undefined>(
    stylists.find(s => s.id === initialStylistId)
  );
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = useState<string | undefined>();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const nextStep = () => {
    setDirection(1);
    if (currentStep < 5) setCurrentStep(currentStep + 1);
  };
  const prevStep = () => {
    setDirection(-1);
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const isStepValid = (step: number) => {
    switch (step) {
      case 1: return !!selectedService;
      case 2: return !!selectedStylist;
      case 3: return !!selectedDate && !!selectedTime;
      case 4: return name !== '' && email !== '' && phone !== '';
      default: return false;
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
                <Select
                  onValueChange={(id) => setSelectedService(services.find(s => s.id === id))}
                  defaultValue={selectedService?.id}
                >
                  <SelectTrigger className="text-base py-6">
                    <SelectValue placeholder="Chọn một dịch vụ..." />
                  </SelectTrigger>
                  <SelectContent>
                    {services.map(service => (
                      <SelectItem key={service.id} value={service.id} className="py-2">
                        <div className="flex justify-between w-full">
                          <span>{service.name}</span>
                          <span className="text-muted-foreground">${service.price}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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

            {currentStep === 3 && selectedService && selectedStylist && (
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
                    <p className="text-muted-foreground">Vui lòng cung cấp thông tin liên hệ của bạn.</p>
                    <div>
                        <Label htmlFor="name">Họ và tên</Label>
                        <Input id="name" value={name} onChange={e => setName(e.target.value)} placeholder="John Doe" />
                    </div>
                    <div>
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="john.doe@example.com" />
                    </div>
                     <div>
                        <Label htmlFor="phone">Số điện thoại</Label>
                        <Input id="phone" type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="(123) 456-7890" />
                    </div>
                </div>
            )}

            {currentStep === 5 && selectedService && selectedStylist && selectedDate && selectedTime && (
                <div className="text-center space-y-4 flex flex-col items-center">
                    <CheckCircle className="h-16 w-16 text-green-500" />
                    <h2 className="text-2xl font-bold">Lịch hẹn đã được xác nhận!</h2>
                    <p className="text-muted-foreground">Một xác nhận đã được gửi đến email của bạn.</p>
                    <Card className="text-left w-full max-w-sm">
                        <CardContent className="p-4 space-y-2">
                            <p><strong>Dịch vụ:</strong> {selectedService.name}</p>
                            <p><strong>Nhà tạo mẫu:</strong> {selectedStylist.name}</p>
                            <p><strong>Ngày:</strong> {format(selectedDate, "PPP")}</p>
                            <p><strong>Thời gian:</strong> {selectedTime}</p>
                            <p><strong>Giá:</strong> ${selectedService.price}</p>
                        </CardContent>
                    </Card>
                </div>
            )}

          </motion.div>
        </AnimatePresence>
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
            <Button onClick={nextStep} disabled={!isStepValid(currentStep)} className="rounded-full">
                Xác nhận Đặt chỗ
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
