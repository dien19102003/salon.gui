import { PlaceHolderImages } from '@/lib/placeholder-images';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Clock, MapPin, Phone, Mail } from 'lucide-react';

export const metadata = {
  title: 'Contact Us | Shear Bliss',
  description: 'Get in touch with Shear Bliss. Find our location, hours, and contact details.',
};

export default function ContactPage() {
  const mapImage = PlaceHolderImages.find((img) => img.id === 'contact-map');

  return (
    <div className="container py-12 md:py-20">
      <div className="mx-auto mb-12 max-w-2xl text-center">
        <h1 className="font-headline text-4xl font-bold md:text-5xl">Contact Us</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          We'd love to hear from you. Reach out with any questions or to book your next appointment.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
        {/* Contact Info and Hours */}
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-6 w-6 text-primary" /> Salon Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>123 Beauty Lane, Glamour City, 12345</p>
              <p className="flex items-center gap-2">
                <Phone className="h-4 w-4" /> (123) 456-7890
              </p>
              <p className="flex items-center gap-2">
                <Mail className="h-4 w-4" /> contact@shearbliss.com
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-6 w-6 text-primary" /> Opening Hours
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-muted-foreground">
              <div className="flex justify-between"><span>Tuesday - Friday</span><span>9:00 AM - 7:00 PM</span></div>
              <div className="flex justify-between"><span>Saturday</span><span>9:00 AM - 5:00 PM</span></div>
              <div className="flex justify-between"><span>Sunday - Monday</span><span>Closed</span></div>
            </CardContent>
          </Card>
          
          {mapImage && (
            <div className="relative h-64 w-full overflow-hidden rounded-lg shadow-md">
              <Image
                src={mapImage.imageUrl}
                alt={mapImage.description}
                data-ai-hint={mapImage.imageHint}
                fill
                className="object-cover"
              />
            </div>
          )}
        </div>

        {/* Contact Form */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Send us a Message</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Input placeholder="Your Name" />
                  <Input type="email" placeholder="Your Email" />
                </div>
                <Input placeholder="Subject" />
                <Textarea placeholder="Your Message" rows={5} />
                <Button type="submit" className="w-full rounded-full">Send Message</Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
