"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Timer, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useRouter, useSearchParams } from "next/navigation";
import { useSendOtp, useVerifyEmail } from "@/api/mutations/auth";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import Image from "next/image";
import { otpSchema } from "@/schema/auth";
import { createSession } from "@/actions/auth";

export function ConfirmEmail() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [timer, setTimer] = useState(60 * 3);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setTimer((prev) => prev - 1);
    }, 1000);
    return () => clearTimeout(timeout);
  }, [timer]);
  const form = useForm<z.infer<typeof otpSchema>>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: "",
    },
  });
  const { mutateAsync: verify } = useVerifyEmail({
    onError: (error) => {
      setError(error.response?.data?.message || "Something went wrong");
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
        user_type: "customer",
      });
      await createSession(
        res.data.login_keys.access,
        res.data.login_keys.refresh,
      );
      setSuccess(true);
    } catch {}
  };

  if (success)
    return (
      <Card className="w-full border-none shadow-none bg-white p-6 ring-0 relative overflow-hidden pb-20!">
        <CardHeader className="space-y-2 flex items-center justify-center flex-col">
          <Image
            src={"/assets/thumb.png"}
            width={200}
            height={200}
            alt={"success-thumb"}
          />
          <CardTitle className="text-3xl font-bold tracking-tight font-azeret">
            Well done!
          </CardTitle>
          <CardDescription className="text-primary">
            Proceed to dashboard
          </CardDescription>
          <Link href={"/"} className="w-full">
            <Button className="w-full" size={"lg"}>
              Proceed
            </Button>
          </Link>
        </CardHeader>
      </Card>
    );
  return (
    <Card className="w-full! border-none shadow-none bg-white p-6 ring-0 relative overflow-hidden py-20!">
      <div className="ml-auto">
        <div className="bg-primary p-3 rounded-full">
          <X size={20} className="text-white" />
        </div>
      </div>

      <CardHeader className="space-y-4">
        <div className="space-y-1">
          <CardTitle className="text-xl font-bold tracking-tight">
            Enter Verification Code
          </CardTitle>
          <CardDescription className="text-sm text-primary leading-relaxed">
            We sent a 4-digit passcode to{" "}
            <span className="font-bold">{email}</span>
          </CardDescription>
        </div>
      </CardHeader>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <CardContent className="grid gap-6">
          <div className="grid gap-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-primary">Passcode</span>
              {error && (
                <span className="text-[10px] font-bold text-red-400">
                  {error}
                </span>
              )}
            </div>
            <Controller
              name="otp"
              control={form.control}
              render={({ field }) => (
                <InputOTP
                  maxLength={6}
                  value={field.value}
                  onChange={field.onChange}
                  className="w-full justify-between"
                >
                  <InputOTPGroup className="w-full flex gap-2">
                    {[...Array(6)].map((_, i) => (
                      <InputOTPSlot
                        key={i}
                        index={i}
                        className={`flex-1 h-14 rounded-lg border-none bg-gray-100 text-lg font-semibold ${error ? "bg-red-50 text-red-500" : ""}`}
                      />
                    ))}
                  </InputOTPGroup>
                </InputOTP>
              )}
            />
            <div className="flex justify-end mt-2 gap-1 items-end">
              <Timer size={20} />
              <span className="text-[10px] font-bold text-primary flex items-center gap-1">
                {String(Math.floor(timer / 60)).padStart(2, "0")}:
                {String(timer % 60).padStart(2, "0")}
              </span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4 pt-2 bg-transparent! border-0">
          <Button
            className="w-full bg-primary hover:bg-primary/90 h-12 text-md font-semibold text-white"
            disabled={!form.formState.isValid || !!form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? (
              <Spinner className="size-5" />
            ) : (
              "Confirm Code"
            )}
          </Button>
          <div className="self-start test-sm flex items-center gap-3">
            <span className="text-sm font-medium text-primary">
              Didn&apos;t receive the code?{" "}
            </span>
            {email && (
              <button
                className="text-sm font-bold hover:underline cursor-pointer"
                onClick={async (e) => {
                  e.preventDefault();
                  await resendOtp({
                    email: email,
                    user_type: "customer",
                  });
                }}
                disabled={isPending}
              >
                {isPending ? <Spinner className="size-5" /> : "Resend Code"}
              </button>
            )}
          </div>
        </CardFooter>
      </form>
    </Card>
  );
}
