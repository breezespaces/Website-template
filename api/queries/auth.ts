import { useQuery } from "@tanstack/react-query"
import { getProduct, getProducts, IParams } from "../requests/products"
import { getProfile, getTenantInfo } from "../requests/auth"


export const useGetProfile = () => {
  return useQuery({
    queryKey: ["get-profile"],
    queryFn: () => getProfile(),
  })
}

export const useGetTenantInfo = () => {
  return useQuery({
    queryKey: ["tenant-info"],
    queryFn: () => getTenantInfo(),
  })
}
