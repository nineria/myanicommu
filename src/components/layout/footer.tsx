import Link from "next/link";
import { FaFacebook, FaGithub, FaInstagram, FaXTwitter } from "react-icons/fa6";
import { ResponsiveLogo } from "@/components/layout/logo";
import { SignOutLink } from "@/components/layout/sign-out-link";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { getCurrentUser } from "@/lib/auth";
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
  return <Skeleton className="mt-10 h-56 w-full rounded-none" />;
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
      title: "ชุมชนคนรักอนิเมะ",
      links: [
        { label: "โพสต์ใหม่", href: "/posts" },
        { label: "ข่าวสาร", href: "/news" },
        { label: "รีวิว", href: "/reviews" },
        { label: "Q&A", href: "/qandas" },
      ],
    },
    {
      title: "จัดการข้อมูล",
      links: [
        ...(username ? [{ label: "โปรไฟล์", href: `/${username}` }] : []),
        ...(username ? [{ label: "ตั้งค่า", href: "/setting" }] : []),
        { label: "คำถามที่พบบ่อย", href: "/faq" },
      ],
    },
    {
      title: "ข้อมูลเว็บไซต์",
      links: [
        { label: `จำนวนโพสต์ : ${stats.posts}`, href: "" },
        { label: `จำนวนสมาชิก : ${stats.members}`, href: "" },
      ],
    },
  ];

  return (
    <footer className="mt-4 border-t border-border bg-card pt-8 pb-24 md:pt-10 lg:pb-4">
      <div className="mx-auto flex w-full max-w-5xl justify-center px-4 sm:px-6 md:justify-between">
        <div className="w-[250px] text-center md:text-left">
          <ResponsiveLogo />
          <p className="my-3 text-sm text-muted-foreground">
            ศูนย์กลางในการพูดคุย รีวิว และโพสต์ถามตอบคำถามต่างๆ ที่เกี่ยวกับอนิเมะ โปรโมทอนิเมะ
            และแนะนำเนื้อหาของอนิเมะเพื่อส่งเสริมให้ผู้คนดูอนิเมะมากขึ้น
          </p>
        </div>
        <div className="hidden gap-8 md:flex">
          {groups.map((g) => (
            <div key={g.title} className="w-[150px] lg:w-[200px]">
              <p className="text-right text-base font-bold text-muted-foreground">
                {g.title}
              </p>
              {g.links.map((l) =>
                l.href ? (
                  <Link
                    key={l.label}
                    href={l.href}
                    className="mt-2 block text-right text-sm text-muted-foreground hover:underline"
                  >
                    {l.label}
                  </Link>
                ) : (
                  <p
                    key={l.label}
                    className="mt-2 text-right text-sm text-muted-foreground"
                  >
                    {l.label}
                  </p>
                ),
              )}
              {g.title === "จัดการข้อมูล" && username && <SignOutLink />}
            </div>
          ))}
        </div>
      </div>
      <div className="mx-auto w-full max-w-5xl px-4 sm:px-6">
        <Separator className="my-4" />
        <div className="flex flex-col items-center md:flex-row md:justify-between">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} MyAniCommu. All rights reserved.
          </p>
          <div className="flex">
            {SOCIAL.map(({ href, icon: Icon, label }) => (
              <a
                key={href}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                className="flex size-11 items-center justify-center text-foreground hover:text-primary"
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
