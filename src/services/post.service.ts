import axiosInstance from "../lib/axiosInstance";

export interface IPostFilters {
  searchTerm?: string;
  type?: string;
  bloodGroup?: string;
  division?: string;
  district?: string;
  isResolved?: boolean;
}

export const getAllPosts = async (filters?: IPostFilters): Promise<any> => {
  const params = new URLSearchParams();

  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== "") {
        params.append(key, String(value));
      }
    });
  }

  const response = await axiosInstance.get(`/posts?${params.toString()}`);
  console.log(response.data);
  return response.data;
};
