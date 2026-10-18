import { useQuery } from "@tanstack/react-query";
import {
  getSupportedCountries,
  getSupportedCurrencies,
  IOptionsParams,
} from "../requests/options";

export const useGetSupportedCountries = (params?: IOptionsParams) => {
  return useQuery({
    queryKey: ["supported-countries", params?.search, params?.limit, params?.offset],
    queryFn: () => getSupportedCountries(params),
  });
};

export const useGetSupportedCurrencies = (params?: IOptionsParams) => {
  return useQuery({
    queryKey: ["supported-currencies", params?.search, params?.limit, params?.offset],
    queryFn: () => getSupportedCurrencies(params),
  });
};
