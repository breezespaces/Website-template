export const ENDPOINTS = {
  // Auth & Tenant
  login: "/auth/email-login/",
  refreshToken: "/auth/email-login/refresh/",
  register: "/auth/customer/email-signup/",
  verifyEmail: "/auth/customer/email-signup/verify-email/",
  getTenantInfo: "/auth/customer/tenant-info/",
  sendOtp: "/auth/forgot-password/send-otp/",
  updatePassword: "/auth/forgot-password/update-password/",
  verifyOtp: "/auth/forgot-password/verify-otp/",

  // Options
  supportedCountries: "/auth/options/supported-countries/",
  supportedCurrencies: "/auth/options/supported-currencies/",

  // Customer Profile
  profile: "/profiles/customer/profile/",

  // Customer Products
  product: "/products/customer/product",
  products: "/products/customer/products",

  // Customer Carts
  cart: "/carts/customer/cart/",
  addToCart: "/carts/customer/cart/add/",
  clearCart: "/carts/customer/cart/clear/",
  removeFromCart: (variant_id: string) =>
    `/carts/customer/cart/remove/${variant_id}/`,
  updateCartItem: (variant_id: string) =>
    `/carts/customer/cart/update/${variant_id}/`,

  // Customer Checkout
  checkout: "/carts/customer/checkout/",
  checkoutCallback: (reference: string) =>
    `/carts/customer/checkout/callback/${reference}/`,

  // Customer Orders
  customerOrder: (order_id: string) =>
    `/orders/customer/orders/${order_id}/`,
};

