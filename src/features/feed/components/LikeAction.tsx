"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toggleLike } from "@/services/post.service";
import { toast } from "sonner"; // Assuming sonner is used, if not we'll fallback to alert
import { useAuthContext } from "@/providers/AuthProvider";
import { useRouter } from "next/navigation";

interface LikeActionProps {
  postId: string;
  initialLikes: number;
  initialHasLiked: boolean;
}

export function LikeAction({ postId, initialLikes, initialHasLiked }: LikeActionProps) {
  const queryClient = useQueryClient();
  const { user } = useAuthContext();
  const router = useRouter();

  const [hasLiked, setHasLiked] = useState(initialHasLiked);
  const [likesCount, setLikesCount] = useState(initialLikes);

  const mutation = useMutation({
    mutationFn: () => toggleLike(postId),
    onMutate: async () => {
      // Optimistic update
      const previousHasLiked = hasLiked;
      const previousCount = likesCount;

      setHasLiked(!previousHasLiked);
      setLikesCount(prev => previousHasLiked ? prev - 1 : prev + 1);

      return { previousHasLiked, previousCount };
    },
    onError: (error: any, variables, context) => {
      // Rollback on error
      if (context) {
        setHasLiked(context.previousHasLiked);
        setLikesCount(context.previousCount);
      }
      // Silently handle error as per user request to remove toasts from Like
    },
    onSuccess: (data) => {
      // Background sync
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    }
  });

  const handleLike = () => {
    if (!user) {
      toast.error("Please login to like this post");
      router.push("/login");
      return;
    }
    mutation.mutate();
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleLike}
      disabled={mutation.isPending}
      className={`flex-1 rounded-none hover:bg-primary/5 transition-all group py-5 ${hasLiked ? 'text-primary' : 'text-muted-foreground'}`}
    >
      <Heart className={`w-4 h-4 mr-2 ${hasLiked ? 'fill-primary' : 'group-hover:fill-primary/20'} transition-all duration-300 ${mutation.isPending ? 'scale-90' : 'scale-100 hover:scale-110'}`} />
      <div className="flex items-baseline gap-1">
        <span className="font-bold">{likesCount}</span>
        <span className="text-xs hidden sm:inline">{likesCount === 1 ? 'Like' : 'Likes'}</span>
      </div>
    </Button>
  );
}
