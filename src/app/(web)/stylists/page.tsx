
'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star, MessageCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { useSite } from '@/context/site-branch-context';
import { salonApi } from '@/lib/api-client';
import { Skeleton } from '@/components/ui/skeleton';

type Stylist = {
  id: string;
  name: string;
  skills: string[];
  rating: number;
  reviews: number;
  image: {
    imageUrl: string;
    description?: string;
    imageHint?: string;
  };
  bio: string;
  branchId?: string;
};

// export const metadata = {
//   title: 'Các nhà tạo mẫu của chúng tôi | Shear Bliss',
//   description: 'Gặp gỡ đội ngũ nhà tạo mẫu tài năng tại Shear Bliss.',
// };

export default function StylistsPage() {
  const { selectedSiteId } = useSite();
  const [stylists, setStylists] = useState<Stylist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadStylists = async () => {
      try {
        setLoading(true);
        setError(null);

        const filter: any = {
          page: 1,
          size: 100, // Load tất cả nhân viên
          status: 1, // StatusFilters.ActiveOnly - chỉ lấy nhân viên đang hoạt động
        };

        // Nếu có selectedSiteId, thêm filter SiteId
        if (selectedSiteId) {
          filter.siteId = {
            method: 'Or',
            values: [selectedSiteId],
          };
        }

        const response = await salonApi.post<any>('/Staff/GetPage', filter);
        const staffData = (response.data ?? []) as any[];

        // Map dữ liệu từ API về format Stylist
        const mappedStylists: Stylist[] = staffData.map((staff: any) => ({
          id: staff.id,
          name: staff.name,
          skills: [], // API không có skills, có thể lấy từ StaffGroup hoặc để trống
          rating: 4.5, // Default rating, có thể lấy từ API sau
          reviews: 0, // Default reviews, có thể lấy từ API sau
          image: staff.account?.avatarLink
            ? {
                imageUrl: staff.account.avatarLink,
                description: staff.name,
                imageHint: staff.name,
              }
            : {
                imageUrl: '/placeholder-stylist.jpg', // Placeholder image
                description: staff.name,
                imageHint: staff.name,
              },
          bio: staff.note || `Chuyên nghiệp và tận tâm phục vụ khách hàng.`,
          branchId: staff.sites?.[0]?.id || selectedSiteId || undefined,
        }));

        setStylists(mappedStylists);
      } catch (err) {
        console.error('Failed to load stylists:', err);
        setError('Không thể tải danh sách nhà tạo mẫu. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };

    loadStylists();
  }, [selectedSiteId]);


  if (loading) {
    return (
      <div className="container py-12 md:py-20">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <h1 className="font-headline text-4xl font-bold md:text-5xl">Gặp gỡ các nhà tạo mẫu của chúng tôi</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Đội ngũ chuyên gia đầy nhiệt huyết và kỹ năng của chúng tôi luôn tận tâm để bạn trông và cảm thấy tốt nhất.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="flex flex-col overflow-hidden">
              <Skeleton className="h-64 w-full" />
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2 mt-2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-2/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-12 md:py-20">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <h1 className="font-headline text-4xl font-bold md:text-5xl">Gặp gỡ các nhà tạo mẫu của chúng tôi</h1>
          <p className="mt-4 text-lg text-destructive">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-12 md:py-20">
      <div className="mx-auto mb-12 max-w-2xl text-center">
        <h1 className="font-headline text-4xl font-bold md:text-5xl">Gặp gỡ các nhà tạo mẫu của chúng tôi</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Đội ngũ chuyên gia đầy nhiệt huyết và kỹ năng của chúng tôi luôn tận tâm để bạn trông và cảm thấy tốt nhất.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {stylists.map((stylist) => (
          <Card key={stylist.id} className="flex flex-col overflow-hidden text-center transition-shadow duration-300 hover:shadow-xl">
            <div className="relative h-64 w-full">
              {stylist.image.imageUrl ? (
                <Image
                  src={stylist.image.imageUrl}
                  alt={stylist.image.description || stylist.name}
                  data-ai-hint={stylist.image.imageHint || stylist.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
              ) : (
                <div className="h-full w-full bg-muted flex items-center justify-center text-muted-foreground">
                  {stylist.name.charAt(0)}
                </div>
              )}
            </div>
            <CardHeader>
              <CardTitle className="font-headline text-xl">{stylist.name}</CardTitle>
              <CardDescription className="flex justify-center items-center gap-4">
                <span className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-accent fill-accent" /> {stylist.rating.toFixed(1)}
                </span>
                <span className="flex items-center gap-1">
                  <MessageCircle className="h-4 w-4 text-muted-foreground" /> {stylist.reviews}
                </span>
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
               {stylist.skills.length > 0 && (
                <div className="flex flex-wrap justify-center gap-2">
                  {stylist.skills.map(skill => (
                    <Badge key={skill} variant="secondary">{skill}</Badge>
                  ))}
                </div>
              )}
              <p className="text-muted-foreground mt-4 text-sm">{stylist.bio}</p>
            </CardContent>
            <CardFooter className="flex justify-center p-4">
              <Button asChild className="rounded-full w-full">
                <Link href={`/book?stylist=${stylist.id}`}>Đặt lịch với {stylist.name.split(' ')[0]}</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
         {stylists.length === 0 && (
          <div className="sm:col-span-2 lg:col-span-4 text-center py-16">
            <p className="text-muted-foreground">
              {selectedSiteId 
                ? 'Không có nhà tạo mẫu nào tại chi nhánh đã chọn.' 
                : 'Vui lòng chọn chi nhánh để xem danh sách nhà tạo mẫu.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
