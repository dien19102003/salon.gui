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
    title: 'Login | Shear Bliss',
    description: 'Sign in to your Shear Bliss account.',
};

export default function LoginPage() {
  return (
     <>
        <div className="grid gap-2 text-center">
            <Logo className="h-8 w-auto text-primary mb-4" />
            <h1 className="text-3xl font-bold">Welcome Back</h1>
            <p className="text-balance text-muted-foreground">
                Enter your credentials to access your account
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
                <Label htmlFor="password">Password</Label>
                <Link
                    href="/forgot-password"
                    className="ml-auto inline-block text-sm underline"
                >
                    Forgot your password?
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
                    Remember me
                </Label>
            </div>
            <Button type="submit" className="w-full">
                Login
            </Button>
            <Button variant="outline" className="w-full">
                Login with Google
            </Button>
        </div>
        <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="underline">
                Sign up
            </Link>
        </div>
    </>
  )
}
