import FeedContainer from "@/features/feed/FeedContainer";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Public Feed - BloodLink",
  description: "View the latest blood requests, donations, and help posts on BloodLink.",
};

export default function FeedPage() {

  return (
    <main className="min-h-screen bg-background">
      <FeedContainer />
    </main>
  );
}
