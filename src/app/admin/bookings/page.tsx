'use client';

import * as React from 'react';
import {
  add,
  eachDayOfInterval,
  endOfMonth,
  format,
  getDay,
  isEqual,
  isSameDay,
  isSameMonth,
  isToday,
  parse,
  parseISO,
  startOfToday,
} from 'date-fns';
import { ChevronLeft, ChevronRight, PlusCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { bookings as staticBookings } from '@/lib/data';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

function BookingCalendar() {
  let today = startOfToday();
  let [selectedDay, setSelectedDay] = React.useState(today);
  let [currentMonth, setCurrentMonth] = React.useState(format(today, 'MMM-yyyy'));
  let firstDayCurrentMonth = parse(currentMonth, 'MMM-yyyy', new Date());

  let days = eachDayOfInterval({
    start: firstDayCurrentMonth,
    end: endOfMonth(firstDayCurrentMonth),
  });

  function previousMonth() {
    let firstDayNextMonth = add(firstDayCurrentMonth, { months: -1 });
    setCurrentMonth(format(firstDayNextMonth, 'MMM-yyyy'));
  }

  function nextMonth() {
    let firstDayNextMonth = add(firstDayCurrentMonth, { months: 1 });
    setCurrentMonth(format(firstDayNextMonth, 'MMM-yyyy'));
  }

  let selectedDayBookings = staticBookings.filter((booking) =>
    isSameDay(parseISO(booking.date), selectedDay)
  );

  return (
    <div className="bg-card p-4 sm:p-6 rounded-lg shadow-sm">
      <div className="md:grid md:grid-cols-2 md:divide-x md:divide-border">
        <div className="md:pr-8">
          <div className="flex items-center">
            <h2 className="flex-auto font-semibold text-card-foreground">
              {format(firstDayCurrentMonth, 'MMMM yyyy')}
            </h2>
            <button
              type="button"
              onClick={previousMonth}
              className="-my-1.5 flex flex-none items-center justify-center p-1.5 text-muted-foreground hover:text-card-foreground"
            >
              <span className="sr-only">Previous month</span>
              <ChevronLeft className="w-5 h-5" aria-hidden="true" />
            </button>
            <button
              onClick={nextMonth}
              type="button"
              className="-my-1.5 -mr-1.5 ml-2 flex flex-none items-center justify-center p-1.5 text-muted-foreground hover:text-card-foreground"
            >
              <span className="sr-only">Next month</span>
              <ChevronRight className="w-5 h-5" aria-hidden="true" />
            </button>
          </div>
          <div className="grid grid-cols-7 mt-10 text-xs leading-6 text-center text-muted-foreground">
            <div>S</div>
            <div>M</div>
            <div>T</div>
            <div>W</div>
            <div>T</div>
            <div>F</div>
            <div>S</div>
          </div>
          <div className="grid grid-cols-7 mt-2 text-sm">
            {days.map((day, dayIdx) => (
              <div
                key={day.toString()}
                className={cn(
                  dayIdx === 0 && colStartClasses[getDay(day)],
                  'py-1.5'
                )}
              >
                <button
                  type="button"
                  onClick={() => setSelectedDay(day)}
                  className={cn(
                    isEqual(day, selectedDay) && 'text-white',
                    !isEqual(day, selectedDay) &&
                      isToday(day) &&
                      'text-primary',
                    !isEqual(day, selectedDay) &&
                      !isToday(day) &&
                      isSameMonth(day, firstDayCurrentMonth) &&
                      'text-card-foreground',
                    !isEqual(day, selectedDay) &&
                      !isToday(day) &&
                      !isSameMonth(day, firstDayCurrentMonth) &&
                      'text-muted-foreground',
                    isEqual(day, selectedDay) && isToday(day) && 'bg-primary',
                    isEqual(day, selectedDay) &&
                      !isToday(day) &&
                      'bg-primary/80',
                    !isEqual(day, selectedDay) && 'hover:bg-muted',
                    (isEqual(day, selectedDay) || isToday(day)) &&
                      'font-semibold',
                    'mx-auto flex h-8 w-8 items-center justify-center rounded-full'
                  )}
                >
                  <time dateTime={format(day, 'yyyy-MM-dd')}>
                    {format(day, 'd')}
                  </time>
                </button>

                <div className="w-1 h-1 mx-auto mt-1">
                  {staticBookings.some((booking) =>
                    isSameDay(parseISO(booking.date), day)
                  ) && (
                    <div className="w-1 h-1 rounded-full bg-sky-500"></div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
        <section className="mt-12 md:mt-0 md:pl-8">
            <div className="flex items-center justify-between">
                <h2 className="font-semibold text-card-foreground">
                    Schedule for{' '}
                    <time dateTime={format(selectedDay, 'yyyy-MM-dd')}>
                    {format(selectedDay, 'MMM dd, yyy')}
                    </time>
                </h2>
                <Dialog>
                    <DialogTrigger asChild>
                        <Button size="sm">
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Add Booking
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                        <DialogTitle>Add New Booking</DialogTitle>
                        </DialogHeader>
                        {/* Add booking form here */}
                    </DialogContent>
                </Dialog>
          </div>
          <ol className="mt-4 space-y-1 text-sm leading-6 text-muted-foreground">
            {selectedDayBookings.length > 0 ? (
              selectedDayBookings.map((booking) => (
                <Booking booking={booking} key={booking.id} />
              ))
            ) : (
              <p>No bookings for today.</p>
            )}
          </ol>
        </section>
      </div>
    </div>
  );
}

function Booking({ booking }: { booking: typeof staticBookings[0] }) {
  return (
    <li className="flex items-center px-4 py-2 space-x-4 group rounded-xl focus-within:bg-muted hover:bg-muted">
      <div className="flex-auto">
        <p className="text-card-foreground font-medium">{booking.serviceName}</p>
        <p className="flex items-center gap-2">
            <time dateTime={booking.date}>{booking.time}</time>
            <span>·</span>
            <span>{booking.customerName}</span>
        </p>
         <p className="text-xs text-muted-foreground">{booking.stylistName}</p>
      </div>
      <Badge
        variant="outline"
        className={cn({
            'bg-green-100 text-green-700 border-green-200': booking.status === 'Confirmed' || booking.status === 'Completed',
            'bg-yellow-100 text-yellow-700 border-yellow-200': booking.status === 'Pending',
            'bg-red-100 text-red-700 border-red-200': booking.status === 'Cancelled',
        }, 'font-medium py-1')}
        >
        {booking.status}
      </Badge>
    </li>
  );
}

let colStartClasses = [
  '',
  'col-start-2',
  'col-start-3',
  'col-start-4',
  'col-start-5',
  'col-start-6',
  'col-start-7',
];

export default BookingCalendar;
