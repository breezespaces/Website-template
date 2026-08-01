"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CardContent, CardFooter } from "@/components/ui/card";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useSendOtp } from "@/api/mutations/auth";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Spinner } from "@/components/ui/spinner";
import { forgotPasswordSchema } from "@/schema/auth";

export default function PasswordResetForm() {
  const form = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });
  const { mutateAsync: sendOtp } = useSendOtp({
    onError: (error) => {
      toast.error(error?.response?.data.data.message || "Something went wrong");
    },
  });

  const router = useRouter();
  const onSubmit = async ({ email }: z.infer<typeof forgotPasswordSchema>) => {
    try {
      await sendOtp({ email: email, user_type: "business_super_admin" });
      toast.success("Otp sent to email!");
      router.push(`/auth/verify-otp?email=${encodeURIComponent(email)}`);
    } catch {}
  };
  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <CardContent className="grid gap-6">
        <Controller
          name="email"
          control={form.control}
          render={({ field }) => (
            <div className="grid gap-2 text-center sm:text-left">
              <Label
                htmlFor="email"
                className="font-normal text-sm text-primary sm:px-1"
              >
                Email
              </Label>
              <Input
                type="email"
                {...field}
                placeholder="Enter Email Address"
                className="rounded-lg border-gray-200 h-10 px-4 focus-visible:ring-primary"
              />
            </div>
          )}
        />
      </CardContent>
      <CardFooter className="flex flex-col gap-6">
        <Button
          className="w-full bg-primary hover:bg-primary/90 h-12 text-md font-semibold text-white"
          disabled={!!form.formState.isSubmitting || !form.formState.isValid}
        >
          {form.formState.isSubmitting ? <Spinner /> : "Reset Password"}
        </Button>
        <hr className="my-1 bg-primary h-[0.5] w-full" />
        <div className="w-full space-y-6">
          <p className="text-sm font-light text-primary text-center">
            Remembered your Password?
          </p>
          <Link href="/auth/login">
            <Button
              variant={"outline"}
              size={"lg"}
              className="h-12 w-full text-[#205543]!"
            >
              Back to Sign In
            </Button>
          </Link>
        </div>
      </CardFooter>
    </form>
  );
}
