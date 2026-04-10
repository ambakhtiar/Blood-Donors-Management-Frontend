import { ProfileDetails } from "@/features/profile/components/ProfileDetails";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Profile | BloodLink",
  description: "View and manage your BloodLink profile and donation settings.",
};

export default function ProfilePage() {
  return (
    <main className="min-h-screen pt-12 pb-24 px-4 sm:px-6">
      <div className="container mx-auto">
        <ProfileDetails />
      </div>
    </main>
  );
}
