import { Suspense } from "react";
import VerifyOTP from "@/components/auth/verify-otp";

export default function VerifyOTPPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center">
          <p className="text-sm text-muted-foreground animate-pulse">
            Loading...
          </p>
        </div>
      }
    >
      <VerifyOTP />
    </Suspense>
  );
}
