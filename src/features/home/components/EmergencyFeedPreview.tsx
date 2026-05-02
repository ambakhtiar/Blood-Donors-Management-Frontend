import Link from "next/link";
import { AlertTriangle, MapPin, Droplets, Clock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getAllPosts } from "@/services/post.service";
import { formatDistanceToNow } from "date-fns";
import { IPost, PostType } from "@/types/post.types";

const bloodGroupDisplay: Record<string, string> = {
  A_POSITIVE: "A+",
  A_NEGATIVE: "A-",
  B_POSITIVE: "B+",
  B_NEGATIVE: "B-",
  AB_POSITIVE: "AB+",
  AB_NEGATIVE: "AB-",
  O_POSITIVE: "O+",
  O_NEGATIVE: "O-",
};

export async function EmergencyFeedPreview() {
  let posts: IPost[] = [];
  try {
    const response = await getAllPosts({
      type: PostType.BLOOD_FINDING,
      limit: 3,
      sortBy: "createdAt",
      sortOrder: "desc",
      isResolved: false,
      isApproved: true
    });
    posts = response.data || [];
  } catch (error) {
    console.error("Error fetching emergency posts:", error);
  }

  return (
    <section className="py-24 bg-muted/20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-destructive opacity-75" />
                <span className="relative inline-flex h-3 w-3 rounded-full bg-destructive" />
              </span>
              <span className="text-xs font-bold uppercase tracking-widest text-destructive">
                Live Emergency Feed
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Recent Blood Requests</h2>
            <p className="text-muted-foreground max-w-xl">
              Urgent blood requirements from verified hospitals and individuals across the country. Every minute counts.
            </p>
          </div>
          <Button variant="outline" asChild className="h-11 px-6 rounded-xl group">
            <Link href="/feed?type=BLOOD_FINDING">
              Browse All Requests <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>

        {posts.length === 0 ? (
          <div className="text-center py-20 bg-background rounded-3xl border border-dashed border-border/60">
            <Droplets className="h-12 w-12 text-muted-foreground/40 mx-auto mb-4" />
            <p className="text-lg font-medium">No active emergency requests found.</p>
            <p className="text-sm text-muted-foreground mt-1">Check back later or check our full feed.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <Card key={post.id} className="group overflow-hidden border-border/40 hover:border-primary/40 transition-all duration-500 hover:shadow-xl hover:shadow-primary/5 bg-card">
                <CardContent className="p-0">
                  {/* Urgency Indicator */}
                  <div className="h-1.5 w-full bg-destructive" />

                  <div className="p-6 space-y-5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                          <Droplets className="h-6 w-6" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-muted-foreground uppercase">Required</p>
                          <p className="text-lg font-black text-primary leading-none">
                            {post.bloodGroup ? bloodGroupDisplay[post.bloodGroup] || post.bloodGroup : "Any Group"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground bg-muted px-2.5 py-1 rounded-full">
                        <Clock className="h-3 w-3" />
                        {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h3 className="font-bold text-lg line-clamp-1">{post.title || "Emergency Blood Required"}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                        {post.content || post.reason || "This is an urgent request for blood donation. Please contact the requester immediately if you can help."}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                      <MapPin className="h-4 w-4 text-primary" />
                      <span className="truncate">
                        {[post.upazila, post.district].filter(Boolean).join(", ") || "Location details hidden"}
                      </span>
                    </div>

                    <div className="pt-2 border-t border-border/50 flex items-center justify-between">
                      <span className="text-xs font-bold text-destructive bg-destructive/10 px-2 py-0.5 rounded">
                        {post.donationTimeType === "EMERGENCY" ? "EMERGENCY" : "URGENT"}
                      </span>
                      <Button size="sm" variant="link" className="text-primary font-bold p-0 group/btn" asChild>
                        <Link href={`/feed?postId=${post.id}`}>
                          Help Now <ArrowRight className="ml-1 h-3 w-3 transition-transform group-hover/btn:translate-x-1" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
