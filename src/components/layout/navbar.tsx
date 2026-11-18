"use client";

import { SignInButton, SignUpButton, useClerk } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";
import {
  HelpCircle,
  LogOut,
  Menu,
  MessageCircleQuestion,
  Newspaper,
  Search,
  Settings,
  Sparkles,
  Star,
  User,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ResponsiveLogo } from "@/components/layout/logo";
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
import { NAV_LINKS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { useTRPC } from "@/trpc/client";

const ACCESS = [
  { name: "โพสต์ใหม่", link: "/posts", icon: Sparkles },
  { name: "ข่าวสาร", link: "/news", icon: Newspaper },
  { name: "รีวิว", link: "/reviews", icon: Star },
  { name: "Q&A", link: "/qandas", icon: MessageCircleQuestion },
];

export function Navbar() {
  const trpc = useTRPC();
  const pathname = usePathname();
  const router = useRouter();
  const { signOut } = useClerk();
  const { data: me, isPending } = useQuery(trpc.user.me.queryOptions());

  return (
    <header className="sticky top-0 z-50 glass border-b border-border py-2">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-4 px-4 sm:px-6">
        <ResponsiveLogo />

        <nav className="hidden flex-1 items-center pl-8 lg:flex">
          {me ? (
            NAV_LINKS.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={cn(
                  "eyebrow px-3 py-2 text-muted-foreground transition-colors hover:text-foreground",
                  pathname === item.path && "text-primary",
                )}
              >
                {item.name}
              </Link>
            ))
          ) : (
            <Link
              href="/search"
              className="eyebrow px-3 py-2 text-muted-foreground hover:text-foreground"
            >
              ค้นหา
            </Link>
          )}
        </nav>

        {!isPending && !me && (
          <div className="flex items-center gap-2">
            <SignInButton mode="modal">
              <Button variant="ghost" size="sm">
                เข้าสู่ระบบ
              </Button>
            </SignInButton>
            <SignUpButton mode="modal">
              <Button size="sm">ลงทะเบียน</Button>
            </SignUpButton>
          </div>
        )}

        {me && (
          <div className="flex items-center gap-2">
            <Link
              href={`/${me.username}`}
              className="group hidden items-center gap-3 md:flex"
            >
              <Avatar className="size-9 border border-border">
                <AvatarImage src={me.avatar ?? undefined} alt={me.username} />
                <AvatarFallback>
                  {me.username.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="max-w-44 leading-tight">
                <div className="truncate font-display text-sm font-bold text-foreground group-hover:text-primary">
                  {me.username}
                </div>
                <div className="truncate text-[0.6875rem] font-medium tracking-[0.04em] text-muted-foreground">
                  {me.email || "ยังไม่ได้ยืนยัน Email"}
                </div>
              </div>
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="เมนู">
                  <Menu className="size-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>ค้นหา</DropdownMenuLabel>
                <DropdownMenuItem asChild>
                  <Link href="/search">
                    <Search /> ค้นหา
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuLabel>การเข้าถึง</DropdownMenuLabel>
                {ACCESS.map(({ name, link, icon: Icon }) => (
                  <DropdownMenuItem key={link} asChild>
                    <Link href={link}>
                      <Icon /> {name}
                    </Link>
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuLabel>การตั้งค่า</DropdownMenuLabel>
                <DropdownMenuItem asChild>
                  <Link href={`/${me.username}`}>
                    <User /> โปรไฟล์
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
                <DropdownMenuLabel>ออกจากระบบ</DropdownMenuLabel>
                <DropdownMenuItem
                  variant="destructive"
                  onClick={() => signOut(() => router.push("/"))}
                >
                  <LogOut /> ออกจากระบบ
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>
    </header>
  );
}
