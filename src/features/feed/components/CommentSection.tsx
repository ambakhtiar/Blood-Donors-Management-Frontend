"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getPostComments, addComment, ICommentPayload } from "@/services/post.service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User2 } from "lucide-react"; // Using User2 as fallback
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";
import { useAuthContext } from "@/providers/AuthProvider";
import { useRouter } from "next/navigation";

interface CommentSectionProps {
  postId: string;
}

export function CommentSection({ postId }: CommentSectionProps) {
  const queryClient = useQueryClient();
  const { user } = useAuthContext();
  const router = useRouter();

  const [newComment, setNewComment] = useState("");
  const [replyTo, setReplyTo] = useState<{ id: string; name: string } | null>(null);

  const { data: comments, isLoading } = useQuery({
    queryKey: ["comments", postId],
    queryFn: () => getPostComments(postId),
  });

  const mutation = useMutation({
    mutationFn: (payload: ICommentPayload) => addComment(payload),
    onSuccess: (response, variables) => {
      setNewComment("");
      setReplyTo(null);
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
      queryClient.invalidateQueries({ queryKey: ["posts"] });

      const successMessage = variables.parentId
        ? "Reply added successfully!"
        : "Comment added successfully!";

      toast.success(successMessage);
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || "Something went wrong. Please try again.";
      toast.error(errorMessage);
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please login to comment");
      router.push("/login");
      return;
    }
    if (!newComment.trim()) return;

    const payload: ICommentPayload = {
      postId,
      content: newComment,
    };

    if (replyTo?.id) {
      payload.parentId = replyTo.id;
    }

    mutation.mutate(payload);
  };

  return (
    <div className="flex flex-col h-full bg-transparent border-t border-primary/5">
      {/* Comment List */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6">
        {isLoading ? (
          <div className="flex justify-center p-10"><span className="animate-spin">🔄</span></div>
        ) : comments?.data?.length === 0 ? (
          <div className="text-center text-muted-foreground py-20 font-medium italic">
            No comments yet. Be the first to share your thoughts!
          </div>
        ) : (
          comments?.data?.map((comment: any) => {
            const commenterName = comment.user?.donorProfile?.name || 
                                  comment.user?.hospital?.name || 
                                  comment.user?.organisation?.name || 
                                  comment.user?.admin?.name || "User";
            const commenterInitial = commenterName.charAt(0).toUpperCase();

            return (
              <div key={comment.id} className="space-y-4">
                <div className="flex gap-3">
                  <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center text-xs font-bold uppercase overflow-hidden shrink-0 border border-primary/10">
                    {comment.user?.profilePictureUrl ? (
                      <img 
                        src={comment.user.profilePictureUrl} 
                        alt={commenterName} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      commenterInitial
                    )}
                  </div>
                  <div className="flex-1 bg-secondary/30 p-4 rounded-2xl rounded-tl-none border border-primary/10 shadow-sm">
                    <div className="flex flex-wrap justify-between items-start gap-x-4 gap-y-1 mb-1.5">
                      <span className="font-bold text-[13px] md:text-sm text-primary/90 leading-tight">
                        {commenterName}
                      </span>
                      <span className="text-[10px] text-muted-foreground font-medium shrink-0">
                        {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                      </span>
                    </div>
                    <p className="text-[13px] md:text-sm text-foreground/90 leading-relaxed">{comment.content}</p>
                    <div className="flex items-center gap-4 mt-2.5">
                      <button
                        onClick={() => setReplyTo({ id: comment.id, name: commenterName })}
                        className="text-[10px] font-bold text-primary hover:text-primary/70 transition-colors"
                      >
                        Reply
                      </button>
                    </div>
                  </div>
                </div>

                {/* Nested Replies (1 Level Only) */}
                {comment.replies?.length > 0 && (
                  <div className="ml-11 space-y-4 border-l-2 border-primary/10 pl-4 mt-2">
                    {comment.replies.map((reply: any) => {
                      const replyName = reply.user?.donorProfile?.name || 
                                        reply.user?.hospital?.name || 
                                        reply.user?.organisation?.name || 
                                        reply.user?.admin?.name || "User";
                      const replyInitial = replyName.charAt(0).toUpperCase();
                      
                      return (
                        <div key={reply.id} className="flex gap-2">
                          <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-bold uppercase shrink-0 overflow-hidden border border-primary/5">
                            {reply.user?.profilePictureUrl ? (
                              <img 
                                src={reply.user.profilePictureUrl} 
                                alt={replyName} 
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              replyInitial
                            )}
                          </div>
                          <div className="flex-1 bg-primary/5 p-2.5 rounded-xl rounded-tl-none">
                            <div className="flex justify-between items-baseline mb-0.5">
                              <span className="font-bold text-[11px] text-primary/70">
                                {replyName}
                              </span>
                            </div>
                            <p className="text-xs text-foreground/90">{reply.content}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Input Form */}
      <div className="p-4 border-t bg-card sticky bottom-0 shadow-[0_-4px_12px_rgba(0,0,0,0.05)]">
        {replyTo && (
          <div className="flex justify-between items-center mb-2 bg-primary/5 px-3 py-1.5 rounded-md border border-primary/10">
            <span className="text-xs text-muted-foreground">Replying to <span className="font-bold text-primary">{replyTo.name}</span></span>
            <button onClick={() => setReplyTo(null)} className="text-xs font-bold text-destructive">Cancel</button>
          </div>
        )}
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder={replyTo ? "Write a reply..." : "Add a comment..."}
            className="flex-1 bg-secondary/40 border-primary/10 rounded-full h-10 px-4 focus:bg-background transition-all"
          />
          <Button
            disabled={mutation.isPending || !newComment.trim()}
            className="rounded-full px-5 h-10 bg-primary font-bold shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all"
          >
            {mutation.isPending ? "..." : "Post"}
          </Button>
        </form>
      </div>
    </div>
  );
}
