import { PostGridSkeleton } from "@/components/post/post-grid";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div
      className="space-y-5"
      role="status"
      aria-busy="true"
      aria-label="กำลังโหลด"
    >
      <Skeleton className="h-10 w-48" />
      <Skeleton className="h-11 w-full rounded-full" />
      <PostGridSkeleton />
    </div>
  );
}
