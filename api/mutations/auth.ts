import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import {
  ILogin,
  ILoginRes,
  IMsgRes,
  IProfileRes,
  IRegister,
  IRegisterRes,
  ISendOtp,
  IUpdatePassword,
  IUpdateProfile,
  IVerify,
  IVerifyOtpRes,
  IVerifyRes,
  login,
  register,
  sendOtp,
  updatePassword,
  updateProfile,
  verifyEmail,
  verifyOtp,
} from "../requests/auth";
import { AxiosError } from "axios";

export type CustomError = AxiosError<{
  data: { error: string; message: string };
  message: string;
  status: "error";
}>;

export const useLogin = (
  options?: UseMutationOptions<ILoginRes, CustomError, ILogin, unknown>,
) => {
  return useMutation({
    ...options,
    mutationFn: (data: ILogin) => login(data),
  });
};

export const useRegister = (
  options?: UseMutationOptions<IRegisterRes, CustomError, IRegister, unknown>,
) => {
  return useMutation({
    ...options,
    mutationFn: (data: IRegister) => register(data),
  });
};

export const useUpdateProfile = (
  options?: UseMutationOptions<IProfileRes, CustomError, IUpdateProfile, unknown>,
) => {
  return useMutation({
    ...options,
    mutationFn: (data: IUpdateProfile) => updateProfile(data),
  });
};

export const useUpdatePassword = (
  options?: UseMutationOptions<IMsgRes, CustomError, IUpdatePassword, unknown>,
) => {
  return useMutation({
    ...options,
    mutationFn: (data: IUpdatePassword) => updatePassword(data),
  });
};

export const useVerifyOtp = (
  options?: UseMutationOptions<IVerifyOtpRes, CustomError, IVerify, unknown>,
) => {
  return useMutation({
    ...options,
    mutationFn: (data: IVerify) => verifyOtp(data),
  });
};

export const useVerifyEmail = (
  options?: UseMutationOptions<IVerifyRes, CustomError, IVerify, unknown>,
) => {
  return useMutation({
    ...options,
    mutationFn: (data: IVerify) => verifyEmail(data),
  });
};

export const useSendOtp = (
  options?: UseMutationOptions<IMsgRes, CustomError, ISendOtp, unknown>,
) => {
  return useMutation({
    ...options,
    mutationFn: (data: ISendOtp) => sendOtp(data),
  });
};
