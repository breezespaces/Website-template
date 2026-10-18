import { api } from "../axios";
import { ENDPOINTS } from "../endpoints";
import { IOrder } from "./cart";

export const getCustomerOrder = async (order_id: string): Promise<IOrder> => {
  const response = await api.get(ENDPOINTS.customerOrder(order_id));
  return response.data;
};
