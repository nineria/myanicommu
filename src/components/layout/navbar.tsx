"use client";

import { SignInButton, SignUpButton, useClerk } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";
import {
  HelpCircle,
  LogOut,
  Newspaper,
  Search,
  Settings,
  User,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Logo } from "@/components/layout/logo";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { NAV_LINKS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { useTRPC } from "@/trpc/client";

const DESKTOP_LINKS = NAV_LINKS.filter((l) => l.path !== "/search");

export function Navbar() {
  const trpc = useTRPC();
  const pathname = usePathname();
  const router = useRouter();
  const { signOut } = useClerk();
  const { data: me, isPending } = useQuery(trpc.user.me.queryOptions());

  return (
    <header className="glass sticky top-0 z-50 border-b border-border/70">
      <div className="mx-auto flex h-14 w-full max-w-5xl items-center gap-2 px-4">
        <Logo className="mr-2" />

        <nav
          aria-label="เมนูหลัก"
          className="hidden items-center gap-0.5 lg:flex"
        >
          {DESKTOP_LINKS.map((item) => {
            const active = pathname.startsWith(item.path);
            return (
              <Link
                key={item.path}
                href={item.path}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "rounded-full px-3.5 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground",
                  active && "bg-accent text-foreground",
                )}
              >
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-1.5">
          <Button
            asChild
            variant="ghost"
            size="icon"
            className="hidden rounded-full lg:inline-flex"
          >
            <Link href="/search" aria-label="ค้นหา">
              <Search />
            </Link>
          </Button>

          {isPending && <Skeleton className="size-9 rounded-full" />}

          {!isPending && !me && (
            <>
              <SignInButton mode="modal">
                <Button variant="ghost" size="sm" className="rounded-full">
                  เข้าสู่ระบบ
                </Button>
              </SignInButton>
              <SignUpButton mode="modal">
                <Button size="sm" className="rounded-full">
                  ลงทะเบียน
                </Button>
              </SignUpButton>
            </>
          )}

          {me && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  aria-label="บัญชีของฉัน"
                  className="rounded-full outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
                >
                  <Avatar className="size-9 ring-2 ring-border transition hover:ring-primary">
                    <AvatarImage
                      src={me.avatar ?? undefined}
                      alt={me.username}
                    />
                    <AvatarFallback>
                      {me.username.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-60 rounded-xl">
                <DropdownMenuLabel className="font-normal">
                  <div className="truncate font-semibold">{me.username}</div>
                  <div className="truncate text-xs text-muted-foreground">
                    {me.email || "ยังไม่ได้ยืนยัน Email"}
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href={`/${me.username}`}>
                    <User /> โปรไฟล์
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/news">
                    <Newspaper /> ข่าวสาร
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/setting">
                    <Settings /> ตั้งค่า
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/faq">
                    <HelpCircle /> คำถามที่พบบ่อย
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  variant="destructive"
                  onClick={() => signOut(() => router.push("/"))}
                >
                  <LogOut /> ออกจากระบบ
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  );
}
