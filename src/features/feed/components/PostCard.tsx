"use client";

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  MapPin,
  Droplets,
  Clock,
  AlertTriangle,
  MessageCircle,
  Activity,
  Heart,
  Phone,
  Wallet,
  Stethoscope,
  ChevronLeft,
  ChevronRight,
  Siren,
  Calendar,
  Timer,
} from "lucide-react";
import Image from "next/image";
import { formatDistanceToNow, format } from "date-fns";
import { LikeAction } from "./LikeAction";
import { PostDetailsDrawer } from "./PostDetailsDrawer";
import { useState, useCallback } from "react";

interface PostCardProps {
  post: any;
}

// ── Blood Group Display Helper ───────────────────────────────────────────────
const formatBloodGroup = (bg: string): string => {
  const map: Record<string, string> = {
    A_POSITIVE: "A+",
    A_NEGATIVE: "A-",
    B_POSITIVE: "B+",
    B_NEGATIVE: "B-",
    AB_POSITIVE: "AB+",
    AB_NEGATIVE: "AB-",
    O_POSITIVE: "O+",
    O_NEGATIVE: "O-",
  };
  return map[bg] || bg?.replace(/_/g, " ");
};

// ── Donation Time Type Badge ─────────────────────────────────────────────────
function DonationTimeBadge({ type }: { type: string }) {
  const config: Record<string, { icon: React.ReactNode; label: string; className: string }> = {
    EMERGENCY: {
      icon: <Siren className="w-3 h-3" />,
      label: "Emergency",
      className: "bg-red-100 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-800",
    },
    FIXED: {
      icon: <Calendar className="w-3 h-3" />,
      label: "Fixed Time",
      className: "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800",
    },
    FLEXIBLE: {
      icon: <Timer className="w-3 h-3" />,
      label: "Flexible",
      className: "bg-sky-100 text-sky-700 border-sky-200 dark:bg-sky-950 dark:text-sky-300 dark:border-sky-800",
    },
  };

  const c = config[type];
  if (!c) return null;

  return (
    <Badge className={`${c.className} text-[10px] h-4 px-1.5 font-medium gap-0.5`}>
      {c.icon}
      {c.label}
    </Badge>
  );
}

// ── Image Gallery Component ──────────────────────────────────────────────────
function PostImageGallery({ images }: { images: string[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imgError, setImgError] = useState<Record<number, boolean>>({});

  const validImages = images.filter((_, i) => !imgError[i]);

  const goNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const goPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  if (!images || images.length === 0 || validImages.length === 0) return null;

  return (
    <div className="relative w-full aspect-[16/9] bg-muted/30 rounded-lg overflow-hidden group">
      {/* Current Image */}
      <Image
        src={images[currentIndex]}
        alt={`Post image ${currentIndex + 1}`}
        fill
        className="object-cover transition-opacity duration-300"
        sizes="(max-width: 768px) 100vw, 600px"
        onError={() => setImgError((prev) => ({ ...prev, [currentIndex]: true }))}
      />

      {/* Navigation Arrows (only if multiple images) */}
      {images.length > 1 && (
        <>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); goPrev(); }}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); goNext(); }}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          {/* Dots Indicator */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
            {images.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={(e) => { e.stopPropagation(); setCurrentIndex(i); }}
                className={`w-1.5 h-1.5 rounded-full transition-all cursor-pointer ${
                  i === currentIndex
                    ? "bg-white w-3"
                    : "bg-white/50 hover:bg-white/80"
                }`}
              />
            ))}
          </div>
        </>
      )}

      {/* Image Counter Badge */}
      {images.length > 1 && (
        <div className="absolute top-2 right-2 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded-full font-medium">
          {currentIndex + 1}/{images.length}
        </div>
      )}
    </div>
  );
}

// ── Main PostCard Component ──────────────────────────────────────────────────
export function PostCard({ post }: PostCardProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Extract correct author name based on role
  const authorName =
    post.author?.donorProfile?.name ||
    post.author?.bloodDonor?.name ||
    post.author?.hospital?.name ||
    post.author?.organisation?.name ||
    "BloodLink User";

  const authorRole = post.author?.role;

  // Utility to determine badge styling based on type
  const getBadgeStyle = (type: string) => {
    switch (type) {
      case "BLOOD_FINDING":
        return "bg-destructive text-primary-foreground hover:bg-destructive/90";
      case "BLOOD_DONATION":
        return "bg-emerald-500 text-primary-foreground hover:bg-emerald-600";
      case "HELPING":
        return "bg-blue-500 text-primary-foreground hover:bg-blue-600";
      default:
        return "bg-secondary text-secondary-foreground";
    }
  };

  const formatText = (text: string) => {
    return text?.replace(/_/g, " ");
  };

  const roleLabel = (role: string) => {
    switch (role) {
      case "HOSPITAL": return "Hospital";
      case "ORGANISATION": return "Organisation";
      default: return null;
    }
  };

  const timeAgo = post.createdAt
    ? formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })
    : "Just now";

  return (
    <Card className="w-full mb-4 shadow-sm border-primary/10 overflow-hidden transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 group/card">
      <CardHeader className="flex flex-row items-center gap-4 pb-3">
        {/* Avatar */}
        <div className="h-10 w-10 shrink-0 flex items-center justify-center rounded-full bg-primary/20 text-primary font-bold uppercase border-2 border-background shadow-inner">
          {authorName.charAt(0)}
        </div>
        <div className="flex-1 flex flex-col min-w-0">
          <div className="flex justify-between items-start w-full gap-2">
            <div className="flex flex-col min-w-0">
              <h3 className="font-semibold text-base leading-tight truncate">
                {authorName}
              </h3>
              <div className="flex flex-wrap gap-1.5 mt-1">
                <Badge className={`${getBadgeStyle(post.type)} text-[10px] h-4 px-1.5`}>
                  {formatText(post.type)}
                </Badge>
                {post.donationTimeType && (
                  <DonationTimeBadge type={post.donationTimeType} />
                )}
                {roleLabel(authorRole) && (
                  <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-100 border-purple-200 text-[10px] h-4 px-1.5 font-medium dark:bg-purple-950 dark:text-purple-300 dark:border-purple-800">
                    {roleLabel(authorRole)}
                  </Badge>
                )}
                {post.type === "HELPING" && !post.isApproved && (
                  <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 border-amber-200 text-[10px] h-4 px-1.5 font-medium dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800">
                    Unverified
                  </Badge>
                )}
                {post.isVerified && (
                  <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-blue-200 text-[10px] h-4 px-1.5 font-medium">
                    Verified
                  </Badge>
                )}
                {post.isResolved && (
                  <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-emerald-200 text-[10px] h-4 px-1.5 font-medium">
                    Resolved
                  </Badge>
                )}
              </div>
            </div>
            <span className="text-[10px] text-muted-foreground whitespace-nowrap mt-0.5">
              {timeAgo}
            </span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 pt-0">
        {/* Title */}
        {post.title && (
          <h4 className="font-bold text-lg leading-snug">{post.title}</h4>
        )}

        {/* Content */}
        {post.content && (
          <p className="whitespace-pre-wrap text-sm text-foreground/90 leading-relaxed italic border-l-4 border-primary/20 pl-3">
            {post.content}
          </p>
        )}

        {/* ═══════ Image Gallery ═══════ */}
        <PostImageGallery images={post.images || []} />

        {/* ═══════ Key Info Grid ═══════ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Blood Group — Large Banner */}
          {post.bloodGroup && (
            <div className="flex items-center justify-between gap-2 text-sm font-semibold bg-destructive/10 text-destructive p-3 rounded-lg border border-destructive/10 sm:col-span-2">
              <div className="flex items-center gap-2">
                <Droplets className="w-5 h-5" />
                <span>
                  {post.type === "BLOOD_FINDING"
                    ? "Required Blood Group:"
                    : "Blood Group:"}
                </span>
              </div>
              <span className="text-2xl font-black tracking-tight">
                {formatBloodGroup(post.bloodGroup)}
              </span>
            </div>
          )}

          {/* Blood Bags */}
          {post.bloodBags && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground bg-secondary/30 p-2.5 rounded-lg border border-primary/5">
              <Droplets className="w-4 h-4 text-primary shrink-0" />
              <span>
                <strong>{post.bloodBags}</strong> bag{post.bloodBags > 1 ? "s" : ""} needed
              </span>
            </div>
          )}

          {/* Reason */}
          {post.reason && (
            <div className="flex items-start gap-2 text-sm text-muted-foreground bg-secondary/30 p-2.5 rounded-lg border border-primary/5">
              <Stethoscope className="w-4 h-4 text-primary shrink-0 mt-0.5" />
              <span className="line-clamp-2">{post.reason}</span>
            </div>
          )}

          {/* Location */}
          {(post.location || (post.district && post.division)) && (
            <div className="flex items-start gap-2 text-sm text-muted-foreground bg-secondary/30 p-2.5 rounded-lg border border-primary/5">
              <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
              <span className="line-clamp-2">
                {post.location}
                {post.location && (post.upazila || post.district || post.division)
                  ? ", "
                  : ""}
                {[post.upazila, post.district, post.division]
                  .filter(Boolean)
                  .join(", ")}
              </span>
            </div>
          )}

          {/* Phone / Call Action — Primary Button for Finding */}
          {post.contactNumber && (
            <div className={post.type === "BLOOD_FINDING" ? "sm:col-span-2" : ""}>
               <Button 
                variant={post.type === "BLOOD_FINDING" ? "default" : "outline"} 
                className={`w-full gap-2 font-bold h-10 ${post.type === "BLOOD_FINDING" ? "bg-destructive hover:bg-destructive/90 text-white animate-pulse" : ""}`}
                asChild
              >
                <a href={`tel:${post.contactNumber}`}>
                  <Phone className="w-4 h-4" />
                  {post.type === "BLOOD_FINDING" ? "CALL NOW" : "Contact"}
                </a>
              </Button>
            </div>
          )}

          {/* Hemoglobin */}
          {post.hemoglobin && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground bg-secondary/30 p-2.5 rounded-lg border border-primary/5">
              <Activity className="w-4 h-4 text-primary shrink-0" />
              <span>Hemoglobin: <strong>{post.hemoglobin}</strong> g/dL</span>
            </div>
          )}

          {/* Donation Time */}
          {post.donationTime && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground bg-secondary/30 p-2.5 rounded-lg border border-primary/5">
              <Clock className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>
                {format(new Date(post.donationTime), "MMM dd, yyyy")} at{" "}
                {format(new Date(post.donationTime), "hh:mm a")}
              </span>
            </div>
          )}

          {/* ═══════ HELPING Specific ═══════ */}
          {/* Medical Issues */}
          {post.medicalIssues && (
            <div className="flex items-start gap-2 text-sm text-muted-foreground bg-secondary/30 p-2.5 rounded-lg border border-primary/5 sm:col-span-2">
              <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <span>
                <strong className="text-foreground">Medical:</strong>{" "}
                {post.medicalIssues}
              </span>
            </div>
          )}

          {/* Target Amount — Financial Banner */}
          {post.targetAmount && (
            <div className="flex items-center justify-between gap-2 text-sm font-bold bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 p-3 rounded-lg border border-blue-200/50 sm:col-span-2">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5" />
                <span>Financial Target:</span>
              </div>
              <div className="text-right">
                <span className="text-lg">
                  ৳{post.targetAmount.toLocaleString()}
                </span>
                {post.raisedAmount > 0 && (
                  <p className="text-[10px] font-normal text-blue-500">
                    ৳{post.raisedAmount.toLocaleString()} raised
                  </p>
                )}
              </div>
            </div>
          )}

          {/* bKash/Nagad Number */}
          {post.bkashNagadNumber && post.isApproved && (
            <div className="flex flex-col gap-2 sm:col-span-2 mt-1">
              <div className="flex items-center gap-3 text-sm text-muted-foreground bg-pink-50 dark:bg-pink-950/30 p-3 rounded-lg border border-pink-200/50 dark:border-pink-800/30">
                <Wallet className="w-5 h-5 text-pink-600 shrink-0 self-start mt-0.5" />
                <div className="flex flex-col">
                  <span>
                    <strong className="text-foreground text-sm">bKash/Nagad:</strong>{" "}
                    <span className="font-medium text-foreground">{post.bkashNagadNumber}</span>
                  </span>
                  <span className="text-[11px] text-pink-700/70 dark:text-pink-400 mt-1 leading-tight">
                    বি.দ্র: বিকাশ বা নগদে টাকা পাঠালে, রাইজড এমাউন্ট আপডেট হবে না।
                  </span>
                </div>
              </div>
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold h-10 shadow-sm transition-all hover:shadow-md">
                <Wallet className="w-4 h-4 mr-2" />
                Go to Payment Method
              </Button>
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="flex justify-between border-t border-primary/5 p-1 bg-secondary/10">
        <LikeAction
          postId={post.id}
          initialLikes={post._count?.likes || 0}
          initialHasLiked={post.hasLiked}
        />

        <div className="w-[1px] bg-primary/10 h-6 self-center" />

        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsDrawerOpen(true)}
          className="flex-1 rounded-none hover:bg-primary/5 hover:text-primary transition-all group py-5"
        >
          <MessageCircle className="w-4 h-4 mr-2 group-hover:fill-primary transition-colors" />
          <div className="flex items-baseline gap-1">
            <span className="font-bold">{post._count?.comments || 0}</span>
            <span className="text-xs text-muted-foreground hidden sm:inline">
              Comments
            </span>
          </div>
        </Button>
      </CardFooter>

      {/* Engagement Drawer */}
      <PostDetailsDrawer
        post={post}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        authorName={authorName}
      />
    </Card>
  );
}
