import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { checkoutApi, ICheckoutReq, ICheckoutRes } from "../requests/cart";
import { CustomError } from "./auth";

export const useCheckoutApi = (
  options?: UseMutationOptions<ICheckoutRes, CustomError, ICheckoutReq, unknown>,
) => {
  return useMutation({
    ...options,
    mutationFn: (data: ICheckoutReq) => checkoutApi(data),
  });
};
