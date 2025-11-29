import { PlaceHolderImages } from '@/lib/placeholder-images';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star, Scissors, Brush, Sparkles, Droplets } from 'lucide-react';
import { services, reviews } from '@/lib/data';

const categoryIcons = {
  'Cắt tóc': <Scissors className="h-8 w-8 text-primary" />,
  'Nhuộm màu': <Brush className="h-8 w-8 text-primary" />,
  'Tạo kiểu': <Sparkles className="h-8 w-8 text-primary" />,
  'Trị liệu': <Droplets className="h-8 w-8 text-primary" />,
};

const serviceCategories = [...new Map(services.map(s => [s.category, s])).values()];

export default function HomePage() {
  const heroImage = PlaceHolderImages.find(p => p.id === 'hero-banner');
  const introImage1 = PlaceHolderImages.find(p => p.id === 'salon-intro-1');
  const introImage2 = PlaceHolderImages.find(p => p.id === 'salon-intro-2');

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[400px] w-full">
        {heroImage && (
          <Image
            src={heroImage.imageUrl}
            alt={heroImage.description}
            data-ai-hint={heroImage.imageHint}
            fill
            className="object-cover"
            priority
          />
        )}
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 flex h-full flex-col items-center justify-center text-center text-white">
          <h1 className="font-headline text-4xl font-bold md:text-6xl">
            Trải nghiệm Shear Bliss
          </h1>
          <p className="mt-4 max-w-2xl text-lg md:text-xl">
            Nơi vẻ đẹp của bạn là niềm đam mê của chúng tôi. Khám phá nghệ thuật của mái tóc đẹp
            với các nhà tạo mẫu chuyên nghiệp của chúng tôi.
          </p>
          <Button asChild size="lg" className="mt-8 rounded-full shadow-lg">
            <Link href="/book">Đặt lịch hẹn</Link>
          </Button>
        </div>
      </section>

      {/* Service Categories Section */}
      <section className="bg-background py-16 md:py-24">
        <div className="container">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <h2 className="font-headline text-3xl font-bold md:text-4xl">
              Dịch vụ của chúng tôi
            </h2>
            <p className="mt-4 text-muted-foreground">
              Từ những kiểu cắt cổ điển đến những xu hướng mới nhất, chúng tôi cung cấp đầy đủ các dịch vụ
              về tóc.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-8">
            {serviceCategories.map((category) => (
              <Link href="/services" key={category.id}>
                <Card className="transform text-center transition-transform duration-300 hover:-translate-y-2 hover:shadow-xl">
                  <CardContent className="flex flex-col items-center justify-center p-6">
                    {categoryIcons[category.category]}
                    <h3 className="mt-4 font-semibold">{category.category}</h3>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Salon Intro Section */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="grid items-center gap-12 md:grid-cols-2">
            <div className="space-y-4">
              <h2 className="font-headline text-3xl font-bold md:text-4xl">
                Chào mừng đến với Salon của chúng tôi
              </h2>
              <p className="text-muted-foreground">
                Shear Bliss được thành lập dựa trên ý tưởng rằng cắt tóc phải là một
                trải nghiệm, không phải là một công việc vặt. Chúng tôi đã tạo ra một môi trường thư giãn và sang trọng, nơi bạn có thể thư giãn trong khi đội ngũ tài năng của chúng tôi
                làm nên điều kỳ diệu.
              </p>
              <p className="text-muted-foreground">
                Chúng tôi cam kết sử dụng các sản phẩm chất lượng cao và luôn cập nhật những kỹ thuật mới nhất để mang đến cho bạn những gì tốt nhất trong việc chăm sóc tóc.
              </p>
              <Button asChild variant="outline" className="rounded-full">
                <Link href="/stylists">Gặp gỡ các nhà tạo mẫu của chúng tôi</Link>
              </Button>
            </div>
            <div className="relative h-[500px] w-full">
                {introImage1 && (
                    <div className="absolute left-0 top-0 h-3/4 w-3/5 overflow-hidden rounded-lg shadow-xl">
                        <Image src={introImage1.imageUrl} alt={introImage1.description} data-ai-hint={introImage1.imageHint} fill className="object-cover"/>
                    </div>
                )}
                {introImage2 && (
                    <div className="absolute bottom-0 right-0 h-3/4 w-3/5 overflow-hidden rounded-lg border-4 border-background shadow-2xl">
                        <Image src={introImage2.imageUrl} alt={introImage2.description} data-ai-hint={introImage2.imageHint} fill className="object-cover"/>
                    </div>
                )}
            </div>
          </div>
        </div>
      </section>

      {/* Customer Reviews Section */}
      <section className="bg-background py-16 md:py-24">
        <div className="container">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <h2 className="font-headline text-3xl font-bold md:text-4xl">
              Khách hàng nói gì về chúng tôi
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {reviews.map((review) => (
              <Card key={review.id}>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${
                          i < review.rating
                            ? 'fill-accent text-accent'
                            : 'fill-muted text-muted-foreground'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="mt-4 text-muted-foreground">"{review.text}"</p>
                  <div className="mt-4 flex items-center">
                    <Avatar className="h-10 w-10">
                      <AvatarImage
                        src={`https://picsum.photos/seed/${review.name.replace(/\s/g, '')}/40/40`}
                        alt={review.name}
                        data-ai-hint="person"
                      />
                      <AvatarFallback>{review.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="ml-4">
                      <p className="font-semibold">{review.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Khách hàng {review.service}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
