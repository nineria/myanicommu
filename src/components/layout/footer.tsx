import Link from "next/link";
import { FaFacebook, FaGithub, FaInstagram, FaXTwitter } from "react-icons/fa6";
import { CONTAINER_CLASS } from "@/components/layout/container";
import { Logo } from "@/components/layout/logo";
import { SignOutLink } from "@/components/layout/sign-out-link";
import { Skeleton } from "@/components/ui/skeleton";
import { getCurrentUser } from "@/lib/auth";
import { cn } from "@/lib/utils";
import { getApi } from "@/trpc/caller";

const SOCIAL = [
  {
    href: "https://twitter.com/nineria_nananai",
    icon: FaXTwitter,
    label: "Twitter",
  },
  {
    href: "https://www.facebook.com/NineriaNananai",
    icon: FaFacebook,
    label: "Facebook",
  },
  {
    href: "https://www.instagram.com/ninerianananai",
    icon: FaInstagram,
    label: "Instagram",
  },
  { href: "https://github.com/nineria", icon: FaGithub, label: "GitHub" },
];

export function FooterSkeleton() {
  return (
    <div className={cn(CONTAINER_CLASS, "mt-6 pb-28 lg:pb-8")}>
      <Skeleton className="h-40 w-full rounded-xl" />
    </div>
  );
}

export async function Footer() {
  const api = await getApi();
  const [user, stats] = await Promise.all([
    getCurrentUser().catch(() => null),
    api.post.siteStats().catch(() => ({ posts: 0, members: 0 })),
  ]);
  const username = user?.username;

  const groups = [
    {
      title: "สำรวจ",
      links: [
        { label: "โพสต์ใหม่", href: "/posts" },
        { label: "ข่าวสาร", href: "/news" },
        { label: "รีวิว", href: "/reviews" },
        { label: "Q&A", href: "/qandas" },
      ],
    },
    {
      title: "บัญชี",
      links: [
        ...(username ? [{ label: "โปรไฟล์", href: `/${username}` }] : []),
        ...(username ? [{ label: "ตั้งค่า", href: "/setting" }] : []),
        { label: "คำถามที่พบบ่อย", href: "/faq" },
      ],
    },
  ];

  return (
    <footer className={cn(CONTAINER_CLASS, "mt-6 pb-28 lg:pb-8")}>
      <div className="rounded-xl border bg-card p-6 md:p-8">
        <div className="grid gap-8 md:grid-cols-[1.4fr_1fr_1fr]">
          <div className="max-w-sm">
            <Logo />
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              ศูนย์กลางในการพูดคุย รีวิว และถามตอบเรื่องอนิเมะ เพื่อให้ทุกคนหาเรื่องใหม่ๆ
              มาดูได้ไม่รู้จบ
            </p>
            <p className="mt-4 text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">
                {stats.posts.toLocaleString("th-TH")}
              </span>{" "}
              โพสต์ ·{" "}
              <span className="font-semibold text-foreground">
                {stats.members.toLocaleString("th-TH")}
              </span>{" "}
              สมาชิก
            </p>
          </div>
          {groups.map((g) => (
            <div key={g.title}>
              <p className="mb-2 text-sm font-semibold">{g.title}</p>
              <ul className="space-y-1.5">
                {g.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
                {g.title === "บัญชี" && username && (
                  <li>
                    <SignOutLink />
                  </li>
                )}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-8 flex flex-col items-center justify-between gap-3 border-t pt-4 sm:flex-row">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} MyAniCommu
          </p>
          <div className="flex gap-1">
            {SOCIAL.map(({ href, icon: Icon, label }) => (
              <a
                key={href}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                className="grid size-9 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              >
                <Icon className="size-[18px]" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
