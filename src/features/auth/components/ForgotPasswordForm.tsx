"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { forgotPasswordApi, resetPasswordApi } from "@/services/auth.service";
import {
  forgotPasswordSchema,
  resetPasswordSchema,
} from "@/validations/auth.validation";
import Link from "next/link";

const inputClass =
  "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";

type Step = "EMAIL" | "OTP_VERIFICATION";

export function ForgotPasswordForm() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("EMAIL");
  const [email, setEmail] = useState("");
  const [userId, setUserId] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  // 1. Mutation for sending OTP
  const forgotMutation = useMutation({
    mutationFn: async (emailData: string) => {
      return await forgotPasswordApi(emailData);
    },
    onSuccess: (response) => {
      // The backend returns the id in response.data.id
      if (response?.data?.id) {
        setUserId(response.data.id);
        toast.success(response.message || "OTP sent successfully to your email!");
        setStep("OTP_VERIFICATION");
        setErrors({});
      } else {
        toast.error("Something went wrong. Try again.");
      }
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message || "Failed to send reset email. Make sure the email is registered.";
      toast.error(message);
    },
  });

  // 2. Mutation for resetting password
  const resetMutation = useMutation({
    mutationFn: async () => {
      return await resetPasswordApi({ id: userId, token: otp, newPassword });
    },
    onSuccess: (response) => {
      toast.success(response.message || "Password reset successfully! You can now log in.");
      router.push("/auth/login");
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message ||
        error.response?.data?.errorDetails?.message ||
        "Failed to reset password. Check your OTP.";
      toast.error(message);
    },
  });

  // Handle Step 1 Submit
  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = forgotPasswordSchema.safeParse({ email });
    if (!result.success) {
      setErrors({ email: result.error.issues[0].message });
      return;
    }
    setErrors({});
    forgotMutation.mutate(email);
  };

  // Handle Step 2 Submit
  const handleResetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = resetPasswordSchema.safeParse({ token: otp, newPassword });
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((i) => {
        fieldErrors[String(i.path[0])] = i.message;
      });
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    resetMutation.mutate();
  };

  return (
    <div className="w-full">
      {step === "EMAIL" && (
        <form onSubmit={handleEmailSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Registered Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClass}
            />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email}</p>
            )}
          </div>
          <Button
            type="submit"
            className="w-full"
            disabled={forgotMutation.isPending}
          >
            {forgotMutation.isPending && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Send OTP
          </Button>

          <p className="text-center text-sm text-muted-foreground mt-4">
            Remember your password?{" "}
            <Link
              href="/auth/login"
              className="text-primary underline hover:text-primary/90"
            >
              Log in
            </Link>
          </p>
        </form>
      )}

      {step === "OTP_VERIFICATION" && (
        <form onSubmit={handleResetSubmit} className="space-y-4">
          <p className="text-sm text-muted-foreground mb-4">
            We've sent a 6-digit OTP to <strong>{email}</strong>.
          </p>

          <div className="space-y-2">
            <label className="text-sm font-medium">6-Digit OTP</label>
            <input
              type="text"
              placeholder="123456"
              maxLength={6}
              value={otp}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, "");
                setOtp(val);
              }}
              className={inputClass}
            />
            {errors.token && (
              <p className="text-sm text-destructive">{errors.token}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">New Password</label>
            <input
              type="password"
              placeholder="Min 6 characters"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className={inputClass}
            />
            {errors.newPassword && (
              <p className="text-sm text-destructive">{errors.newPassword}</p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={resetMutation.isPending}
          >
            {resetMutation.isPending && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Verify & Reset Password
          </Button>

          <p className="text-center text-sm text-muted-foreground mt-4">
            <button
              type="button"
              onClick={() => {
                setStep("EMAIL");
                setErrors({});
                setOtp("");
                setNewPassword("");
              }}
              className="mt-2 text-sm text-primary flex items-center justify-center gap-1 w-full"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Email
            </button>
          </p>
        </form>
      )}
    </div>
  );
}
