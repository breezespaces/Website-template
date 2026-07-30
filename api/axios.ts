import { deleteCookie, getCookie } from "@/actions/auth";
import axios, { InternalAxiosRequestConfig } from "axios";
import { COOKIE_KEYS } from "./cookie";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
export const apiAuth = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

const resolveTenantDomain = async (): Promise<string> => {
  if (typeof window === "undefined") {
    try {
      const { headers } = await import("next/headers");
      const headersList = await headers();
      const hostname = headersList.get("host") || "";

      if (hostname.includes("localhost")) {
        return "test-storefront-68d.breezespaces.com";
      }
      return hostname;
    } catch (e) {
      return "";
    }
  }

  if (window.location.hostname.includes("localhost"))
    return "test-storefront-68d.breezespaces.com";

  return window.location.hostname;
};

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

const appendTenantHeader = (config: InternalAxiosRequestConfig) =>
  resolveTenantDomain().then((domain) => {
    config.headers["X-Tenant-Domain"] = domain;
    return config;
  });

const appendAuthHeader = async (config: InternalAxiosRequestConfig) => {
  let token: string | undefined;
  if (typeof window !== "undefined") {
    const tokenCookie = document.cookie
      .split("; ")
      .find((row) => row.startsWith("bs_access_token="));
    if (tokenCookie) {
      token = tokenCookie.split("=")[1];
    }
  } else {
    token = await getCookie(COOKIE_KEYS.ACCESS_TOKEN);
  }

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
};

apiAuth.interceptors.request.use(appendTenantHeader);
api.interceptors.request.use(appendTenantHeader);
api.interceptors.request.use(appendAuthHeader);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        const path = window.location.pathname;
        const isAuthPage = path.startsWith("/auth");

        const isLoggedIn = document.cookie
          .split("; ")
          .find((row) => row.startsWith("bs_logged_in="));

        const isProtectedPage =
          !["/", "/about"].includes(path) &&
          !path.startsWith("/shop/") &&
          !isAuthPage;

        if ((isLoggedIn || isProtectedPage) && !isAuthPage) {
          document.cookie = "bs_logged_in=; Max-Age=0; path=/";
          await deleteCookie(COOKIE_KEYS.ACCESS_TOKEN);
        }

        const isPublic =
          ["/", "/about"].includes(path) ||
          path.startsWith("/shop/") ||
          isAuthPage;
        if (!isPublic) {
          window.location.href = "/auth/login";
        }
      }
    }
    return Promise.reject(error);
  },
);
