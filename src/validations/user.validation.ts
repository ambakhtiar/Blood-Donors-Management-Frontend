import { z } from "zod";

// Base schema for shared user fields
const baseUpdateSchema = z.object({
  profilePictureUrl: z.string().url("Invalid image URL").optional().or(z.literal("")),
  division: z.string().min(1, "Division is required").optional(),
  district: z.string().min(1, "District is required").optional(),
  upazila: z.string().min(1, "Upazila is required").optional(),
});

// Schema for USER (DonorProfile)
const donorProfileSchema = z.object({
  name: z.string().min(2, "Name is required").optional(),
  weight: z.number().min(30).max(200).nullable().optional(),
  isAvailableForDonation: z.boolean().optional(),
  lastDonationDate: z.string().nullable().optional(),
});

// Schema for HOSPITAL
const hospitalSchema = z.object({
  name: z.string().min(2, "Hospital name is required").optional(),
  registrationNumber: z.string().optional(),
  address: z.string().min(5, "Address must be at least 5 characters").optional(),
});

// Schema for ORGANISATION
const organisationSchema = z.object({
  name: z.string().min(2, "Organisation name is required").optional(),
  registrationNumber: z.string().optional(),
  establishedYear: z.string().optional(),
});

// Main dynamic schema
export const updateProfileSchema = z.object({
  ...baseUpdateSchema.shape,
  donorProfile: donorProfileSchema.optional(),
  hospital: hospitalSchema.optional(),
  organisation: organisationSchema.optional(),
  // ADMIN/SUPER_ADMIN only need base fields or specific name/contact update if available
  name: z.string().min(2, "Name is required").optional(), 
});

export type UpdateProfileFormValues = z.infer<typeof updateProfileSchema>;
