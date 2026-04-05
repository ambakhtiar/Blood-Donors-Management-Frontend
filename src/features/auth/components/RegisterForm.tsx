"use client";

import { useForm } from "@tanstack/react-form";
import { zodValidator } from "@tanstack/zod-form-adapter";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { registerSchema } from "@/validations/auth.validation";
import { registerApi } from "@/services/auth.service";
import { Button } from "@/components/ui/button";

export function RegisterForm() {
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: registerApi,
    onSuccess: () => {
      toast.success("Account created successfully. Please login.");
      router.push("/login");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Registration failed, please try again.");
    },
  });

  const form = useForm({
    defaultValues: {
      role: "USER" as "USER" | "HOSPITAL" | "ORGANISATION",
      email: "",
      name: "",
      contactNumber: "",
      password: "",
      division: "",
      district: "",
      upazila: "",
      // Optional/Dynamic fields combined
      bloodGroup: "",
      gender: "",
      registrationNumber: "",
      address: "",
      establishedYear: "",
    },
    validatorAdapter: zodValidator(),
    validators: {
      onChange: registerSchema as any,
    },
    onSubmit: async ({ value }: any) => {
      mutation.mutate(value as any);
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
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        
        {/* Role Field */}
        <form.Field
          name="role"
          children={(field: any) => (
            <div className="space-y-2 sm:col-span-2">
              <label className="text-sm font-medium leading-none">I am registering as a</label>
              <select
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value as any)}
                onBlur={field.handleBlur}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="USER">Personal Donor / User</option>
                <option value="HOSPITAL">Hospital</option>
                <option value="ORGANISATION">Organisation</option>
              </select>
            </div>
          )}
        />

        <form.Subscribe
          selector={(state: any) => state.values.role}
          children={(role: any) => (
            <>
              {/* Name Field */}
              <form.Field
                name="name"
                children={(field: any) => (
                  <div className="space-y-2 sm:col-span-2">
                    <label className="text-sm font-medium leading-none">
                      {role === "HOSPITAL" ? "Hospital Name" : role === "ORGANISATION" ? "Organisation Name" : "Full Name"}
                    </label>
                    <input
                      type="text"
                      placeholder="John Doe"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                    />
                    {field.state.meta.errors.length > 0 && <p className="text-sm text-destructive">{field.state.meta.errors.join(", ")}</p>}
                  </div>
                )}
              />

              {/* Contact Number Field */}
              <form.Field
                name="contactNumber"
                children={(field: any) => (
                  <div className="space-y-2 relative">
                    <label className="text-sm font-medium leading-none">Contact Number</label>
                    <input
                      type="text"
                      placeholder="+8801XXXXXXXXX"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                    />
                    {field.state.meta.errors.length > 0 && <p className="text-sm text-destructive absolute top-full mt-1.5">{field.state.meta.errors.join(", ")}</p>}
                  </div>
                )}
              />

              {/* Email Address Field */}
              <form.Field
                name="email"
                children={(field: any) => (
                  <div className="space-y-2 relative">
                    <label className="text-sm font-medium leading-none">Email Address</label>
                    <input
                      type="email"
                      placeholder="you@example.com"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                    />
                    {field.state.meta.errors.length > 0 && <p className="text-sm text-destructive absolute top-full mt-1.5">{field.state.meta.errors.join(", ")}</p>}
                  </div>
                )}
              />

              {/* Password Field */}
              <form.Field
                name="password"
                children={(field: any) => (
                  <div className="space-y-2 sm:col-span-2">
                    <label className="text-sm font-medium leading-none">Password</label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                    />
                    {field.state.meta.errors.length > 0 && <p className="text-sm text-destructive">{field.state.meta.errors.join(", ")}</p>}
                  </div>
                )}
              />

              {/* Dynamic Fields */}
              {role === "USER" && (
                <>
                  <form.Field
                    name="bloodGroup"
                    children={(field: any) => (
                      <div className="space-y-2 relative">
                        <label className="text-sm font-medium leading-none">Blood Group</label>
                        <select
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                          onBlur={field.handleBlur}
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                        >
                          <option value="">Select Blood Group</option>
                          <option value="A_POSITIVE">A+</option>
                          <option value="A_NEGATIVE">A-</option>
                          <option value="B_POSITIVE">B+</option>
                          <option value="B_NEGATIVE">B-</option>
                          <option value="AB_POSITIVE">AB+</option>
                          <option value="AB_NEGATIVE">AB-</option>
                          <option value="O_POSITIVE">O+</option>
                          <option value="O_NEGATIVE">O-</option>
                        </select>
                        {field.state.meta.errors.length > 0 && <p className="text-sm text-destructive absolute top-full mt-1">{field.state.meta.errors.join(", ")}</p>}
                      </div>
                    )}
                  />

                  <form.Field
                    name="gender"
                    children={(field: any) => (
                      <div className="space-y-2 relative">
                        <label className="text-sm font-medium leading-none">Gender</label>
                        <select
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                          onBlur={field.handleBlur}
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                        >
                          <option value="">Select Gender</option>
                          <option value="MALE">Male</option>
                          <option value="FEMALE">Female</option>
                        </select>
                        {field.state.meta.errors.length > 0 && <p className="text-sm text-destructive absolute top-full mt-1">{field.state.meta.errors.join(", ")}</p>}
                      </div>
                    )}
                  />
                </>
              )}

              {role === "HOSPITAL" && (
                <>
                  <form.Field
                    name="registrationNumber"
                    children={(field: any) => (
                      <div className="space-y-2 relative">
                        <label className="text-sm font-medium leading-none">Registration Number (Optional)</label>
                        <input
                          type="text"
                          placeholder="REG-XXXX"
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                          onBlur={field.handleBlur}
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                        />
                      </div>
                    )}
                  />
                  <form.Field
                    name="address"
                    children={(field: any) => (
                      <div className="space-y-2 relative">
                        <label className="text-sm font-medium leading-none">Full Address</label>
                        <input
                          type="text"
                          placeholder="123 Hospital Road, Dhaka"
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                          onBlur={field.handleBlur}
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                        />
                        {field.state.meta.errors.length > 0 && <p className="text-sm text-destructive absolute top-full mt-1">{field.state.meta.errors.join(", ")}</p>}
                      </div>
                    )}
                  />
                </>
              )}

              {role === "ORGANISATION" && (
                <>
                  <form.Field
                    name="registrationNumber"
                    children={(field: any) => (
                      <div className="space-y-2 relative">
                        <label className="text-sm font-medium leading-none">Registration Number (Optional)</label>
                        <input
                          type="text"
                          placeholder="GOV-XXXX"
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                          onBlur={field.handleBlur}
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                        />
                      </div>
                    )}
                  />
                  <form.Field
                    name="establishedYear"
                    children={(field: any) => (
                      <div className="space-y-2 relative">
                        <label className="text-sm font-medium leading-none">Established Year (Optional)</label>
                        <input
                          type="text"
                          placeholder="2015"
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                          onBlur={field.handleBlur}
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                        />
                      </div>
                    )}
                  />
                </>
              )}

              {/* Shared Locations */}
              <div className="space-y-2 sm:col-span-2 border-t pt-4 mt-2">
                <p className="text-sm font-medium leading-none text-muted-foreground mb-4">Location Details (Optional)</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <form.Field
                    name="division"
                    children={(field: any) => (
                      <input type="text" placeholder="Division" value={field.state.value} onChange={(e) => field.handleChange(e.target.value)} onBlur={field.handleBlur} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background" />
                    )}
                  />
                  <form.Field
                    name="district"
                    children={(field: any) => (
                      <input type="text" placeholder="District" value={field.state.value} onChange={(e) => field.handleChange(e.target.value)} onBlur={field.handleBlur} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background" />
                    )}
                  />
                  <form.Field
                    name="upazila"
                    children={(field: any) => (
                      <input type="text" placeholder="Upazila" value={field.state.value} onChange={(e) => field.handleChange(e.target.value)} onBlur={field.handleBlur} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background" />
                    )}
                  />
                </div>
              </div>
            </>
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
            Create Account
          </Button>
        )}
      />
    </form>
  );
}
