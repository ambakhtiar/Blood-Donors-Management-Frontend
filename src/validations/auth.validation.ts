import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  contactNumber: z.string().optional().or(z.literal("")),
  password: z.string().min(6, "Password must be at least 6 characters"),
}).superRefine((data, ctx) => {
  if (!data.email && !data.contactNumber) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["contactNumber"],
      message: "Email or contact number is required to login",
    });
  }
});

const baseRegisterSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  contactNumber: z.string().min(10, "Contact number is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["USER", "HOSPITAL", "ORGANISATION"]),
  division: z.string().min(1, "Division is required").optional(),
  district: z.string().min(1, "District is required").optional(),
  upazila: z.string().min(1, "Upazila is required").optional(),
});

export const registerSchema = z.intersection(
  baseRegisterSchema,
  z.discriminatedUnion("role", [
    z.object({
      role: z.literal("USER"),
      bloodGroup: z.enum([
        "A_POSITIVE", "A_NEGATIVE", "B_POSITIVE", "B_NEGATIVE",
        "AB_POSITIVE", "AB_NEGATIVE", "O_POSITIVE", "O_NEGATIVE"
      ], { message: "Blood group is required" }),
      gender: z.enum(["MALE", "FEMALE"], { message: "Gender is required" }),
    }),
    z.object({
      role: z.literal("HOSPITAL"),
      registrationNumber: z.string().optional(),
      address: z.string().min(1, "Address is required"),
    }),
    z.object({
      role: z.literal("ORGANISATION"),
      registrationNumber: z.string().optional(),
      establishedYear: z.string().optional(),
    }),
  ])
);

export type LoginFormValues = z.infer<typeof loginSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>;
