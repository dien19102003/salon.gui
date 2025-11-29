import { BookingFlow } from '@/components/booking/booking-flow';
import { services, stylists } from '@/lib/data';

export const metadata = {
  title: 'Đặt lịch hẹn | Eggstech Salon',
  description: 'Lên lịch cho lần ghé thăm tiếp theo của bạn với các nhà tạo mẫu tài năng của chúng tôi.',
};

export default function BookPage({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
  const serviceId = searchParams.service as string | undefined;
  const stylistId = searchParams.stylist as string | undefined;

  return (
    <div className="container py-12 md:py-20">
      <div className="mx-auto max-w-4xl">
        <div className="text-center">
          <h1 className="font-headline text-4xl font-bold md:text-5xl">Đặt lịch hẹn</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Thực hiện theo các bước dưới đây để lên lịch cho chuyến thăm của bạn.
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
