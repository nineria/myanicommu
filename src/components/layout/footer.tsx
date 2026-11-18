import Link from "next/link";
import { FaFacebook, FaGithub, FaInstagram, FaXTwitter } from "react-icons/fa6";
import { ResponsiveLogo } from "@/components/layout/logo";
import { SignOutLink } from "@/components/layout/sign-out-link";
import { Separator } from "@/components/ui/separator";
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

export async function Footer({ username }: { username?: string | null }) {
  const api = await getApi();
  const stats = await api.post
    .siteStats()
    .catch(() => ({ posts: 0, members: 0 }));

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
    <footer className="mt-10 border-t-2 border-primary bg-card pt-4 pb-4 md:pt-8">
      <div className="mx-auto flex w-full max-w-4xl justify-center px-4 md:justify-between">
        <div className="w-[250px] text-center md:text-left">
          <ResponsiveLogo />
          <p className="my-2 text-sm text-foreground/80">
            ศูนย์กลางในการพูดคุย รีวิว และโพสต์ถามตอบคำถามต่างๆ ที่เกี่ยวกับอนิเมะ โปรโมทอนิเมะ
            และแนะนำเนื้อหาของอนิเมะเพื่อส่งเสริมให้ผู้คนดูอนิเมะมากขึ้น
          </p>
        </div>
        <div className="hidden gap-6 md:flex">
          {groups.map((g) => (
            <div key={g.title} className="w-[150px] lg:w-[200px]">
              <p className="text-right text-base font-bold text-foreground/80">
                {g.title}
              </p>
              {g.links.map((l) =>
                l.href ? (
                  <Link
                    key={l.label}
                    href={l.href}
                    className="mt-1 block text-right text-sm text-foreground/50 hover:underline"
                  >
                    {l.label}
                  </Link>
                ) : (
                  <p
                    key={l.label}
                    className="mt-1 text-right text-sm text-foreground/50"
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
      <div className="mx-auto w-full max-w-4xl px-4">
        <Separator className="my-2" />
        <div className="flex flex-col items-center md:flex-row md:justify-between">
          <p className="text-sm text-foreground/80">
            &copy; {new Date().getFullYear()} MyAnimeCommunity. All rights
            reserved.
          </p>
          <div className="flex">
            {SOCIAL.map(({ href, icon: Icon, label }) => (
              <a
                key={href}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                className="p-2 text-foreground hover:text-primary"
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
