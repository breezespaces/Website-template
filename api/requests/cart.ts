import { api } from "../axios";
import { ENDPOINTS } from "../endpoints";

export type ICartItem = {
  id: string;
  variant: string;
  product_name: string;
  sku: string;
  quantity: number;
  unit_price: string;
  subtotal: string;
};

export type ICart = {
  id: string;
  items: ICartItem[];
  total: string;
  item_count: number;
  updated_at: string;
};

export type IAddToCartReq = {
  variant_id: string;
  quantity?: number;
};

export type IUpdateCartItemReq = {
  quantity: number;
};

export type ICheckoutReq = {
  email: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  house_number?: string;
  city: string;
  state: string;
  allow_promo_email: string;
  postal_code: string;
  country: string;
  callback_url?: string;
};

export type ICheckoutRes = {
  order_id: string;
  authorization_url: string;
  reference: string;
};

export type IOrderItem = {
  id: string;
  product_name: string;
  variant_sku: string;
  unit_price: string;
  quantity: number;
  subtotal: string;
};

export type IOrder = {
  id: string;
  order_id: string;
  customer_name: string;
  amount_due: string;
  amount_paid: string;
  payment_status: string;
  order_status: string;
  order_type?: string | null;
  payment_method?: string | null;
  sale_source?: string | null;
  line_items: IOrderItem[];
  created_at: string;
  updated_at: string;
};

export const getCart = async (): Promise<ICart> => {
  const response = await api.get(ENDPOINTS.cart);
  return response.data;
};

export const addToCartApi = async (data: IAddToCartReq): Promise<ICart> => {
  const response = await api.post(ENDPOINTS.addToCart, data);
  return response.data;
};

export const removeFromCartApi = async (variantId: string): Promise<void> => {
  await api.delete(ENDPOINTS.removeFromCart(variantId));
};

export const updateCartItemApi = async (
  variantId: string,
  data: IUpdateCartItemReq,
): Promise<{ id: string; quantity: number }> => {
  const response = await api.patch(ENDPOINTS.updateCartItem(variantId), data);
  return response.data;
};

export const clearCartApi = async (): Promise<void> => {
  await api.delete(ENDPOINTS.clearCart);
};

export const checkoutApi = async (data: ICheckoutReq): Promise<ICheckoutRes> => {
  const response = await api.post(ENDPOINTS.checkout, data);
  return response.data;
};

export const getCheckoutCallback = async (
  reference: string,
): Promise<IOrder> => {
  const response = await api.get(ENDPOINTS.checkoutCallback(reference));
  return response.data;
};
