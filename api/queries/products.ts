import { useQuery } from "@tanstack/react-query"
import { getProduct, getProducts, IParams } from "../requests/products"


export const useGetProducts = (params: IParams) => {
  return useQuery({
    queryKey: ["products", ...Object.values(params)],
    queryFn: () => getProducts(params),
  })
}

export const useGetProduct = (id: string) => {
  return useQuery({
    queryKey: ["product", id],
    queryFn: () => getProduct(id),
  })
}