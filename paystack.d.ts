declare module "@paystack/inline-js" {
  interface TransactionConfig {
    key: string;
    email: string;
    amount: number;
    reference?: string;
    onSuccess?: (response: { reference: string; status: string; trans: string }) => void;
    onClose?: () => void;
  }

  class PaystackPop {
    newTransaction(config: TransactionConfig): void;
  }

  export default PaystackPop;
}
