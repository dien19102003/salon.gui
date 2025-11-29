import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Logo } from "@/components/icons/logo"

export const metadata = {
    title: 'Tạo tài khoản | Eggstech Salon',
    description: 'Đăng ký tài khoản Eggstech Salon mới.',
};


export default function RegisterPage() {
  return (
    <>
      <div className="grid gap-2 text-center">
        <Logo className="h-8 w-auto text-primary mb-4" />
        <h1 className="text-3xl font-bold">Tạo một tài khoản</h1>
        <p className="text-balance text-muted-foreground">
          Nhập thông tin của bạn để tạo tài khoản Eggstech Salon
        </p>
      </div>
      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="full-name">Họ và tên</Label>
          <Input id="full-name" placeholder="Max Robinson" required />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="phone">Số điện thoại</Label>
          <Input id="phone" type="tel" placeholder="(123) 456-7890" required />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="m@example.com"
            required
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="password">Mật khẩu</Label>
          <Input id="password" type="password" />
        </div>
         <div className="flex items-start space-x-2">
            <Checkbox id="terms" />
            <div className="grid gap-1.5 leading-none">
                <Label
                    htmlFor="terms"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                    Tôi đồng ý với <Link href="#" className="underline">Điều khoản và Điều kiện</Link>
                </Label>
            </div>
        </div>
        <Button type="submit" className="w-full">
          Tạo tài khoản
        </Button>
         <Button variant="outline" className="w-full">
            Đăng ký với Google
        </Button>
      </div>
      <div className="mt-4 text-center text-sm">
        Bạn đã có tài khoản?{" "}
        <Link href="/login" className="underline">
          Đăng nhập
        </Link>
      </div>
    </>
  )
}
