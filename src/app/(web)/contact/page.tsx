import { PlaceHolderImages } from '@/lib/placeholder-images';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Clock, MapPin, Phone, Mail } from 'lucide-react';

export const metadata = {
  title: 'Liên hệ | Shear Bliss',
  description: 'Liên lạc với Shear Bliss. Tìm vị trí, giờ làm việc và chi tiết liên hệ của chúng tôi.',
};

export default function ContactPage() {
  const mapImage = PlaceHolderImages.find((img) => img.id === 'contact-map');

  return (
    <div className="container py-12 md:py-20">
      <div className="mx-auto mb-12 max-w-2xl text-center">
        <h1 className="font-headline text-4xl font-bold md:text-5xl">Liên hệ chúng tôi</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Chúng tôi rất muốn nghe từ bạn. Hãy liên hệ với bất kỳ câu hỏi nào hoặc để đặt lịch hẹn tiếp theo của bạn.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
        {/* Contact Info and Hours */}
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-6 w-6 text-primary" /> Thông tin Salon
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>123 Đường Sắc Đẹp, Thành phố Glamour, 12345</p>
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
                <Clock className="h-6 w-6 text-primary" /> Giờ mở cửa
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-muted-foreground">
              <div className="flex justify-between"><span>Thứ Ba - Thứ Sáu</span><span>9:00 SA - 7:00 CH</span></div>
              <div className="flex justify-between"><span>Thứ Bảy</span><span>9:00 SA - 5:00 CH</span></div>
              <div className="flex justify-between"><span>Chủ Nhật - Thứ Hai</span><span>Đóng cửa</span></div>
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
              <CardTitle>Gửi tin nhắn cho chúng tôi</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Input placeholder="Tên của bạn" />
                  <Input type="email" placeholder="Email của bạn" />
                </div>
                <Input placeholder="Chủ đề" />
                <Textarea placeholder="Tin nhắn của bạn" rows={5} />
                <Button type="submit" className="w-full rounded-full">Gửi tin nhắn</Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
