import axiosInstance from "../lib/axiosInstance";

export interface IPostFilters {
  searchTerm?: string;
  type?: string;
  bloodGroup?: string;
  division?: string;
  district?: string;
  isResolved?: boolean;
  hasLiked?: boolean;
}

export interface ICommentPayload {
  postId: string;
  content: string;
  parentId?: string | null;
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
  return response.data;
};

export const getSinglePost = async (id: string): Promise<any> => {
  const response = await axiosInstance.get(`/posts/${id}`);
  return response.data;
};

export const toggleLike = async (postId: string): Promise<any> => {
  const response = await axiosInstance.post('/posts/engagement/like', { postId });
  return response.data;
};

export const addComment = async (payload: ICommentPayload): Promise<any> => {
  const response = await axiosInstance.post('/posts/engagement/comment', payload);
  return response.data;
};

export const getPostComments = async (postId: string): Promise<any> => {
  const response = await axiosInstance.get(`/posts/engagement/${postId}/comments`);
  return response.data;
};
