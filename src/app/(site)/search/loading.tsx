import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div
      className="w-full"
      role="status"
      aria-busy="true"
      aria-label="กำลังโหลด"
    >
      <Skeleton className="h-11 w-full rounded-none" />
    </div>
  );
}
