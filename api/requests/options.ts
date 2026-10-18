import { api } from "../axios";
import { ENDPOINTS } from "../endpoints";
import { filterParams } from "@/lib/utils";

export type IOptionsParams = {
  limit?: number;
  offset?: number;
  search?: string;
};

export type ISupportedCountry = {
  id: string;
  code: string;
  name: string;
  currency: string;
};

export type ISupportedCurrency = {
  symbol: string;
  name: string;
};

export type IPaginatedResponse<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
};

export const getSupportedCountries = async (
  params?: IOptionsParams,
): Promise<IPaginatedResponse<ISupportedCountry>> => {
  const filteredParams = params ? filterParams(params) : {};
  const response = await api.get(ENDPOINTS.supportedCountries, {
    params: filteredParams,
  });
  return response.data;
};

export const getSupportedCurrencies = async (
  params?: IOptionsParams,
): Promise<IPaginatedResponse<ISupportedCurrency>> => {
  const filteredParams = params ? filterParams(params) : {};
  const response = await api.get(ENDPOINTS.supportedCurrencies, {
    params: filteredParams,
  });
  return response.data;
};
