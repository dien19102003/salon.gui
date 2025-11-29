
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
import { branches, staffGroups } from '@/lib/data';

export default function NewStaffPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button asChild variant="outline" size="icon" className="h-8 w-8">
          <Link href="/admin/staff">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back to Staff</span>
          </Link>
        </Button>
        <h1 className="text-xl font-semibold sm:text-2xl">Thêm nhân viên mới</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Thông tin nhân viên</CardTitle>
          <CardDescription>Điền thông tin chi tiết để tạo nhân viên mới.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-1 space-y-4">
                 <div className="grid w-full max-w-sm items-center gap-1.5 mx-auto text-center">
                    <Label htmlFor="picture">Ảnh đại diện</Label>
                    <Input id="picture" type="file" />
                </div>
            </div>
            <div className="lg:col-span-2 grid gap-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="name">Họ và tên</Label>
                    <Input id="name" placeholder="Ví dụ: Nguyễn Văn A" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="branch">Chi nhánh</Label>
                    <Select>
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
                  <Select>
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
                  <Input id="skills" placeholder="Ví dụ: Cắt tóc, Nhuộm, Duỗi" />
              </div>
              <div className="space-y-2">
                  <Label htmlFor="bio">Tiểu sử</Label>
                  <Textarea id="bio" placeholder="Mô tả ngắn về kinh nghiệm và chuyên môn." rows={4} />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" asChild><Link href="/admin/staff">Hủy</Link></Button>
                <Button>Tạo nhân viên</Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
