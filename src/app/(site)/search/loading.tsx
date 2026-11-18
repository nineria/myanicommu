import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div
      className="mx-auto max-w-3xl"
      role="status"
      aria-busy="true"
      aria-label="กำลังโหลด"
    >
      <Skeleton className="h-12 w-full rounded-full" />
    </div>
  );
}
