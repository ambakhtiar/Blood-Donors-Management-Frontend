import axiosInstance from "@/lib/axiosInstance";
import { ApiResponse } from "@/types";
import { INotification } from "@/types/notification.types";

export const getNotifications = async (): Promise<ApiResponse<INotification[]>> => {
  const { data } = await axiosInstance.get("/notifications");
  return data;
};

export const markAsRead = async (id: string): Promise<ApiResponse<null>> => {
  const { data } = await axiosInstance.patch(`/notifications/${id}`);
  return data;
};

export const markAllRead = async (): Promise<ApiResponse<null>> => {
  const { data } = await axiosInstance.patch("/notifications/mark-all-read");
  return data;
};
