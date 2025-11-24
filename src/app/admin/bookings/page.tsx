import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { bookings } from '@/lib/data';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, PlusCircle } from 'lucide-react';

export const metadata = {
  title: 'Booking Management | Shear Bliss Admin',
  description: 'Manage all bookings.',
};

function BookingTable({ bookings }: { bookings: typeof import('@/lib/data').bookings }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Booking ID</TableHead>
          <TableHead>Customer</TableHead>
          <TableHead>Stylist</TableHead>
          <TableHead>Service</TableHead>
          <TableHead>Date & Time</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Price</TableHead>
          <TableHead><span className="sr-only">Actions</span></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {bookings.map((booking) => (
          <TableRow key={booking.id}>
            <TableCell className="font-medium">{booking.id}</TableCell>
            <TableCell>{booking.customerName}</TableCell>
            <TableCell>{booking.stylistName}</TableCell>
            <TableCell>{booking.serviceName}</TableCell>
            <TableCell>{new Date(booking.date).toLocaleDateString()} at {booking.time}</TableCell>
            <TableCell>
              <Badge
                variant="outline"
                className={cn({
                  'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300 border-green-300': booking.status === 'Confirmed' || booking.status === 'Completed',
                  'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300 border-yellow-300': booking.status === 'Pending',
                  'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300 border-red-300': booking.status === 'Cancelled',
                })}
              >
                {booking.status}
              </Badge>
            </TableCell>
            <TableCell className="text-right">${booking.price}</TableCell>
            <TableCell>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem>View Details</DropdownMenuItem>
                    <DropdownMenuItem>Edit</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-destructive">Cancel Booking</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export default function BookingsPage() {
  return (
    <Tabs defaultValue="all">
        <div className="flex items-center">
            <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="confirmed">Confirmed</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
                <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
            </TabsList>
             <div className="ml-auto flex items-center gap-2">
                <Button size="sm" variant="outline">Export</Button>
                <Button size="sm">
                    <PlusCircle className="h-4 w-4 mr-2"/>
                    Add Booking
                </Button>
             </div>
        </div>
      <TabsContent value="all">
        <Card>
          <CardHeader>
            <CardTitle>All Bookings</CardTitle>
            <CardDescription>A complete list of all appointments.</CardDescription>
          </CardHeader>
          <CardContent>
            <BookingTable bookings={bookings} />
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="pending">
        <Card>
          <CardHeader>
            <CardTitle>Pending Bookings</CardTitle>
            <CardDescription>These bookings require confirmation.</CardDescription>
          </CardHeader>
          <CardContent>
            <BookingTable bookings={bookings.filter(b => b.status === 'Pending')} />
          </CardContent>
        </Card>
      </TabsContent>
      {/* Add more TabsContent for other statuses */}
    </Tabs>
  );
}
