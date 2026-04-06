"use client";

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Droplets, Clock, AlertTriangle, Heart, MessageCircle, Activity } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface PostCardProps {
  post: any;
}

export function PostCard({ post }: PostCardProps) {
  // Utility to determine badge styling based on type
  const getBadgeStyle = (type: string) => {
    switch (type) {
      case "BLOOD_FINDING":
        return "bg-destructive text-destructive-foreground hover:bg-destructive/90";
      case "BLOOD_DONATION":
        return "bg-emerald-500 text-primary-foreground hover:bg-emerald-600";
      case "HELPING":
        return "bg-blue-500 text-primary-foreground hover:bg-blue-600";
      default:
        return "bg-secondary text-secondary-foreground";
    }
  };

  const formatText = (type: string) => {
    return type?.replace("_", " ");
  };

  const timeAgo = post.createdAt ? formatDistanceToNow(new Date(post.createdAt), { addSuffix: true }) : "Just now";

  return (
    <Card className="w-full mb-4 shadow-sm border-primary/10">
      <CardHeader className="flex flex-row items-center gap-4 pb-4">
        {/* Simple Avatar Fallback using initial */}
        <div className="h-10 w-10 flex items-center justify-center rounded-full bg-primary/20 text-primary font-bold uppercase">
          {post.author?.name?.charAt(0) || "U"}
        </div>
        <div className="flex-1 flex flex-col">
          <div className="flex justify-between items-start w-full">
            <h3 className="font-semibold text-base leading-none">
              {post.author?.bloodDonor?.name || "Anonymous User"}
            </h3>
            <Badge className={getBadgeStyle(post.type)}>
              {formatText(post.type)}
            </Badge>
          </div>
          <span className="text-xs text-muted-foreground mt-1">{timeAgo}</span>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {post.title && <h4 className="font-bold text-lg">{post.title}</h4>}

        {post.content && (
          <p className="whitespace-pre-wrap text-sm text-foreground/90 leading-relaxed">
            {post.content}
          </p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
          {/* Universal Data */}
          {post.division && post.district && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground bg-secondary/30 p-2 rounded-md">
              <MapPin className="w-4 h-4 text-primary" />
              <span>{post.district}, {post.division}</span>
            </div>
          )}

          {post.contactNumber && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground bg-secondary/30 p-2 rounded-md">
              <Droplets className="w-4 h-4 text-primary" />
              <span>Contact: {post.contactNumber}</span>
            </div>
          )}

          {/* Blood Specific Data */}
          {post.bloodGroup && (
            <div className="flex items-center justify-between gap-2 text-sm font-semibold bg-destructive/10 text-destructive p-2 rounded-md">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                <span>Required Blood:</span>
              </div>
              <span className="text-lg">{post.bloodGroup.replace("_", " ")}</span>
            </div>
          )}

          {post.donationTime && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground bg-secondary/30 p-2 rounded-md">
              <Clock className="w-4 h-4 text-emerald-500" />
              <span>Time: {new Date(post.donationTime).toLocaleString()}</span>
            </div>
          )}

          {/* Helping / Medical Financial Data */}
          {post.targetAmount && (
            <div className="flex items-center gap-2 text-sm font-medium bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 p-2 rounded-md">
              <Activity className="w-4 h-4" />
              <span>Target: ৳{post.targetAmount}</span>
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="flex justify-between border-t p-2">
        <Button variant="ghost" size="sm" className="flex-1 rounded-none hover:bg-primary/5 hover:text-primary transition-colors">
          <Heart className="w-4 h-4 mr-2" />
          <span className="hidden sm:inline">Like</span>
        </Button>
        <Button variant="ghost" size="sm" className="flex-1 rounded-none hover:bg-primary/5 hover:text-primary transition-colors">
          <MessageCircle className="w-4 h-4 mr-2" />
          <span className="hidden sm:inline">Comment</span>
        </Button>
      </CardFooter>
    </Card>
  );
}
