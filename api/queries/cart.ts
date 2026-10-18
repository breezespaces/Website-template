import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { getCart, getCheckoutCallback, ICart, IOrder } from "../requests/cart";

export const useGetCart = (options?: Omit<UseQueryOptions<ICart>, "queryKey" | "queryFn">) => {
  return useQuery({
    queryKey: ["customer-cart"],
    queryFn: () => getCart(),
    ...options,
  });
};

export const useGetCheckoutCallback = (
  reference: string,
  options?: Omit<UseQueryOptions<IOrder>, "queryKey" | "queryFn">,
) => {
  return useQuery({
    queryKey: ["checkout-callback", reference],
    queryFn: () => getCheckoutCallback(reference),
    enabled: !!reference,
    ...options,
  });
};
