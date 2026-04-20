import axiosInstance from "@/lib/axiosInstance";

export interface UploadSignature {
  signature: string;
  timestamp: number;
  cloudName: string;
  apiKey: string;
  folder: string;
}

/** Step 1: Ask the backend to sign an upload request. */
const getUploadSignature = async (): Promise<UploadSignature> => {
  const res = await axiosInstance.post<{ data: UploadSignature }>(
    "/upload/signature"
  );
  return res.data.data;
};

/** Step 2: Upload a file directly to Cloudinary using the signed params. */
export const uploadImage = async (file: File): Promise<string> => {
  const sig = await getUploadSignature();

  const formData = new FormData();
  formData.append("file", file);
  formData.append("api_key", sig.apiKey);
  formData.append("timestamp", String(sig.timestamp));
  formData.append("signature", sig.signature);
  formData.append("folder", sig.folder);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${sig.cloudName}/image/upload`,
    { method: "POST", body: formData }
  );

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error?.message ?? "Image upload failed");
  }

  const data = await res.json();
  return data.secure_url as string;
};

/** Delete an uploaded image via backend (so API secret stays server-side). */
export const deleteUploadedImage = async (publicId: string): Promise<void> => {
  await axiosInstance.delete("/upload/destroy", { data: { publicId } });
};
