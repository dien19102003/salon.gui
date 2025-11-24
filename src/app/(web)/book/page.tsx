import { BookingFlow } from '@/components/booking/booking-flow';
import { services, stylists } from '@/lib/data';

export const metadata = {
  title: 'Book an Appointment | Shear Bliss',
  description: 'Schedule your next visit with our talented stylists.',
};

export default function BookPage({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
  const serviceId = searchParams.service as string | undefined;
  const stylistId = searchParams.stylist as string | undefined;

  return (
    <div className="container py-12 md:py-20">
      <div className="mx-auto max-w-4xl">
        <div className="text-center">
          <h1 className="font-headline text-4xl font-bold md:text-5xl">Book an Appointment</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Follow the steps below to schedule your visit.
          </p>
        </div>
        <div className="mt-12">
          <BookingFlow 
            services={services} 
            stylists={stylists}
            initialServiceId={serviceId}
            initialStylistId={stylistId}
          />
        </div>
      </div>
    </div>
  );
}
