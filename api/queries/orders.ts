import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { getCustomerOrder } from "../requests/orders";
import { IOrder } from "../requests/cart";

export const useGetCustomerOrder = (
  order_id: string,
  options?: Omit<UseQueryOptions<IOrder>, "queryKey" | "queryFn">,
) => {
  return useQuery({
    queryKey: ["customer-order", order_id],
    queryFn: () => getCustomerOrder(order_id),
    enabled: !!order_id,
    ...options,
  });
};
