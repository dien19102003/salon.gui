import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Logo } from "@/components/icons/logo"

export const metadata = {
    title: 'Quên mật khẩu | Shear Bliss',
    description: 'Đặt lại mật khẩu của bạn cho Shear Bliss.',
};


export default function ForgotPasswordPage() {
  return (
    <>
      <div className="grid gap-2 text-center">
        <Logo className="h-8 w-auto text-primary mb-4" />
        <h1 className="text-3xl font-bold">Quên mật khẩu?</h1>
        <p className="text-balance text-muted-foreground">
          Đừng lo lắng! Nhập email của bạn dưới đây và chúng tôi sẽ gửi cho bạn một liên kết đặt lại.
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
        <Button type="submit" className="w-full">
          Gửi liên kết đặt lại
        </Button>
      </div>
      <div className="mt-4 text-center text-sm">
        Đã nhớ mật khẩu?{" "}
        <Link href="/login" className="underline">
          Đăng nhập
        </Link>
      </div>
    </>
  )
}
