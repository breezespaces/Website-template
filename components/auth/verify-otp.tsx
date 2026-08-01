"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useRouter, useSearchParams } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSendOtp, useVerifyOtp } from "@/api/mutations/auth";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import { otpSchema } from "@/schema/auth";

export default function VerifyOTP() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const [error, setError] = useState(false);

  const form = useForm<z.infer<typeof otpSchema>>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: "",
    },
  });
  const { mutateAsync: verify } = useVerifyOtp({
    onError: (error) => {
      toast.error(error.response?.data?.message || "Something went wrong");
      setError(true);
    },
  });
  const { mutateAsync: resendOtp, isPending } = useSendOtp({
    onError: (error) => {
      toast.error(error.response?.data?.message || "Something went wrong");
    },
  });

  const router = useRouter();
  if (!email) router.replace("/auth/signup");

  const onSubmit = async (data: z.infer<typeof otpSchema>) => {
    try {
      const res = await verify({
        email: email || "",
        otp_code: data.otp,
        user_type: "business_super_admin",
      });
      toast.success("Verified Account Successfully!");
      localStorage.setItem("rpo", res.data.access_token);
      router.push(
        `/auth/set-password?email=${encodeURIComponent(email || "")}`,
      );
    } catch {}
  };

  return (
    <Card className="w-full border-none shadow-none bg-white p-6 ring-0">
      <CardHeader className="space-y-1 text-center pb-8">
        <CardTitle className="text-3xl font-bold font-azeret!">
          Confirm Email
        </CardTitle>
        <CardDescription className="text-xs font-normal text-primary">
          Check Your Email and Enter Confirmation Code
        </CardDescription>
      </CardHeader>
      <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
        <CardContent className="grid gap-6">
          <Controller
            name="otp"
            control={form.control}
            render={({ field, fieldState }) => (
              <div className="grid gap-2">
                <Label
                  htmlFor="code"
                  className="font-normal text-sm text-primary"
                >
                  Confirmation Code
                </Label>
                <Input
                  {...field}
                  placeholder="Enter Code"
                  className={`border-gray-200 h-10 px-4 focus-visible:ring-primary ${fieldState.error || error ? "bg-red-50 border-red-200 text-red-500 placeholder:text-red-300" : ""}`}
                />
                {fieldState.error && (
                  <p className="text-red-500 text-xs">
                    {fieldState.error.message}
                  </p>
                )}
              </div>
            )}
          />
        </CardContent>
        <CardFooter className="flex flex-col gap-6">
          <Button
            className="w-full bg-primary hover:bg-primary/90 h-12 text-md font-semibold text-white"
            disabled={!form.formState.isValid || !!form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? (
              <Spinner className="size-5" />
            ) : (
              "Confirm Email"
            )}
          </Button>
          <hr className="my-1 bg-primary h-[0.5] w-full" />
          <div className="w-full space-y-6">
            <p className="text-sm font-normal text-primary text-center">
              Haven&apos;t received your code?
            </p>
            {email && (
              <Button
                variant={"ghost"}
                size={"lg"}
                className="h-12 w-full text-primary"
                onClick={async (e) => {
                  e.preventDefault();
                  const res = await resendOtp({
                    email,
                    user_type: "business_super_admin",
                  });
                  toast.success(res.message);
                }}
                disabled={isPending}
              >
                {isPending ? <Spinner className="size-5" /> : "Resend Code"}
              </Button>
            )}
          </div>
        </CardFooter>
      </form>
    </Card>
  );
}
