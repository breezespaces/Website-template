import { ConfirmEmail } from "@/components/auth/confirm-email";
import { Suspense } from "react";

export default function ConfirmEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center">
          <p className="text-sm text-muted-foreground animate-pulse">
            Loading email verification...
          </p>
        </div>
      }
    >
      <ConfirmEmail />
    </Suspense>
  );
}
