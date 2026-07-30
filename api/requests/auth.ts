import { api, apiAuth } from "../axios";
import { ENDPOINTS } from "../endpoints";

export type UserType = "admin" | "customer" | "business_super_admin";
export type LoginProfile = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  user_type: UserType;
  is_email_verified: boolean;
  country: string;
  phone_number: string;
  currency: string;
};
export type Profile = {
  active_currency: string;
  address_type: string;
  allow_promo_email: boolean;
  city: string;
  country_code: string;
  country_name: string;
  email: string;
  first_name: string;
  house_number: string | null;
  is_active: boolean;
  is_email_verified: boolean;
  last_name: string;
  phone_number: string | null;
  postal_code: string | null;
  state: string;
  street: string;
  user_id: string;
};

export type IRegister = {
  email: string;
  password: string;
};

export type IRegisterRes = {
  data: { email: string };
  message: string;
  status: string;
};

export type IVerify = {
  otp_code: string;
  email: string;
  user_type: UserType;
};

export type ILogin = {
  email: string;
  user_type: UserType;
};

export type ILoginRes = IMsgRes & {
  data: {
    login_success: boolean;
    login_keys: {
      access: string;
      refresh: string;
    };
    profile: LoginProfile;
    has_subscription: boolean;
    email: string;
  };
};

export type ISendOtp = {
  email: string;
  user_type: UserType;
};

export type IVerifyRes = ILoginRes;

export type IMsgRes = {
  message: string;
  status: string;
};

export type IUpdatePassword = {
  email: string;
  access_token: string;
  new_password: string;
  user_type: UserType;
};

export type ITenantInfo = IMsgRes & {
  data: {
    business_name: string;
    business_phone_number: string | null;
    business_email: string | null;
    business_category: string | null;
    store_url: string | null;
    temporary_url: string;
    about: string | null;
    instagram_handle: string | null;
    x_handle: string | null;
    tiktok_handle: string | null;
    address: string | null;
    country: string;
    state: string | null;
    city: string | null;
    zipcode: string | null;
    currency: string;
    primary_refund_policy: string | null;
    primary_refund_policy_conditions: string | null;
    order_processing_time: string | null;
    business_terms_and_conditions: string | null;
    banner: string | null;
    updated_at: string;
  };
};

export type IUpdateProfile = {
  first_name: string;
  last_name: string;
  country: string;
  currency: string;
  address_type: string;
  house_number: string;
  street: string;
  city: string;
  state: string;
  postal_code: string;
  phone_number: string;
  allow_promo_email: boolean;
};

export type IProfileRes = IMsgRes & {
  data: Profile;
};

export type IVerifyOtpRes = IMsgRes & {
  data: {
    access_token: string;
  };
};

export const verifyEmail = async (data: IVerify): Promise<IVerifyRes> => {
  const response = await apiAuth.post(ENDPOINTS.verifyEmail, data);
  return response.data;
};

export const login = async (data: ILogin): Promise<ILoginRes> => {
  const response = await apiAuth.post(ENDPOINTS.login, data);
  return response.data;
};

export const register = async (data: IRegister): Promise<IRegisterRes> => {
  const response = await apiAuth.post(ENDPOINTS.register, data);
  return response.data;
};

export const getProfile = async (): Promise<IProfileRes> => {
  const response = await api.get(ENDPOINTS.profile);
  return response.data;
};

export const updateProfile = async (
  data: IUpdateProfile,
): Promise<IProfileRes> => {
  const response = await api.patch(ENDPOINTS.profile, data);
  return response.data;
};

export const updatePassword = async (
  data: IUpdatePassword,
): Promise<IMsgRes> => {
  const response = await apiAuth.post(ENDPOINTS.updatePassword, data);
  return response.data;
};

export const sendOtp = async (data: ISendOtp): Promise<IMsgRes> => {
  const response = await apiAuth.post(ENDPOINTS.sendOtp, data);
  return response.data;
};

export const getTenantInfo = async (): Promise<ITenantInfo> => {
  const response = await api.get(ENDPOINTS.getTenantInfo);
  return response.data;
};

export const verifyOtp = async (data: IVerify): Promise<IVerifyOtpRes> => {
  const response = await apiAuth.post(ENDPOINTS.verifyOtp, data);
  return response.data;
};
