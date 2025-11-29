import Link from "next/link"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Logo } from "@/components/icons/logo"

export const metadata = {
    title: 'Đăng nhập | Eggstech Salon',
    description: 'Đăng nhập vào tài khoản Eggstech Salon của bạn.',
};

export default function LoginPage() {
  return (
     <>
        <div className="grid gap-2 text-center">
            <Logo className="h-8 w-auto text-primary mb-4" />
            <h1 className="text-3xl font-bold">Chào mừng trở lại</h1>
            <p className="text-balance text-muted-foreground">
                Nhập thông tin đăng nhập để truy cập vào tài khoản của bạn
            </p>
        </div>
        <div className="grid gap-4">
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
                <div className="flex items-center">
                <Label htmlFor="password">Mật khẩu</Label>
                <Link
                    href="/forgot-password"
                    className="ml-auto inline-block text-sm underline"
                >
                    Quên mật khẩu?
                </Link>
                </div>
                <Input id="password" type="password" required />
            </div>
             <div className="flex items-center space-x-2">
                <Checkbox id="remember-me" />
                <Label
                    htmlFor="remember-me"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                    Ghi nhớ tôi
                </Label>
            </div>
            <Button type="submit" className="w-full">
                Đăng nhập
            </Button>
            <Button variant="outline" className="w-full">
                Đăng nhập với Google
            </Button>
        </div>
        <div className="mt-4 text-center text-sm">
            Chưa có tài khoản?{" "}
            <Link href="/register" className="underline">
                Đăng ký
            </Link>
        </div>
    </>
  )
}
