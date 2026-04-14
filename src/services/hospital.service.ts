import axiosInstance from "@/lib/axiosInstance";
import type { ApiResponse, IHospitalDonationRecord, IRecordDonationPayload } from "@/types";

/**
 * Record a blood donation from a donor.
 */
export const recordDonation = async (payload: IRecordDonationPayload) => {
  const response = await axiosInstance.post<ApiResponse<IHospitalDonationRecord>>(
    "/hospitals/donation-records",
    payload
  );
  return response.data;
};

/**
 * Fetch all donation records for the current hospital.
 */
export const getHospitalDonationRecords = async () => {
  const response = await axiosInstance.get<ApiResponse<{ data: IHospitalDonationRecord[]; meta: any }>>(
    "/hospitals/donation-records"
  );
  return response.data;
};

/**
 * Update a donation record (updates donor profile).
 */
export const updateDonationRecord = async ({ id, payload }: { id: string; payload: any }) => {
  const response = await axiosInstance.patch<ApiResponse<any>>(
    `/hospitals/donation-records/${id}`,
    payload
  );
  return response.data;
};

/**
 * Soft delete a donation record.
 */
export const deleteDonationRecord = async (id: string) => {
  const response = await axiosInstance.delete<ApiResponse<any>>(
    `/hospitals/donation-records/${id}`
  );
  return response.data;
};
