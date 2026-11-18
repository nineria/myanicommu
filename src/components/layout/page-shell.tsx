import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { getCurrentUser } from "@/lib/auth";
import { cn } from "@/lib/utils";

export async function PageShell({
  children,
  className,
  ads,
}: {
  children: React.ReactNode;
  className?: string;
  ads?: React.ReactNode;
}) {
  const user = await getCurrentUser().catch(() => null);
  return (
    <div className="flex min-h-svh flex-col">
      <Navbar />
      {ads}
      <main
        className={cn("mx-auto w-full max-w-3xl flex-1 px-4 pb-10", className)}
      >
        {children}
      </main>
      <Footer username={user?.username} />
    </div>
  );
}
