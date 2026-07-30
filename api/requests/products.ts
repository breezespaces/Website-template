import { filterParams } from "@/lib/utils";
import { api, apiAuth } from "../axios";
import { ENDPOINTS } from "../endpoints";

export type IParams = {
  limit?: number;
  offset?: number;
  ordering?: "asc" | "desc";
  search?: string;
};

export type IProduct = {
  id: string;
  product_name: string;
  categories: string[];
  average_rating: number;
  review_count: number;
  inventory_count: number;
  variant_count: number;
  lowest_price: number;
  allow_preorder: boolean;
  is_published: boolean;
  updated_at: string;
  created_at: string;
  first_image: string;
};

type IProductOption = {
  name: string;
  values: { name: string }[];
};

type IProductVariant = {
  sku: string;
  product_price: string;
  discount_price: string;
  cost_price: string;
  quantity: number;
};

export type IProductDetailsRes = IMsgRes & {
  data: {
    allow_preorder: boolean;
    average_rating: number;
    categories: {
      id: string;
      name: string;
      image: string;
      product_count: string;
      created_at: string;
    }[];
    created_at: string;
    id: string;
    inventory_count: number;
    is_published: boolean;
    product_description: string;
    product_images: {
      id: string;
      image: string;
    }[];
    product_name: string;
    review_count: 0;
    updated_at: "2026-06-03T16:41:47.944848Z";
    variant_count: 1;
    variants: (IProductVariant & { option_values: { name: string }[] })[];
    options: IProductOption[];
  };
};

export type IProductRes = IMsgRes & {
  data: {
    count: number;
    next: string;
    previous: string;
    results: IProduct[];
  };
};

export type IMsgRes = {
  message: string;
  status: string;
};

export const getProducts = async (params: IParams): Promise<IProductRes> => {
  const filteredParams = filterParams(params);
  const response = await api.get(`${ENDPOINTS.products}/`, {
    params: filteredParams,
  });
  return response.data;
};

export const getProduct = async (id: string): Promise<IProductDetailsRes> => {
  const response = await api.get(`${ENDPOINTS.product}/${id}/`);
  return response.data;
};
