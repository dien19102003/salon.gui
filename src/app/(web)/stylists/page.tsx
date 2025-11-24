import Image from 'next/image';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { stylists } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Star, MessageCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

export const metadata = {
  title: 'Our Stylists | Shear Bliss',
  description: 'Meet the talented team of stylists at Shear Bliss.',
};

export default function StylistsPage() {
  return (
    <div className="container py-12 md:py-20">
      <div className="mx-auto mb-12 max-w-2xl text-center">
        <h1 className="font-headline text-4xl font-bold md:text-5xl">Meet Our Stylists</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Our team of passionate and skilled professionals is dedicated to making you look and feel your best.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {stylists.map((stylist) => (
          <Card key={stylist.id} className="flex flex-col overflow-hidden text-center transition-shadow duration-300 hover:shadow-xl">
            <div className="relative h-64 w-full">
              <Image
                src={stylist.image.imageUrl}
                alt={stylist.image.description}
                data-ai-hint={stylist.image.imageHint}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              />
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
               <div className="flex flex-wrap justify-center gap-2">
                {stylist.skills.map(skill => (
                  <Badge key={skill} variant="secondary">{skill}</Badge>
                ))}
              </div>
              <p className="text-muted-foreground mt-4 text-sm">{stylist.bio}</p>
            </CardContent>
            <CardFooter className="flex justify-center p-4">
              <Button asChild className="rounded-full w-full">
                <Link href={`/book?stylist=${stylist.id}`}>Book with {stylist.name.split(' ')[0]}</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
