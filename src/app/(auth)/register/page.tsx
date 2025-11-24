import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Logo } from "@/components/icons/logo"

export const metadata = {
    title: 'Create Account | Shear Bliss',
    description: 'Sign up for a new Shear Bliss account.',
};


export default function RegisterPage() {
  return (
    <>
      <div className="grid gap-2 text-center">
        <Logo className="h-8 w-auto text-primary mb-4" />
        <h1 className="text-3xl font-bold">Create an Account</h1>
        <p className="text-balance text-muted-foreground">
          Enter your information to create your Shear Bliss account
        </p>
      </div>
      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="full-name">Full Name</Label>
          <Input id="full-name" placeholder="Max Robinson" required />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="phone">Phone Number</Label>
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
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" />
        </div>
         <div className="flex items-start space-x-2">
            <Checkbox id="terms" />
            <div className="grid gap-1.5 leading-none">
                <Label
                    htmlFor="terms"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                    I agree to the <Link href="#" className="underline">Terms and Conditions</Link>
                </Label>
            </div>
        </div>
        <Button type="submit" className="w-full">
          Create an account
        </Button>
         <Button variant="outline" className="w-full">
            Sign up with Google
        </Button>
      </div>
      <div className="mt-4 text-center text-sm">
        Already have an account?{" "}
        <Link href="/login" className="underline">
          Sign in
        </Link>
      </div>
    </>
  )
}
