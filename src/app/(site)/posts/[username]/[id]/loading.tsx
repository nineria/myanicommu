import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div
      className="w-full space-y-4"
      role="status"
      aria-busy="true"
      aria-label="กำลังโหลด"
    >
      <Skeleton className="h-4 w-56" />
      <Skeleton className="h-9 w-4/5" />
      <Skeleton className="aspect-[16/9] w-full rounded-xl" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    </div>
  );
}
