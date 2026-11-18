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
  return <Skeleton className="mt-10 h-72 w-full rounded-none" />;
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
      title: "เมนูหลัก",
      links: [
        { label: "กระทู้ล่าสุด", href: "/posts" },
        { label: "ข่าวสารอนิเมะ", href: "/news" },
        { label: "บทวิจารณ์", href: "/reviews" },
        { label: "ถามตอบ", href: "/qandas" },
      ],
    },
    {
      title: "บัญชีและการสนับสนุน",
      links: [
        ...(username ? [{ label: "โปรไฟล์ส่วนตัว", href: `/${username}` }] : []),
        ...(username ? [{ label: "การตั้งค่าบัญชี", href: "/setting" }] : []),
        { label: "คำถามที่พบบ่อย", href: "/faq" },
      ],
    },
  ];

  const numberFormat = new Intl.NumberFormat("th-TH");

  return (
    <footer className="mt-4 border-t border-border bg-card pt-10 pb-24 lg:pb-6">
      <div className="mx-auto grid w-full max-w-5xl gap-10 px-4 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr]">
        <div className="space-y-4">
          <ResponsiveLogo />
          <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
            ชุมชนออนไลน์สำหรับผู้ชื่นชอบอนิเมะ เปิดพื้นที่ให้สมาชิกแลกเปลี่ยนความคิดเห็น
            เผยแพร่บทวิจารณ์ และสอบถามข้อมูลเกี่ยวกับอนิเมะ
          </p>
          <dl className="flex gap-6">
            <div>
              <dt className="text-xs text-muted-foreground">จำนวนโพสต์</dt>
              <dd className="text-lg font-semibold tabular-nums">
                {numberFormat.format(stats.posts)}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">จำนวนสมาชิก</dt>
              <dd className="text-lg font-semibold tabular-nums">
                {numberFormat.format(stats.members)}
              </dd>
            </div>
          </dl>
        </div>
        {groups.map((g) => (
          <nav key={g.title} aria-label={g.title}>
            <p className="mb-2 text-sm font-semibold text-foreground">
              {g.title}
            </p>
            <ul>
              {g.links.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="block py-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
              {g.title === "บัญชีและการสนับสนุน" && username && (
                <li>
                  <SignOutLink />
                </li>
              )}
            </ul>
          </nav>
        ))}
      </div>
      <div className="mx-auto w-full max-w-5xl px-4 sm:px-6">
        <Separator className="my-6" />
        <div className="flex flex-col items-center gap-2 md:flex-row md:justify-between">
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
                className="flex size-11 items-center justify-center text-muted-foreground transition-colors hover:text-primary"
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
