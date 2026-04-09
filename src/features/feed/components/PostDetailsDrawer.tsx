"use client";

import { useEffect, useState } from "react";
import { X, MapPin, Droplets, Clock, AlertTriangle } from "lucide-react";
import { CommentSection } from "./CommentSection";

interface PostDetailsDrawerProps {
  post: any;
  isOpen: boolean;
  onClose: () => void;
  authorName: string;
}

export function PostDetailsDrawer({ post, isOpen, onClose, authorName }: PostDetailsDrawerProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setMounted(true);
      document.body.style.overflow = "hidden";
    } else {
      const timer = setTimeout(() => setMounted(false), 300);
      document.body.style.overflow = "unset";
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!mounted && !isOpen) return null;

  return (
    <div className={`fixed inset-0 z-50 flex items-end sm:items-center justify-center transition-all duration-300 ${isOpen ? 'visible' : 'invisible'}`}>
      {/* Backdrop */}
      <div 
        className={`absolute inset-0 bg-black/40 backdrop-blur-[2px] transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`} 
        onClick={onClose} 
      />

      {/* Drawer */}
      <div 
        className={`relative w-full max-w-2xl bg-background sm:rounded-2xl rounded-t-3xl shadow-2xl transition-all duration-300 transform h-[90vh] sm:h-[80vh] flex flex-col ${isOpen ? 'translate-y-0 opacity-100' : 'translate-y-full sm:translate-y-10 opacity-0'}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b shrink-0 bg-card rounded-t-3xl sm:rounded-t-2xl">
          <div className="flex items-center gap-3">
             <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                {authorName.charAt(0)}
             </div>
             <div>
                <h3 className="font-bold text-sm leading-none">{authorName}</h3>
                <p className="text-[10px] text-muted-foreground mt-0.5">Viewing updates & comments</p>
             </div>
          </div>
          <button onClick={onClose} className="bg-secondary/50 p-1.5 rounded-full hover:bg-secondary transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
          {/* Post Summary header in Drawer */}
          <div className="p-6 bg-gradient-to-b from-primary/5 to-transparent border-b border-primary/5 shrink-0 max-h-[30vh] overflow-y-auto">
             <h2 className="text-xl font-black text-foreground mb-3">{post.title || "Post Update"}</h2>
             <p className="text-sm text-foreground/80 leading-relaxed italic mb-4">{post.content}</p>
             
             <div className="flex flex-wrap gap-2">
                {post.bloodGroup && (
                   <div className="flex items-center gap-1.5 bg-destructive/10 text-destructive text-[10px] font-bold px-2 py-1 rounded-md">
                      <AlertTriangle className="w-3 h-3" />
                      {post.bloodGroup.replace(/_/g, " ")}
                   </div>
                )}
                {post.location && (
                   <div className="flex items-center gap-1.5 bg-secondary/80 text-muted-foreground text-[10px] px-2 py-1 rounded-md">
                      <MapPin className="w-3 h-3 text-primary" />
                      {post.location}
                   </div>
                )}
             </div>
          </div>

          <div className="p-4 py-2 border-b bg-secondary/10 shrink-0">
             <span className="text-xs font-black uppercase tracking-wider text-muted-foreground">Comments</span>
          </div>

          {/* Actual Comment Section */}
          <div className="flex-1 min-h-0 relative">
            <CommentSection postId={post.id} />
          </div>
        </div>
      </div>
    </div>
  );
}
