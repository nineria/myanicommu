import { ExternalLink } from "lucide-react";
import type { Metadata } from "next";
import { BackLink } from "@/components/layout/back-link";
import { Logo } from "@/components/layout/logo";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = { title: "ออกจากเว็บไซต์" };

type Props = { searchParams: Promise<{ external?: string }> };

function safeUrl(raw?: string) {
  try {
    const u = new URL(raw ?? "");
    return u.protocol === "http:" || u.protocol === "https:"
      ? u.toString()
      : null;
  } catch {
    return null;
  }
}

export default async function ExternalLinkPage({ searchParams }: Props) {
  const { external } = await searchParams;
  const url = safeUrl(external);

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-5 p-4">
      <Logo />
      <div className="max-w-full space-y-4 rounded-lg bg-card px-10 py-6 text-center text-foreground">
        <h4 className="text-lg font-semibold">คุณกำลังออกจากเว็ปไซต์ MyAniCommu</h4>
        {url ? (
          <>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="flex items-center justify-center gap-2 break-all underline hover:text-primary"
            >
              {url}
              <ExternalLink className="size-3.5 shrink-0" />
            </a>
            <Button asChild>
              <a href={url} target="_blank" rel="noopener noreferrer nofollow">
                ดำเนินการต่อ
              </a>
            </Button>
          </>
        ) : (
          <p className="text-destructive">ลิงก์ไม่ถูกต้อง</p>
        )}
        <BackLink />
      </div>
    </div>
  );
}
