import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Logo } from "@/components/icons/logo"

export const metadata = {
    title: 'Forgot Password | Shear Bliss',
    description: 'Reset your password for Shear Bliss.',
};


export default function ForgotPasswordPage() {
  return (
    <>
      <div className="grid gap-2 text-center">
        <Logo className="h-8 w-auto text-primary mb-4" />
        <h1 className="text-3xl font-bold">Forgot Password?</h1>
        <p className="text-balance text-muted-foreground">
          No worries! Enter your email below and we'll send you a reset link.
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
          Send Reset Link
        </Button>
      </div>
      <div className="mt-4 text-center text-sm">
        Remembered your password?{" "}
        <Link href="/login" className="underline">
          Sign in
        </Link>
      </div>
    </>
  )
}
