"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { CardContent, CardFooter } from "@/components/ui/card";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useLogin } from "@/api/mutations/auth";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { loginSchema } from "@/schema/auth";
import { createSession } from "@/actions/auth";

export default function LoginForm() {
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const router = useRouter();

  const { mutateAsync: login } = useLogin({
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Something went wrong");
    },
  });

  const onSubmit = async (data: z.infer<typeof loginSchema>) => {
    try {
      const res = await login({ ...data, user_type: "customer" });
      await createSession(
        res.data.login_keys.access,
        res.data.login_keys.refresh,
      );
      router.push("/");
    } catch {}
  };
  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <CardContent className="space-y-6">
        <Controller
          name="email"
          control={form.control}
          render={({ field, fieldState }) => (
            <div className="grid gap-2">
              <Label htmlFor="email" className="font-semibold text-xs">
                Email
              </Label>
              <Input
                {...field}
                placeholder="Enter Email Address"
                className="border-gray-200 h-10 px-4 focus-visible:ring-primary"
              />
              {fieldState.error && (
                <p className="text-red-500">{fieldState.error.message}</p>
              )}
            </div>
          )}
        />
        <Controller
          name="password"
          control={form.control}
          render={({ field, fieldState }) => (
            <div className="grid gap-2">
              <Label htmlFor="password" className="font-semibold text-xs">
                Password
              </Label>
              <Input
                {...field}
                type="password"
                placeholder="Enter Password"
                className="border-gray-200 h-10 px-4 focus-visible:ring-primary"
              />
              {fieldState.error && (
                <p className="text-red-500">{fieldState.error.message}</p>
              )}
            </div>
          )}
        />
        <div className="text-right">
          <Link
            href="/auth/password-reset"
            className="text-sm font-medium text-gray-700 hover:text-black hover:underline"
          >
            Forgot your password?
          </Link>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-4 bg-transparent border-none">
        <Button
          className="w-full bg-primary hover:bg-primary/90 h-12 text-md font-semibold text-white"
          disabled={!!form.formState.isSubmitting || !form.formState.isValid}
        >
          {form.formState.isSubmitting ? (
            <Spinner className="size-5" />
          ) : (
            "Sign In"
          )}
        </Button>
      </CardFooter>
    </form>
  );
}
