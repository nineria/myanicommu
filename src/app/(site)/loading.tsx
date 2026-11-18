import { Skeleton } from "@/components/ui/skeleton";

/** Home skeleton. Shown instantly while the page's data is fetched. */
export default function Loading() {
  return (
    <div
      className="space-y-8"
      role="status"
      aria-busy="true"
      aria-label="กำลังโหลด"
    >
      <div>
        <Skeleton className="mb-4 h-8 w-56" />
        <div className="grid gap-4 lg:grid-cols-[1.6fr_1fr]">
          <Skeleton className="min-h-72 rounded-3xl" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            <Skeleton className="h-28 rounded-2xl" />
            <Skeleton className="h-28 rounded-2xl" />
          </div>
        </div>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <Skeleton className="h-64 rounded-2xl" />
        <Skeleton className="h-64 rounded-2xl" />
      </div>
    </div>
  );
}
