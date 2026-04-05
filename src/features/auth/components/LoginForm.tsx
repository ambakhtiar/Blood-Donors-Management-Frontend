"use client";

import { useForm } from "@tanstack/react-form";
import { zodValidator } from "@tanstack/zod-form-adapter";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { loginSchema } from "@/validations/auth.validation";
import { loginApi } from "@/services/auth.service";
import { setAccessToken } from "@/lib/axiosInstance";
import { Button } from "@/components/ui/button";

export function LoginForm() {
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: loginApi,
    onSuccess: (data) => {
      if (data?.data?.accessToken) {
        setAccessToken(data.data.accessToken);
      }
      toast.success("Logged in successfully!");
      router.push("/");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Login failed, please try again.");
    },
  });

  const form = useForm({
    defaultValues: {
      email: "",
      contactNumber: "",
      password: "",
    },
    validatorAdapter: zodValidator(),
    validators: {
      onChangeAsync: loginSchema,
    },
    onSubmit: async ({ value }: any) => {
      mutation.mutate(value);
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
      className="space-y-6"
    >
      <div className="space-y-4">
        {/* Email Field */}
        <form.Field
          name="email"
          children={(field: any) => (
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none">Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
              {field.state.meta.errors.length > 0 && (
                <p className="text-sm text-destructive">{field.state.meta.errors.join(", ")}</p>
              )}
            </div>
          )}
        />

        {/* Contact Number Field */}
        <form.Field
          name="contactNumber"
          children={(field: any) => (
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none">Or Contact Number</label>
              <input
                type="text"
                placeholder="+880 1XXX-XXXXXX"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
              {field.state.meta.errors.length > 0 && (
                <p className="text-sm text-destructive">{field.state.meta.errors.join(", ")}</p>
              )}
            </div>
          )}
        />

        {/* Password Field */}
        <form.Field
          name="password"
          children={(field: any) => (
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none">Password</label>
              <input
                type="password"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
              {field.state.meta.errors.length > 0 && (
                <p className="text-sm text-destructive">{field.state.meta.errors.join(", ")}</p>
              )}
            </div>
          )}
        />
      </div>

      <form.Subscribe
        selector={(state: any) => [state.canSubmit, state.isSubmitting]}
        children={([canSubmit, isSubmitting]: any) => (
          <Button
            type="submit"
            className="w-full h-11"
            disabled={!canSubmit || mutation.isPending || (isSubmitting as boolean)}
          >
            {(mutation.isPending || !!isSubmitting) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Sign In
          </Button>
        )}
      />
    </form>
  );
}
