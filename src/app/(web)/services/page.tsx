import Link from 'next/link';
import Image from 'next/image';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { services } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Clock } from 'lucide-react';

export const metadata = {
  title: 'Our Services | Shear Bliss',
  description: 'Explore our wide range of professional hair services.',
};

export default function ServicesPage() {
  return (
    <div className="container py-12 md:py-20">
      <div className="mx-auto mb-12 max-w-2xl text-center">
        <h1 className="font-headline text-4xl font-bold md:text-5xl">Our Services</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Find the perfect treatment to elevate your style and pamper yourself.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => (
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
                 <span>{service.duration} min</span>
                 <span className="text-2xl font-bold text-primary">${service.price}</span>
               </div>
              <Button asChild className="rounded-full">
                <Link href={`/book?service=${service.id}`}>Book Now</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
