import { Suspense } from "react";
import SponsorPostSection from "@/components/SponsorPostSection";
import PostFeed from "@/components/PostFeed";

export default function Home() {
  return (
    <div className="relative min-h-screen p-8 max-w-7xl mx-auto">
      {/* Sponsor Create Post Button / Modal */}
      <Suspense fallback={null}>
        <SponsorPostSection />
      </Suspense>

      {/* Main Feed Grid (Rows of 4) */}
      <Suspense fallback={<div className="text-center py-12 text-gray-400">Loading posts...</div>}>
        <PostFeed />
      </Suspense>
    </div>
  );
}