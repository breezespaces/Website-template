"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CardContent, CardFooter } from "@/components/ui/card";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import * as z from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRegister } from "@/api/mutations/auth";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Spinner } from "@/components/ui/spinner";
import { signupSchema } from "@/schema/auth";

export default function SignupForm() {
  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { mutateAsync: signup } = useRegister({
    onError: (error) => {
      toast.error(error.response?.data.message);
    },
  });

  const router = useRouter();

  const onSubmit = async (data: z.infer<typeof signupSchema>) => {
    try {
      const res = await signup(data);
      toast.success("Created account successfully!");
      toast.success(res.message);
      router.push(
        `/auth/confirm-email?email=${encodeURIComponent(res.data.email)}`,
      );
    } catch {}
  };

  return (
    <form className="space-y-5" onSubmit={form.handleSubmit(onSubmit)}>
      <CardContent className="grid gap-6">
        <Controller
          name="email"
          control={form.control}
          render={({ field, fieldState }) => (
            <div className="grid gap-2">
              <Label
                htmlFor="email"
                className="font-semibold text-sm text-primary"
              >
                Email
              </Label>
              <Input
                {...field}
                placeholder="Enter Email Address"
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

        <Controller
          name="password"
          control={form.control}
          render={({ field }) => (
            <div className="grid gap-2">
              <Label
                htmlFor="password"
                className="font-semibold text-sm text-primary"
              >
                Password
              </Label>
              <Input
                {...field}
                type="password"
                placeholder="Enter Password"
                className="rounded-lg border-gray-200 h-10 px-4 focus-visible:ring-primary"
              />
              <div className="flex flex-wrap gap-1 mt-2">
                <div
                  className={cn(
                    "flex p-2 gap-1 items-center justify-center rounded-sm bg-gray-100",
                    {
                      "bg-[#f0f0f0] text-[#a5a5a5]": field.value.length < 8,
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
                      "bg-[#f0f0f0] text-[#a5a5a5]": !/[A-Z]/.test(field.value),
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
                      "bg-[#f0f0f0] text-[#a5a5a5]": !/[a-z]/.test(field.value),
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
                      "bg-[#f0f0f0] text-[#a5a5a5]": !/[^a-zA-Z0-9]/.test(
                        field.value,
                      ),
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
                      "bg-[#f0f0f0] text-[#a5a5a5]": !/[0-9]/.test(field.value),
                    },
                  )}
                >
                  <Check size={13} />
                  <p className="text-[10px] font-light">A number</p>
                </div>
              </div>
            </div>
          )}
        />
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
  );
}
