
'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { staffGroups, services, stylists } from '@/lib/data';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Edit, Users, Scissors } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function StaffGroupDetailPage({ params }: { params: { id: string } }) {
  const group = staffGroups.find(g => g.id === params.id);

  if (!group) {
    notFound();
  }
  
  const groupServices = services.filter(s => group.serviceIds.includes(s.id));
  const groupMembers = stylists.filter(s => s.groupId === group.id);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button asChild variant="outline" size="icon" className="h-8 w-8">
            <Link href="/admin/staff-groups">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back to Staff Groups</span>
            </Link>
          </Button>
          <h1 className="text-xl font-semibold sm:text-2xl">Chi tiết nhóm nhân viên</h1>
        </div>
        <Button asChild>
          <Link href={`/admin/staff-groups/${group.id}/edit`}>
            <Edit className="mr-2 h-4 w-4" />
            Chỉnh sửa
          </Link>
        </Button>
      </div>
      
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1 flex flex-col gap-6">
            <Card>
                <CardHeader>
                    <CardTitle>{group.name}</CardTitle>
                    <CardDescription>{group.description}</CardDescription>
                </CardHeader>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Users className="h-5 w-5" />Thành viên</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {groupMembers.length > 0 ? groupMembers.map(member => (
                        <div key={member.id} className="flex items-center gap-3">
                            <Avatar className="h-10 w-10">
                                <AvatarImage src={member.image.imageUrl} alt={member.name} data-ai-hint={member.image.imageHint} />
                                <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <span className="font-medium">{member.name}</span>
                        </div>
                    )) : <p className="text-sm text-muted-foreground">Chưa có thành viên trong nhóm này.</p>}
                </CardContent>
            </Card>
        </div>
        <div className="lg:col-span-2">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Scissors className="h-5 w-5" />Dịch vụ được phân công</CardTitle>
                    <CardDescription>Nhóm này có thể thực hiện {groupServices.length} dịch vụ sau:</CardDescription>
                </CardHeader>
                <CardContent>
                   <ul className="space-y-3">
                    {groupServices.map(service => (
                        <li key={service.id} className="flex items-center justify-between rounded-md border p-4">
                            <div>
                                <p className="font-medium">{service.name}</p>
                                <p className="text-sm text-muted-foreground">{service.category}</p>
                            </div>
                             <Badge variant="secondary">${service.price.toFixed(2)}</Badge>
                        </li>
                    ))}
                   </ul>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
