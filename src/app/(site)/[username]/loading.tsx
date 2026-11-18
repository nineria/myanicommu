import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div
      className="mx-auto max-w-3xl space-y-4"
      role="status"
      aria-busy="true"
      aria-label="กำลังโหลด"
    >
      <Skeleton className="h-48 w-full rounded-3xl" />
      <div className="grid grid-cols-4 gap-3">
        {[0, 1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-16 rounded-2xl" />
        ))}
      </div>
      <Skeleton className="h-56 w-full rounded-2xl" />
    </div>
  );
}
