"use client";

import {
  Home,
  MessageCircleQuestion,
  Search,
  Sparkles,
  Star,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const TABS = [
  { name: "หน้าหลัก", path: "/", icon: Home },
  { name: "โพสต์", path: "/posts", icon: Sparkles },
  { name: "รีวิว", path: "/reviews", icon: Star },
  { name: "Q&A", path: "/qandas", icon: MessageCircleQuestion },
  { name: "ค้นหา", path: "/search", icon: Search },
];

/** Phone-only primary navigation, kept inside the thumb zone. */
export function MobileTabBar() {
  const pathname = usePathname();
  return (
    <nav
      aria-label="เมนูหลัก"
      className="glass fixed inset-x-0 bottom-0 z-50 border-t border-border/70 pb-[env(safe-area-inset-bottom)] lg:hidden"
    >
      <ul className="mx-auto flex max-w-md">
        {TABS.map(({ name, path, icon: Icon }) => {
          const active =
            path === "/" ? pathname === "/" : pathname.startsWith(path);
          return (
            <li key={path} className="flex-1">
              <Link
                href={path}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex min-h-14 flex-col items-center justify-center gap-0.5 text-[11px] font-medium text-muted-foreground transition-colors",
                  active && "text-primary",
                )}
              >
                <Icon
                  className={cn("size-[22px]", active && "[&>*]:stroke-[2.4]")}
                />
                {name}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
