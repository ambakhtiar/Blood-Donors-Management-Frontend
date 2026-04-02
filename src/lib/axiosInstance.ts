import axios, { type InternalAxiosRequestConfig, type AxiosError } from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5000/api/v1";

// ---------- Token Storage Utility ----------
let accessToken: string | null = null;

export const getAccessToken = (): string | null => {
  if (accessToken) return accessToken;
  if (typeof window !== "undefined") {
    return localStorage.getItem("accessToken");
  }
  return null;
};

export const setAccessToken = (token: string): void => {
  accessToken = token;
  if (typeof window !== "undefined") {
    localStorage.setItem("accessToken", token);
  }
};

export const removeAccessToken = (): void => {
  accessToken = null;
  if (typeof window !== "undefined") {
    localStorage.removeItem("accessToken");
  }
};

// ---------- Axios Instance ----------
const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// ---------- Request Interceptor ----------
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getAccessToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

// ---------- Response Interceptor (Refresh Token Logic) ----------
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null): void => {
  failedQueue.forEach((promise) => {
    if (token) {
      promise.resolve(token);
    } else {
      promise.reject(error);
    }
  });
  failedQueue = [];
};

interface ApiErrorResponse {
  message?: string;
}

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiErrorResponse>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // Only attempt refresh on 401 and if we haven't already retried
    const isUnauthorized = error.response?.status === 401;
    const isNotRefreshEndpoint = !originalRequest.url?.includes("/auth/refresh-token");

    if (isUnauthorized && isNotRefreshEndpoint && !originalRequest._retry) {
      if (isRefreshing) {
        // Queue the request until the token is refreshed
        return new Promise<string>((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${token}`;
          }
          return axiosInstance(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const { data } = await axios.post<{ data: { accessToken: string } }>(
          `${BASE_URL}/auth/refresh-token`,
          {},
          { withCredentials: true }
        );

        const newToken = data.data.accessToken;
        setAccessToken(newToken);
        processQueue(null, newToken);

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
        }
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        removeAccessToken();

        // Redirect to login on client side
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
