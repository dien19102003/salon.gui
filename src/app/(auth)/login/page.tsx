"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/icons/logo";
import { identityApi, authUser } from "@/lib/api-client";
import { useCustomer } from "@/context/customer-context";

export default function LoginPage() {
  const router = useRouter();
  const { loadCustomer } = useCustomer();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      await identityApi.login(
        {
          username,
          password,
        },
        "/Identity/Login/Password"
      );

      // Ngay sau khi đăng nhập: load thông tin customer vào context
      const currentUser = authUser.getCurrentUser();
      if (currentUser?.id) {
        try {
          console.log('Loading customer after login, accountId:', currentUser.id);
          await loadCustomer();
          console.log('Customer loaded successfully');
        } catch (customerError: any) {
          // Không chặn flow đăng nhập nếu không lấy được thông tin khách hàng
          console.error(
            "Không thể tải thông tin khách hàng sau khi đăng nhập",
            customerError
          );
          // Nếu là 404, có thể customer chưa được tạo - không phải lỗi nghiêm trọng
          if (customerError?.status !== 404 && customerError?.response?.status !== 404) {
            console.warn('Customer load failed with non-404 error:', customerError);
          }
        }
      } else {
        console.warn('No current user after login');
      }

      router.push("/");
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Login failed", error);
      setErrorMessage("Tên đăng nhập hoặc mật khẩu không chính xác.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="grid gap-2 text-center">
        <Logo className="h-8 w-auto text-primary mb-4" />
        <h1 className="text-3xl font-bold">Chào mừng trở lại</h1>
        <p className="text-balance text-muted-foreground">
          Nhập thông tin đăng nhập để truy cập vào tài khoản của bạn
        </p>
      </div>

      <form className="grid gap-4 mt-6" onSubmit={handleSubmit}>
        <div className="grid gap-2">
          <Label htmlFor="username">Tên đăng nhập</Label>
          <Input
            id="username"
            type="text"
            placeholder="developer"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
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
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
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

        {errorMessage && (
          <p className="text-sm text-destructive">{errorMessage}</p>
        )}

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Đang đăng nhập..." : "Đăng nhập"}
        </Button>
        <Button variant="outline" className="w-full" type="button">
          Đăng nhập với Google
        </Button>
      </form>

      <div className="mt-4 text-center text-sm">
        Chưa có tài khoản?{" "}
        <Link href="/register" className="underline">
          Đăng ký
        </Link>
      </div>
    </>
  );
}
