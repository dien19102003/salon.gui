
'use client';

import Link from 'next/link';
import Image from 'next/image';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { services as allServices } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Clock } from 'lucide-react';
import { useBranch } from '@/context/site-branch-context';
import { useMemo } from 'react';

// export const metadata = {
//   title: 'Dịch vụ của chúng tôi | Shear Bliss',
//   description: 'Khám phá loạt dịch vụ tóc chuyên nghiệp của chúng tôi.',
// };

export default function ServicesPage() {
  const { selectedBranch } = useBranch();

  const filteredServices = useMemo(() => {
    if (selectedBranch === 'all') {
      return allServices;
    }
    return allServices.filter(service => {
      // Dịch vụ có sẵn nếu không có giá chi nhánh cụ thể (có sẵn ở mọi nơi)
      if (service.branchPricing.length === 0) {
        return true;
      }
      // Hoặc nếu có giá hoạt động cho chi nhánh đã chọn
      return service.branchPricing.some(p => p.branchId === selectedBranch && p.status === 'Active');
    });
  }, [selectedBranch]);

  const getPriceForBranch = (service) => {
    if (selectedBranch === 'all') {
      return service.price; // Hiển thị giá mặc định
    }
    const branchPrice = service.branchPricing.find(p => p.branchId === selectedBranch);
    return branchPrice ? branchPrice.price : service.price;
  };


  return (
    <div className="container py-12 md:py-20">
      <div className="mx-auto mb-12 max-w-2xl text-center">
        <h1 className="font-headline text-4xl font-bold md:text-5xl">Dịch vụ của chúng tôi</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Tìm phương pháp điều trị hoàn hảo để nâng tầm phong cách và nuông chiều bản thân.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {filteredServices.map((service) => (
          <Card key={service.id} className="flex flex-col overflow-hidden transition-shadow duration-300 hover:shadow-xl">
            <div className="relative h-60 w-full">
              <Image
                src={service.image.imageUrl}
                alt={service.image.description}
                data-ai-hint={service.image.imageHint}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
            </div>
            <CardHeader>
              <CardTitle className="font-headline text-xl">{service.name}</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-muted-foreground">{service.description}</p>
            </CardContent>
            <CardFooter className="flex justify-between items-center border-t p-4">
               <div className="flex items-center gap-2 text-muted-foreground">
                 <Clock className="h-4 w-4" />
                 <span>{service.duration} phút</span>
                 <span className="text-2xl font-bold text-primary">${getPriceForBranch(service)}</span>
               </div>
              <Button asChild className="rounded-full">
                <Link href={`/book?service=${service.id}`}>Đặt ngay</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
         {filteredServices.length === 0 && (
          <div className="sm:col-span-2 lg:col-span-3 text-center py-16">
            <p className="text-muted-foreground">Không có dịch vụ nào cho chi nhánh đã chọn.</p>
          </div>
        )}
      </div>
    </div>
  );
}
