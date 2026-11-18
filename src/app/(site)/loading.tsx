import { Skeleton } from "@/components/ui/skeleton";

/** Home skeleton. Shown instantly while the page's data is fetched. */
export default function Loading() {
  return (
    <div
      className="space-y-2"
      role="status"
      aria-busy="true"
      aria-label="กำลังโหลด"
    >
      <Skeleton className="h-16 w-full" />
      <Skeleton className="h-8 w-full" />
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
        <Skeleton className="aspect-[16/9] sm:aspect-[4/3]" />
        <Skeleton className="hidden aspect-[4/3] sm:block" />
        <Skeleton className="hidden aspect-[4/3] sm:block" />
      </div>
      <Skeleton className="h-64 w-full" />
    </div>
  );
}
