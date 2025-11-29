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
  '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM',
  '11:00 AM', '11:30 AM', '01:00 PM', '01:30 PM',
  '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM',
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
                    <span className="sr-only">Back to Bookings</span>
                </Link>
            </Button>
            <div className="space-y-1">
                <h1 className="text-2xl font-bold">Add New Booking</h1>
                <p className="text-muted-foreground">Create a new appointment for a walk-in or phone customer.</p>
            </div>
        </div>
      <Card>
        <CardHeader>
          <CardTitle>Appointment Details</CardTitle>
          <CardDescription>
            Fill in the details below to create a new booking.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="grid gap-6 lg:grid-cols-2">
            <div className="space-y-6">
                 <div className="space-y-2">
                    <Label htmlFor="customer-name">Customer Name</Label>
                    <Input id="customer-name" placeholder="e.g. John Doe" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="customer-email">Customer Email</Label>
                    <Input id="customer-email" type="email" placeholder="e.g. john@example.com" />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="service">Service</Label>
                    <Select>
                        <SelectTrigger>
                            <SelectValue placeholder="Select a service" />
                        </SelectTrigger>
                        <SelectContent>
                            {services.map(service => (
                                <SelectItem key={service.id} value={service.id}>{service.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="stylist">Stylist</Label>
                    <Select>
                        <SelectTrigger>
                            <SelectValue placeholder="Select a stylist" />
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
                     <Label htmlFor="date">Date</Label>
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
                            {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
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
                    <Label>Time</Label>
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
                 <Button type="submit" className="w-full">Create Booking</Button>
            </div>

          </form>
        </CardContent>
      </Card>
    </div>
  );
}