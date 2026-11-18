"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { usePreferences } from "@/components/preferences-provider";

/** Routes outbound links inside user content through the /external-link warning page. */
export function ExternalLinkGuard({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { prefs } = usePreferences();
  const warn = prefs.warnExternalLinks;

  useEffect(() => {
    const el = ref.current;
    if (!el || !warn) return;
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest("a");
      const href = a?.getAttribute("href");
      if (!a || !href || !/^https?:\/\//i.test(href)) return;
      if (new URL(href).origin === window.location.origin) return;
      e.preventDefault();
      router.push(`/external-link?external=${encodeURIComponent(href)}`);
    };
    el.addEventListener("click", onClick);
    return () => el.removeEventListener("click", onClick);
  }, [router, warn]);

  return <div ref={ref}>{children}</div>;
}
