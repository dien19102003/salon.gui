'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { BookingFlow } from '@/components/booking/booking-flow';
import { useSite } from '@/context/site-branch-context';
import { salonApi } from '@/lib/api-client';
import { Skeleton } from '@/components/ui/skeleton';

type Service = {
  id: string;
  name: string;
  price: number;
  duration?: number; // in minutes
  description?: string;
  image?: {
    imageUrl?: string;
    description?: string;
    imageHint?: string;
  };
};

type Stylist = {
  id: string;
  name: string;
  image?: {
    imageUrl?: string;
    description?: string;
    imageHint?: string;
  };
};

export default function BookPage() {
  const searchParams = useSearchParams();
  const serviceId = searchParams.get('service') ?? undefined;
  const stylistId = searchParams.get('stylist') ?? undefined;
  const { selectedSiteId } = useSite();
  
  const [services, setServices] = useState<Service[]>([]);
  const [stylists, setStylists] = useState<Stylist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load services
  useEffect(() => {
    const loadServices = async () => {
      if (!selectedSiteId) {
        setServices([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const filter: any = {
          page: 1,
          size: 100,
          status: 1, // StatusFilters.ActiveOnly - chỉ lấy dịch vụ đang hoạt động
          siteId: selectedSiteId, // Filter theo chi nhánh (Guid? - không phải BaseMultipleFilterAdminDto)
          state: {
            method: 'Or',
            values: [1], // ServiceStates.Active = 1
          },
        };

        const response = await salonApi.post<any>('/Service/GetPage', filter);
        const servicesData = (response.data ?? []) as any[];

        // Lấy tất cả giá dịch vụ cho chi nhánh này
        let pricesMap = new Map<string, number>();
        try {
          const priceFilter: any = {
            page: 1,
            size: 1000,
            status: 1, // Active only
            siteId: {
              method: 'Or',
              values: [selectedSiteId],
            },
            state: {
              method: 'Or',
              values: [1], // SiteServicePriceStates.Active = 1
            },
          };
          const priceResponse = await salonApi.post<any>('/SiteServicePrice/GetPage', priceFilter);
          const pricesData = (priceResponse.data ?? []) as any[];
          pricesData.forEach((priceItem: any) => {
            if (priceItem.serviceId && priceItem.price) {
              pricesMap.set(priceItem.serviceId, priceItem.price);
            }
          });
        } catch (err) {
          console.warn('Could not load service prices:', err);
        }

        // Map dữ liệu từ API về format Service
        const mappedServices: Service[] = servicesData.map((service: any) => {
          const price = pricesMap.get(service.id) ?? 0;

          return {
            id: service.id,
            name: service.name,
            price,
            duration: service.estimatedTime,
            description: service.description,
            image: service.imageUrl
              ? {
                  imageUrl: service.imageUrl,
                  description: service.name,
                  imageHint: service.name,
                }
              : undefined,
          };
        });

        setServices(mappedServices);
      } catch (err) {
        console.error('Failed to load services:', err);
        setError('Không thể tải danh sách dịch vụ. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };

    loadServices();
  }, [selectedSiteId]);

  // Load stylists
  useEffect(() => {
    const loadStylists = async () => {
      if (!selectedSiteId) {
        setStylists([]);
        return;
      }

      try {
        const filter: any = {
          page: 1,
          size: 100,
          status: 1, // Active only
          siteId: {
            method: 'Or',
            values: [selectedSiteId],
          },
        };

        const response = await salonApi.post<any>('/Staff/GetPage', filter);
        const staffData = (response.data ?? []) as any[];

        const mappedStylists: Stylist[] = staffData.map((staff: any) => ({
          id: staff.id,
          name: staff.name,
          image: staff.account?.avatarLink
            ? {
                imageUrl: staff.account.avatarLink,
                description: staff.name,
                imageHint: staff.name,
              }
            : undefined,
        }));

        setStylists(mappedStylists);
      } catch (err) {
        console.error('Failed to load stylists:', err);
        // Không set error vì stylists là optional
      }
    };

    loadStylists();
  }, [selectedSiteId]);

  if (loading) {
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
            <Skeleton className="h-96 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-12 md:py-20">
        <div className="mx-auto max-w-4xl">
          <div className="text-center">
            <h1 className="font-headline text-4xl font-bold md:text-5xl">Đặt lịch hẹn</h1>
            <p className="mt-4 text-lg text-destructive">{error}</p>
            {!selectedSiteId && (
              <p className="mt-2 text-sm text-muted-foreground">
                Vui lòng chọn chi nhánh từ dropdown ở header để xem danh sách dịch vụ.
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (!selectedSiteId) {
    return (
      <div className="container py-12 md:py-20">
        <div className="mx-auto max-w-4xl">
          <div className="text-center">
            <h1 className="font-headline text-4xl font-bold md:text-5xl">Đặt lịch hẹn</h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Vui lòng chọn chi nhánh từ dropdown ở header để bắt đầu đặt lịch.
            </p>
          </div>
        </div>
      </div>
    );
  }

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
            siteId={selectedSiteId}
            initialServiceId={serviceId}
            initialStylistId={stylistId}
          />
        </div>
      </div>
    </div>
  );
}
