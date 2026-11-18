import { cn } from "@/lib/utils";

/** Content wrapper for a page. The chrome (navbar, footer) lives in the (site) layout. */
export function PageShell({
  children,
  className,
  ads,
}: {
  children: React.ReactNode;
  className?: string;
  ads?: React.ReactNode;
}) {
  return (
    <>
      {ads}
      <div className={cn("page-in mx-auto w-full max-w-3xl", className)}>
        {children}
      </div>
    </>
  );
}

/** Wider canvas for listing pages. */
export function WidePage({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={cn("page-in w-full", className)}>{children}</div>;
}
