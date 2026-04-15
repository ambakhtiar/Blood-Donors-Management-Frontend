import axiosInstance from "@/lib/axiosInstance";

export interface IInitiatePaymentPayload {
  postId: string;
  amount: number;
}

export interface IInitiatePaymentResponse {
  paymentUrl: string;
}

export const initiatePayment = async (
  payload: IInitiatePaymentPayload
): Promise<{ success: boolean; data: IInitiatePaymentResponse }> => {
  const { data } = await axiosInstance.post("/payments/initiate", payload);
  return data;
};
