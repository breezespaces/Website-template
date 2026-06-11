import { useState } from "react";
import { usePaystackPayment } from "react-paystack";
import { useRouter } from "next/navigation";

const publicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY;


export const usePaystackApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();

  const makePayment = ({
    email,
    amount,
    order,
    onSuccess,
  }: {
    email: string;
    amount: number;
    order: any;
    onSuccess: () => void;
  }) => {
    setLoading(true);

    const config = {
      reference: new Date().getTime().toString(),
      email,
      amount: amount * 100,
      publicKey,
    };

    const initializePayment = usePaystackPayment(config);

    initializePayment({
      onSuccess: (referenceObj: { reference: string }) => {
        console.log("Payment successful:", referenceObj);
        const reference = referenceObj.reference;
        router.push(`/payment-success?reference=${reference}`);

        onSuccess();
        setLoading(false);
      },
      onClose: () => {
        console.log("Payment popup closed");
        setLoading(false);
      },
    });
  };

  return { makePayment, loading, error };
};