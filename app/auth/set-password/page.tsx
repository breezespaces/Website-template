import SetPassword from "@/components/auth/set-password";
import { Suspense } from "react";

export default function SetPasswordPage() {
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
      <SetPassword />
    </Suspense>
  );
}
