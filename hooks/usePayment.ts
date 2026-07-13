import { useState } from "react";
import PaystackPop from "@paystack/inline-js";
import { useRouter } from "next/navigation";

const publicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || "";

interface PaymentPayload {
  email: string;
  amount: number;
  order: unknown;
  onSuccess: () => void;
}

export const usePaystackApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const makePayment = ({ email, amount, onSuccess }: PaymentPayload) => {
    if (typeof window === "undefined") return;

    setLoading(true);

    const popup = new PaystackPop();
    popup.newTransaction({
      key: publicKey,
      email,
      amount: amount * 100,
      reference: new Date().getTime().toString(),
      onSuccess: (referenceObj: { reference: string }) => {
        router.push(`/payment-success?reference=${referenceObj.reference}`);
        onSuccess();
        setLoading(false);
      },
      onClose: () => {
        setLoading(false);
      },
    });
  };

  return { makePayment, loading, error };
};
