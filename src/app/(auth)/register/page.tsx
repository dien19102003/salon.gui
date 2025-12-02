"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Logo } from "@/components/icons/logo";
import { salonApi } from "@/lib/api-client";

export default function RegisterPage() {
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setErrorMessage(null);
    setSuccessMessage(null);

    if (!acceptedTerms) {
      setErrorMessage("Bạn cần đồng ý với Điều khoản và Điều kiện.");
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        // TODO: Map đúng với CustomerBundleCreateDataAdminDto trên backend
        fullName,
        phoneNumber: phone,
        email,
        password,
      };

      await salonApi.post("/Customer", payload);

      setSuccessMessage("Tạo tài khoản thành công. Vui lòng đăng nhập.");

      setTimeout(() => {
        router.push("/login");
      }, 800);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Register failed", error);
      setErrorMessage("Không thể tạo tài khoản. Vui lòng thử lại.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="grid gap-2 text-center">
        <Logo className="h-8 w-auto text-primary mb-4" />
        <h1 className="text-3xl font-bold">Tạo một tài khoản</h1>
        <p className="text-balance text-muted-foreground">
          Nhập thông tin của bạn để tạo tài khoản Eggstech Salon
        </p>
      </div>

      <form className="grid gap-4 mt-6" onSubmit={handleSubmit}>
        <div className="grid gap-2">
          <Label htmlFor="full-name">Họ và tên</Label>
          <Input
            id="full-name"
            placeholder="Max Robinson"
            value={fullName}
            onChange={(event) => setFullName(event.target.value)}
            required
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="phone">Số điện thoại</Label>
          <Input
            id="phone"
            type="tel"
            placeholder="(123) 456-7890"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            required
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="m@example.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="password">Mật khẩu</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </div>

        <div className="flex items-start space-x-2">
          <Checkbox
            id="terms"
            checked={acceptedTerms}
            onCheckedChange={(checked) =>
              setAcceptedTerms(checked === true || checked === "indeterminate")
            }
          />
          <div className="grid gap-1.5 leading-none">
            <Label
              htmlFor="terms"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Tôi đồng ý với{" "}
              <Link href="#" className="underline">
                Điều khoản và Điều kiện
              </Link>
            </Label>
          </div>
        </div>

        {errorMessage && (
          <p className="text-sm text-destructive">{errorMessage}</p>
        )}
        {successMessage && (
          <p className="text-sm text-emerald-600">{successMessage}</p>
        )}

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Đang tạo tài khoản..." : "Tạo tài khoản"}
        </Button>
        <Button variant="outline" className="w-full" type="button">
          Đăng ký với Google
        </Button>
      </form>

      <div className="mt-4 text-center text-sm">
        Bạn đã có tài khoản?{" "}
        <Link href="/login" className="underline">
          Đăng nhập
        </Link>
      </div>
    </>
  );
}
