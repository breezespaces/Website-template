import { useMutation, UseMutationOptions, useQueryClient } from "@tanstack/react-query";
import {
  addToCartApi,
  clearCartApi,
  ICart,
  IAddToCartReq,
  IUpdateCartItemReq,
  removeFromCartApi,
  updateCartItemApi,
} from "../requests/cart";
import { CustomError } from "./auth";

export const useAddToCartApi = (
  options?: UseMutationOptions<ICart, CustomError, IAddToCartReq, unknown>,
) => {
  const queryClient = useQueryClient();
  return useMutation({
    ...options,
    mutationFn: (data: IAddToCartReq) => addToCartApi(data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: ["customer-cart"] });
      options?.onSuccess?.(...args);
    },
  });
};

export const useRemoveFromCartApi = (
  options?: UseMutationOptions<void, CustomError, string, unknown>,
) => {
  const queryClient = useQueryClient();
  return useMutation({
    ...options,
    mutationFn: (variantId: string) => removeFromCartApi(variantId),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: ["customer-cart"] });
      options?.onSuccess?.(...args);
    },
  });
};

export const useUpdateCartItemApi = (
  options?: UseMutationOptions<
    { id: string; quantity: number },
    CustomError,
    { variantId: string; data: IUpdateCartItemReq },
    unknown
  >,
) => {
  const queryClient = useQueryClient();
  return useMutation({
    ...options,
    mutationFn: ({ variantId, data }) => updateCartItemApi(variantId, data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: ["customer-cart"] });
      options?.onSuccess?.(...args);
    },
  });
};

export const useClearCartApi = (
  options?: UseMutationOptions<void, CustomError, void, unknown>,
) => {
  const queryClient = useQueryClient();
  return useMutation({
    ...options,
    mutationFn: () => clearCartApi(),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: ["customer-cart"] });
      options?.onSuccess?.(...args);
    },
  });
};
