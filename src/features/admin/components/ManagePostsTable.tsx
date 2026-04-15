"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  ShieldCheck,
  ShieldOff,
  BadgeCheck,
  BadgeX,
  Eye,
  EyeOff,
  Clock,
  MapPin,
  User,
  Search,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  getAllPosts,
  approvePost,
  verifyPost,
  toggleDeletePost,
} from "@/services/post.service";
import { PostType, postTypeDisplayMap } from "@/types/post.types";
import { format } from "date-fns";
import Link from "next/link";

type ActionType = "approve" | "verify" | "delete" | null;

interface PendingAction {
  type: ActionType;
  postId: string;
  currentState: boolean;
}

export function ManagePostsTable() {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("ALL");
  const [page, setPage] = useState(1);
  const [pendingAction, setPendingAction] = useState<PendingAction | null>(null);
  const queryClient = useQueryClient();

  const { data: postsRes, isLoading } = useQuery({
    queryKey: ["admin-posts", searchTerm, typeFilter, page],
    queryFn: () =>
      getAllPosts({
        searchTerm,
        type: typeFilter === "ALL" ? undefined : typeFilter,
        page,
        limit: 10,
      }),
  });

  const approveMutation = useMutation({
    mutationFn: ({ id }: { id: string; currentState: boolean }) => approvePost(id),
    onSuccess: (res, variables) => {
      variables.currentState
        ? toast.error("Post approval withdrawn successfully")
        : toast.success("Post approved successfully");
      queryClient.invalidateQueries({ queryKey: ["admin-posts"] });
      setPendingAction(null);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update approval");
      setPendingAction(null);
    },
  });

  const verifyMutation = useMutation({
    mutationFn: ({ id }: { id: string; currentState: boolean }) => verifyPost(id),
    onSuccess: (res, variables) => {
      variables.currentState
        ? toast.error("Post verification removed successfully")
        : toast.success("Post verified successfully");
      queryClient.invalidateQueries({ queryKey: ["admin-posts"] });
      setPendingAction(null);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update verification");
      setPendingAction(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: ({ id }: { id: string; currentState: boolean }) => toggleDeletePost(id),
    onSuccess: (res, variables) => {
      variables.currentState
        ? toast.success("Post restored successfully")
        : toast.error("Post deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["admin-posts"] });
      setPendingAction(null);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update post");
      setPendingAction(null);
    },
  });

  const handleConfirm = () => {
    if (!pendingAction) return;
    if (pendingAction.type === "approve") approveMutation.mutate({ id: pendingAction.postId, currentState: pendingAction.currentState });
    else if (pendingAction.type === "verify") verifyMutation.mutate({ id: pendingAction.postId, currentState: pendingAction.currentState });
    else if (pendingAction.type === "delete") deleteMutation.mutate({ id: pendingAction.postId, currentState: pendingAction.currentState });
  };

  const isAnyPending =
    approveMutation.isPending || verifyMutation.isPending || deleteMutation.isPending;

  const getDialogContent = () => {
    if (!pendingAction) return { title: "", description: "", actionLabel: "" };
    const { type, currentState } = pendingAction;

    if (type === "approve") {
      return currentState
        ? {
          title: "Withdraw Approval?",
          description: "This post will no longer appear as approved. It will be hidden from the public feed.",
          actionLabel: "Withdraw Approval",
          actionClass: "bg-amber-600 hover:bg-amber-700",
        }
        : {
          title: "Approve this Post?",
          description: "This post will be marked as approved and become visible to all users in the feed.",
          actionLabel: "Approve Post",
          actionClass: "bg-green-600 hover:bg-green-700",
        };
    }
    if (type === "verify") {
      return currentState
        ? {
          title: "Remove Verification?",
          description: "The verified badge will be removed from this post.",
          actionLabel: "Remove Verification",
          actionClass: "bg-amber-600 hover:bg-amber-700",
        }
        : {
          title: "Verify this Post?",
          description: "This post will receive a verified badge, signaling to users that the information has been reviewed.",
          actionLabel: "Verify Post",
          actionClass: "bg-blue-600 hover:bg-blue-700",
        };
    }
    if (type === "delete") {
      return currentState
        ? {
          title: "Restore this Post?",
          description: "This post will be restored and become visible in the feed.",
          actionLabel: "Restore Post",
          actionClass: "bg-green-600 hover:bg-green-700",
        }
        : {
          title: "Delete this Post?",
          description: "This post will be hidden from the feed. You can restore it later.",
          actionLabel: "Delete Post",
          actionClass: "bg-destructive hover:bg-destructive/90",
        };
    }
    return { title: "", description: "", actionLabel: "", actionClass: "" };
  };

  const dialog = getDialogContent();

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-10 w-full bg-muted animate-pulse rounded-md" />
        <div className="h-64 w-full bg-muted animate-pulse rounded-md" />
      </div>
    );
  }

  const posts = postsRes?.data || [];
  const meta = postsRes?.meta;

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <div className="relative flex-1 min-w-0 w-full sm:max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            placeholder="Search posts..."
            className="pl-9 w-full"
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
          />
        </div>
        <Select value={typeFilter} onValueChange={(v) => { setTypeFilter(v); setPage(1); }}>
          <SelectTrigger className="w-[170px]">
            <SelectValue placeholder="All Types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Types</SelectItem>
            {Object.entries(postTypeDisplayMap).map(([key, label]) => (
              <SelectItem key={key} value={key}>{label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:block rounded-xl border bg-card overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40">
              <TableHead className="font-semibold">Post Details</TableHead>
              <TableHead className="font-semibold">Location</TableHead>
              <TableHead className="font-semibold text-center">Approved</TableHead>
              <TableHead className="font-semibold text-center">Verified</TableHead>
              <TableHead className="font-semibold text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {posts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-32 text-center text-muted-foreground italic">
                  No posts found.
                </TableCell>
              </TableRow>
            ) : (
              posts.map((post: any) => (
                <TableRow
                  key={post.id}
                  className={cn(
                    "transition-colors",
                    post.isDeleted && "opacity-50 bg-muted/30"
                  )}
                >
                  <TableCell className="min-w-[400px]">
                    <div className="flex flex-col gap-2 py-2">
                       <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-[10px] font-bold px-2 py-0">
                          {postTypeDisplayMap[post.type as PostType] || post.type}
                        </Badge>
                        <span className="text-[10px] text-muted-foreground font-medium flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {format(new Date(post.createdAt), "MMM d, yyyy")}
                        </span>
                      </div>
                      <Link
                        href={`/feed/${post.id}`}
                        target="_blank"
                        className="font-bold text-base text-foreground hover:text-primary transition-colors line-clamp-1"
                      >
                        {post.title || "Untitled Post"}
                      </Link>
                      
                      {/* Donation Progress - Full width of this cell */}
                      {post.type === PostType.HELPING && (
                        <div className="mt-2 w-full bg-blue-50/50 dark:bg-blue-950/20 rounded-xl p-3 border border-blue-100 dark:border-blue-900/40">
                           <div className="flex justify-between items-center mb-2">
                            <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400">৳{post.raisedAmount?.toLocaleString()} raised</span>
                            <span className="text-[10px] text-muted-foreground">Target: ৳{post.targetAmount?.toLocaleString()}</span>
                          </div>
                          <div className="h-2 w-full bg-blue-100 dark:bg-blue-900/50 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-blue-600 transition-all duration-700"
                              style={{ width: `${Math.min(((post.raisedAmount || 0) / (post.targetAmount || 1)) * 100, 100)}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1.5 font-bold text-xs">
                        <MapPin className="h-3.5 w-3.5 text-primary" />
                        {post.upazila}, {post.district}
                      </div>
                      <span className="text-[10px] text-muted-foreground pl-5 uppercase tracking-tighter font-semibold">{post.division}</span>
                    </div>
                  </TableCell>

                  <TableCell className="text-center">
                    <Button
                      variant={post.isApproved ? "default" : "outline"}
                      size="sm"
                      className={cn(
                        "h-8 px-3 gap-1.5 text-[10px] font-bold rounded-full",
                        post.isApproved ? "bg-green-600 hover:bg-green-700" : "border-amber-500 text-amber-600"
                      )}
                      onClick={() => setPendingAction({ type: "approve", postId: post.id, currentState: post.isApproved })}
                    >
                      {post.isApproved ? <ShieldCheck className="h-3 w-3" /> : <ShieldOff className="h-3 w-3" />}
                      {post.isApproved ? "Approved" : "Pending"}
                    </Button>
                  </TableCell>

                  <TableCell className="text-center">
                    {post.type === PostType.HELPING ? (
                      <Button
                        variant={post.isVerified ? "default" : "outline"}
                        size="sm"
                        className={cn(
                          "h-8 px-3 gap-1.5 text-[10px] font-bold rounded-full",
                          post.isVerified ? "bg-blue-600 hover:bg-blue-700" : "border-blue-400 text-blue-500"
                        )}
                        onClick={() => setPendingAction({ type: "verify", postId: post.id, currentState: post.isVerified })}
                      >
                        {post.isVerified ? <BadgeCheck className="h-3 w-3" /> : <BadgeX className="h-3 w-3" />}
                        {post.isVerified ? "Verified" : "Verify"}
                      </Button>
                    ) : "-"}
                  </TableCell>

                  <TableCell className="text-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      className={cn(
                        "h-8 w-8 p-0 rounded-full",
                        post.isDeleted ? "text-green-600" : "text-destructive"
                      )}
                      onClick={() => setPendingAction({ type: "delete", postId: post.id, currentState: post.isDeleted })}
                    >
                      {post.isDeleted ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Card View */}
      <div className="lg:hidden space-y-4">
        {posts.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground bg-card rounded-xl border">No posts found.</div>
        ) : (
          posts.map((post: any) => (
            <div 
              key={post.id} 
              className={cn(
                "bg-card rounded-2xl border p-5 shadow-sm space-y-4",
                post.isDeleted && "opacity-60 bg-muted/40 grayscale-[0.5]"
              )}
            >
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <Badge variant="outline" className="text-[9px] font-black uppercase tracking-widest">
                    {postTypeDisplayMap[post.type as PostType] || post.type}
                  </Badge>
                  <Link href={`/feed/${post.id}`} target="_blank" className="block text-base font-black leading-tight hover:text-primary transition-colors">
                    {post.title}
                  </Link>
                  <div className="flex items-center gap-3 text-[10px] text-muted-foreground font-bold">
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {format(new Date(post.createdAt), "MMM d, yyyy")}</span>
                    <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {post.district}</span>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                   <Badge variant={post.isApproved ? "success" : "warning"} className="text-[8px]">
                    {post.isApproved ? "Approved" : "Pending"}
                   </Badge>
                   {post.type === PostType.HELPING && (
                     <Badge variant={post.isVerified ? "info" : "outline"} className="text-[8px]">
                      {post.isVerified ? "Verified" : "Unverified"}
                     </Badge>
                   )}
                </div>
              </div>

              {/* Progress Bar - TRUE FULL WIDTH within the card */}
              {post.type === PostType.HELPING && (
                <div className="pt-2">
                   <div className="flex justify-between items-end mb-2 px-1">
                    <span className="text-sm font-black text-blue-600">৳{post.raisedAmount?.toLocaleString()}</span>
                    <span className="text-[10px] text-muted-foreground font-medium">Target ৳{post.targetAmount?.toLocaleString()}</span>
                   </div>
                   <div className="h-3 w-full bg-blue-100 dark:bg-blue-900/50 rounded-full overflow-hidden shadow-inner">
                      <div 
                        className="h-full bg-gradient-to-r from-blue-600 to-blue-500 transition-all duration-1000 shadow-[0_0_10px_rgba(37,99,235,0.4)]"
                        style={{ width: `${Math.min(((post.raisedAmount || 0) / (post.targetAmount || 1)) * 100, 100)}%` }}
                      />
                   </div>
                </div>
              )}

              <div className="grid grid-cols-3 gap-2 pt-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className={cn("h-10 text-[10px] font-bold rounded-xl", post.isApproved ? "bg-green-50 text-green-700 border-green-200" : "bg-amber-50 text-amber-700 border-amber-200")}
                  onClick={() => setPendingAction({ type: "approve", postId: post.id, currentState: post.isApproved })}
                >
                  {post.isApproved ? "Unapprove" : "Approve"}
                </Button>
                {post.type === PostType.HELPING && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className={cn("h-10 text-[10px] font-bold rounded-xl", post.isVerified ? "bg-blue-50 text-blue-700 border-blue-200" : "hover:bg-blue-50")}
                    onClick={() => setPendingAction({ type: "verify", postId: post.id, currentState: post.isVerified })}
                  >
                    {post.isVerified ? "Unverify" : "Verify"}
                  </Button>
                )}
                <Button 
                  variant="outline" 
                  size="sm" 
                  className={cn("h-10 text-[10px] font-bold rounded-xl", post.isDeleted ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700 border-red-200")}
                  onClick={() => setPendingAction({ type: "delete", postId: post.id, currentState: post.isDeleted })}
                >
                  {post.isDeleted ? "Restore" : "Delete"}
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {meta && meta.total > meta.limit && (
        <div className="flex items-center justify-between pt-2">
          <p className="text-sm text-muted-foreground">
            Showing {((meta.page - 1) * meta.limit) + 1}–{Math.min(meta.page * meta.limit, meta.total)} of {meta.total} posts
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
            >
              Previous
            </Button>
            <span className="text-sm font-medium px-2">{page} / {Math.ceil(meta.total / meta.limit)}</span>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= Math.ceil(meta.total / meta.limit)}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Confirmation AlertDialog */}
      <AlertDialog open={!!pendingAction} onOpenChange={(open) => !open && setPendingAction(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{dialog.title}</AlertDialogTitle>
            <AlertDialogDescription>{dialog.description}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isAnyPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirm}
              className={cn("font-semibold", (dialog as any).actionClass)}
              disabled={isAnyPending}
            >
              {isAnyPending ? "Processing..." : dialog.actionLabel}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
