
'use client';

import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft } from 'lucide-react';
import { stylists, branches, staffGroups } from '@/lib/data';
import { notFound } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function EditStaffPage({ params }: { params: { id: string } }) {
  const stylist = stylists.find(s => s.id === params.id);

  if (!stylist) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button asChild variant="outline" size="icon" className="h-8 w-8">
          <Link href={`/admin/staff/${stylist.id}`}>
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back to Staff Details</span>
          </Link>
        </Button>
        <h1 className="text-xl font-semibold sm:text-2xl">Chỉnh sửa thông tin nhân viên</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Thông tin chi tiết</CardTitle>
          <CardDescription>Chỉnh sửa thông tin cho {stylist.name}.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-1 space-y-4">
               <Avatar className="h-32 w-32 mx-auto">
                    <AvatarImage src={stylist.image.imageUrl} alt={stylist.name} data-ai-hint={stylist.image.imageHint} />
                    <AvatarFallback>{stylist.name.charAt(0)}</AvatarFallback>
                </Avatar>
                 <div className="grid w-full max-w-sm items-center gap-1.5 mx-auto">
                    <Label htmlFor="picture">Thay đổi ảnh đại diện</Label>
                    <Input id="picture" type="file" />
                </div>
            </div>
            <div className="lg:col-span-2 grid gap-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="name">Họ và tên</Label>
                    <Input id="name" defaultValue={stylist.name} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="branch">Chi nhánh</Label>
                    <Select defaultValue={stylist.branchId}>
                        <SelectTrigger>
                            <SelectValue placeholder="Chọn chi nhánh" />
                        </SelectTrigger>
                        <SelectContent>
                            {branches.map(branch => (
                                <SelectItem key={branch.id} value={branch.id}>{branch.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
              </div>
              <div className="space-y-2">
                  <Label htmlFor="group">Nhóm nhân viên</Label>
                  <Select defaultValue={stylist.groupId}>
                      <SelectTrigger>
                          <SelectValue placeholder="Chọn nhóm" />
                      </SelectTrigger>
                      <SelectContent>
                          {staffGroups.map(group => (
                              <SelectItem key={group.id} value={group.id}>{group.name}</SelectItem>
                          ))}
                      </SelectContent>
                  </Select>
              </div>
              <div className="space-y-2">
                  <Label htmlFor="skills">Kỹ năng (phân cách bởi dấu phẩy)</Label>
                  <Input id="skills" defaultValue={stylist.skills.join(', ')} />
              </div>
              <div className="space-y-2">
                  <Label htmlFor="bio">Tiểu sử</Label>
                  <Textarea id="bio" defaultValue={stylist.bio} rows={4} />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" asChild><Link href={`/admin/staff/${stylist.id}`}>Hủy</Link></Button>
                <Button>Lưu thay đổi</Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
