"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import * as z from "zod";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import { Spinner } from "@/components/ui/spinner";
import { useUpdatePassword } from "@/api/mutations/auth";
import { newPasswordSchema } from "@/schema/auth";

export default function SetPassword() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const form = useForm<z.infer<typeof newPasswordSchema>>({
    resolver: zodResolver(newPasswordSchema),
    defaultValues: {
      new_password: "",
      confirm_password: "",
    },
  });

  const { mutateAsync: updatePassword } = useUpdatePassword({
    onError: (error) => {
      toast.error(error.response?.data.message);
    },
  });

  const router = useRouter();
  if (!email) router.replace("/auth/signup");

  const onSubmit = async (data: z.infer<typeof newPasswordSchema>) => {
    try {
      const rpo = localStorage.getItem("rpo");
      await updatePassword({
        email: email || "",
        new_password: data.confirm_password,
        access_token: rpo || "",
        user_type: "business_super_admin",
      });
      localStorage.removeItem("rpo");
      toast.success("Password Updated successfully!");
      router.push(`/auth/login`);
    } catch {}
  };

  const password = useWatch({
    control: form.control,
    name: "new_password",
  });

  return (
    <Card className="w-full border-none shadow-none bg-white p-6 ring-0">
      <CardHeader className="space-y-1 text-center pb-8">
        <CardTitle className="text-3xl font-bold font-azeret!">
          Enter password
        </CardTitle>
      </CardHeader>
      <form className="space-y-5" onSubmit={form.handleSubmit(onSubmit)}>
        <CardContent className="grid gap-6">
          <Controller
            name="new_password"
            control={form.control}
            render={({ field }) => (
              <div className="grid gap-2">
                <Label
                  htmlFor="password"
                  className="font-semibold text-sm text-primary"
                >
                  Enter New Password
                </Label>
                <Input
                  {...field}
                  type="password"
                  placeholder="Enter New Password"
                  className="rounded-lg border-gray-200 h-10 px-4 focus-visible:ring-primary"
                />
              </div>
            )}
          />
          <Controller
            name="confirm_password"
            control={form.control}
            render={({ field, fieldState }) => (
              <div className="grid gap-2">
                <Label
                  htmlFor="password"
                  className="font-semibold text-sm text-primary"
                >
                  Confirm Password
                </Label>
                <Input
                  {...field}
                  type="password"
                  placeholder="Confirm Password"
                  className="rounded-lg border-gray-200 h-10 px-4 focus-visible:ring-primary"
                />
                {fieldState.error && (
                  <p className="text-red-500 text-xs">
                    {fieldState.error.message}
                  </p>
                )}
              </div>
            )}
          />
          <div className="flex flex-wrap gap-1 mt-2">
            <div
              className={cn(
                "flex p-2 gap-1 items-center justify-center rounded-sm bg-gray-100",
                {
                  "bg-[#f0f0f0] text-[#a5a5a5]": password.length < 8,
                },
              )}
            >
              <Check size={13} />
              <p className="text-[10px] font-light">8 Characters</p>
            </div>
            <div
              className={cn(
                "flex p-2 gap-1 items-center justify-center bg-gray-100 rounded-sm",
                {
                  "bg-[#f0f0f0] text-[#a5a5a5]": !/[A-Z]/.test(password),
                },
              )}
            >
              <Check size={13} />
              <p className="text-[10px] font-light">1 upper case</p>
            </div>
            <div
              className={cn(
                "flex p-2 gap-1 items-center justify-center bg-gray-100 rounded-sm",
                {
                  "bg-[#f0f0f0] text-[#a5a5a5]": !/[a-z]/.test(password),
                },
              )}
            >
              <Check size={13} />
              <p className="text-[10px] font-light">1 lower case</p>
            </div>
            <div
              className={cn(
                "flex p-2 gap-1 items-center justify-center bg-gray-100 rounded-sm",
                {
                  "bg-[#f0f0f0] text-[#a5a5a5]": !/[^a-zA-Z0-9]/.test(password),
                },
              )}
            >
              <Check size={13} />
              <p className="text-[10px] font-light">A special character</p>
            </div>
            <div
              className={cn(
                "flex p-2 gap-1 items-center justify-center bg-gray-100 rounded-sm",
                {
                  "bg-[#f0f0f0] text-[#a5a5a5]": !/[0-9]/.test(password),
                },
              )}
            >
              <Check size={13} />
              <p className="text-[10px] font-light">A number</p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-6">
          <Button
            className="w-full bg-primary hover:bg-primary/90 h-12 text-md font-semibold text-white"
            disabled={!!form.formState.isSubmitting || !form.formState.isValid}
          >
            {form.formState.isSubmitting ? (
              <Spinner className="size-5" />
            ) : (
              "Create Account"
            )}
          </Button>
          <div className="text-center text-sm text-gray-500 px-4 leading-relaxed">
            By creating an account, you agree to our <br />
            <Link
              href="https://www.breezespaces.com/terms"
              className="font-bold text-primary hover:underline decoration-current"
            >
              Terms of Service
            </Link>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
}
