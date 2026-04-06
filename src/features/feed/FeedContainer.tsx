"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAllPosts, IPostFilters } from "@/services/post.service";
import { PostCard } from "./components/PostCard";
import { PostCardSkeleton } from "./components/PostCardSkeleton";
import { FeedFilters } from "./components/FeedFilters";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function FeedContainer() {
  const [filters, setFilters] = useState<IPostFilters>({
    searchTerm: "",
    type: "",
    bloodGroup: "",
  });

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["posts", filters],
    queryFn: () => getAllPosts(filters),
  });

  const posts = data?.data || [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 max-w-7xl mx-auto py-8 px-4 sm:px-6">
      {/* Left Sidebar: Filters */}
      <aside className="hidden lg:block lg:col-span-1">
        <FeedFilters filters={filters} onChange={setFilters} />
      </aside>

      {/* Center Column: Feed */}
      <main className="lg:col-span-2 space-y-6">
        {/* Mobile Filters (Optional, can be expanded later via a drawer if needed) */}
        <div className="lg:hidden mb-6">
          <FeedFilters filters={filters} onChange={setFilters} />
        </div>

        {/* Create Post Interface Placeholder */}
        <div className="bg-card rounded-xl border border-primary/10 p-4 shadow-sm mb-6 cursor-pointer hover:bg-card/80 transition-colors">
          <div className="flex gap-3 items-center">
             <div className="h-10 w-10 flex items-center justify-center rounded-full bg-primary/10 text-primary font-bold">
               C
             </div>
             <div className="bg-secondary/40 hover:bg-secondary/60 text-muted-foreground w-full py-2.5 px-4 rounded-full transition-colors">
                What kind of help or donation do you need?
             </div>
          </div>
        </div>

        {/* Feed States */}
        {isLoading && (
          <div>
            <PostCardSkeleton />
            <PostCardSkeleton />
            <PostCardSkeleton />
          </div>
        )}

        {isError && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-8 text-center flex flex-col items-center justify-center">
            <AlertCircle className="w-12 h-12 text-destructive mb-3" />
            <h3 className="font-semibold text-lg">Failed to load feed</h3>
            <p className="text-muted-foreground mt-1 mb-4">Please try again.</p>
            <Button onClick={() => refetch()} variant="outline" className="gap-2">
              <RefreshCw className="w-4 h-4" /> Retry
            </Button>
          </div>
        )}

        {!isLoading && !isError && posts.length === 0 && (
          <div className="bg-card rounded-xl border border-primary/10 p-12 text-center flex flex-col items-center shadow-sm">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <span className="text-2xl">📭</span>
            </div>
            <h3 className="font-semibold text-xl text-foreground">No posts available</h3>
            <p className="text-muted-foreground mt-2">Check back later or expand your search filters.</p>
          </div>
        )}

        {!isLoading && !isError && posts.length > 0 && (
          <div className="space-y-4">
            {posts.map((post: any) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </main>

      {/* Right Sidebar: Extras */}
      <aside className="hidden lg:block lg:col-span-1">
         <div className="bg-card rounded-xl border border-primary/10 p-5 shadow-sm sticky top-20">
            <h3 className="font-semibold text-lg mb-4">Sponsored</h3>
            <div className="aspect-square bg-secondary/30 flex items-center justify-center rounded-md text-sm text-muted-foreground">
              Ad Placeholder
            </div>
         </div>
      </aside>
    </div>
  );
}
