import React from 'react';
import PostDetailsContainer from '@/features/feed/PostDetailsContainer';

export const metadata = {
  title: "Post Details - BloodLink",
};

export default async function PostDetailsPage({ params }: { params: Promise<{ postId: string }> }) {
  const resolvedParams = await params;
  return (
    <main className="min-h-screen bg-background py-8 px-4 sm:px-6 max-w-3xl mx-auto">
       <PostDetailsContainer postId={resolvedParams.postId} />
    </main>
  );
}
