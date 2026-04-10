"use client";

import { useQuery } from "@tanstack/react-query";
import { getSinglePost } from "@/services/post.service";
import { PostCard } from "./components/PostCard";
import { CommentSection } from "./components/CommentSection";
import { AlertCircle, ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function PostDetailsContainer({ postId }: { postId: string }) {
  const router = useRouter();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["post", postId],
    queryFn: () => getSinglePost(postId),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isError || !data?.data) {
    return (
      <div className="flex flex-col items-center justify-center p-20 text-center bg-card rounded-xl border border-primary/10">
        <AlertCircle className="w-12 h-12 text-destructive mb-4" />
        <h2 className="text-xl font-bold mb-2">Post Not Found</h2>
        <p className="text-muted-foreground mb-6">This post may have been deleted or is unavailable.</p>
        <Button onClick={() => router.push('/feed')} variant="outline">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Feed
        </Button>
      </div>
    );
  }

  const post = data?.data || (data?.id ? data : null);

  if (!post) {
    return (
      <div className="flex flex-col items-center justify-center p-20 text-center bg-card rounded-xl border border-primary/10">
        <AlertCircle className="w-12 h-12 text-destructive mb-4" />
        <h2 className="text-xl font-bold mb-2">Post Not Found</h2>
        <p className="text-muted-foreground mb-6">This post may have been deleted or is unavailable.</p>
        <Button onClick={() => router.push('/feed')} variant="outline" className="rounded-full">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Feed
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-8">
      <div className="flex items-center justify-between mb-8">
        <Button
          variant="ghost"
          className="hover:bg-primary/5 -ml-3 group text-muted-foreground hover:text-primary transition-colors text-base font-medium"
          onClick={() => router.back()}
        >
          <ArrowLeft className="w-5 h-5 mr-1 group-hover:-translate-x-1 transition-transform" />
          Back to Feed
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">

        {/* Left Column: Post Details */}
        <div className="flex flex-col gap-6 min-w-50">
          <div className="bg-card rounded-2xl border border-primary/5 shadow-md overflow-hidden">
            <PostCard post={post} />
          </div>
        </div>

        {/* Right Column: Comments Sidebar */}
        <div className="sticky top-24 space-y-6 min-w-50">
          <div className="bg-card rounded-2xl border border-primary/10 shadow-lg overflow-hidden flex flex-col h-[calc(100vh-160px)] min-h-[500px]">
            <div className="px-6 py-5 border-b border-primary/5 bg-secondary/5 flex items-center justify-between shrink-0">
              <h3 className="font-bold text-xl flex items-center gap-2 text-foreground">
                Discussion
                <span className="bg-primary/10 text-primary text-[11px] px-2.5 py-0.5 rounded-full font-bold">
                  {post._count?.comments || 0}
                </span>
              </h3>
            </div>
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              <CommentSection postId={post.id} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}