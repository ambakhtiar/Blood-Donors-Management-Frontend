import axiosInstance from "../lib/axiosInstance";
import { removeAccessToken } from "../lib/axiosInstance";
import type { ApiResponse, IUser } from "../types";
import { LoginFormValues, RegisterFormValues } from "../validations/auth.validation";

// ---------- Login ----------
export const loginApi = async (payload: LoginFormValues): Promise<any> => {
  const response = await axiosInstance.post("/auth/login", payload);
  return response.data;
};

// ---------- Register ----------
export const registerApi = async (payload: RegisterFormValues): Promise<any> => {
  const response = await axiosInstance.post("/auth/register", payload);
  return response.data;
};

// ---------- Fetch current authenticated user ----------
export const fetchCurrentUser = async (): Promise<IUser> => {
  const response = await axiosInstance.get<ApiResponse<IUser>>("/users/me");
  return response.data.data;
};

// ---------- Logout ----------
export const logoutApi = async (): Promise<void> => {
  try {
    await axiosInstance.post("/auth/logout");
  } finally {
    // Always clear in-memory token even if API call fails
    removeAccessToken();
  }
};
