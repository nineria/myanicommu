import { Globe } from "lucide-react";
import { FaFacebook, FaInstagram, FaXTwitter } from "react-icons/fa6";
import { TagBadge } from "@/components/post/tag-badge";
import { EditProfileButton } from "@/components/profile/edit-profile-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { kFormatter } from "@/lib/utils";

type Profile = {
  id: string;
  username: string;
  avatar: string | null;
  banner: string | null;
  bio: string;
  website: string | null;
  facebook: string | null;
  twitter: string | null;
  instagram: string | null;
  ranks: { id: string; label: string; colorFrom: string; colorTo: string }[];
  _count: { posts: number; comments: number; likes: number; stars: number };
};

export function ProfileHeader({
  user,
  isOwner,
}: {
  user: Profile;
  isOwner: boolean;
}) {
  const links = [
    { href: user.website, icon: Globe, label: "Website" },
    { href: user.facebook, icon: FaFacebook, label: "Facebook" },
    { href: user.twitter, icon: FaXTwitter, label: "Twitter" },
    { href: user.instagram, icon: FaInstagram, label: "Instagram" },
  ].filter((l) => l.href);

  const stats = [
    { label: "โพสต์", value: user._count.posts },
    { label: "ข้อความ", value: user._count.comments },
    { label: "ถูกใจ", value: user._count.likes },
    { label: "ดาว", value: user._count.stars },
  ];

  return (
    <div className="overflow-hidden rounded-xl border bg-card">
      <div
        className="h-36 bg-muted bg-cover bg-center sm:h-52"
        style={
          user.banner ? { backgroundImage: `url(${user.banner})` } : undefined
        }
      />
      <div className="px-5 pb-5">
        <div className="-mt-12 flex flex-wrap items-end justify-between gap-2">
          <Avatar className="size-24 border-4 border-card shadow-lg">
            <AvatarImage src={user.avatar ?? undefined} alt={user.username} />
            <AvatarFallback className="text-2xl">
              {user.username.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          {isOwner && (
            <EditProfileButton
              profile={{
                username: user.username,
                bio: user.bio,
                avatar: user.avatar,
                banner: user.banner,
                website: user.website ?? "",
                facebook: user.facebook ?? "",
                twitter: user.twitter ?? "",
                instagram: user.instagram ?? "",
              }}
            />
          )}
        </div>
        <h1 className="mt-3 text-2xl font-bold text-foreground">
          {user.username}
        </h1>
        <div className="mt-1 flex flex-wrap gap-1">
          {user.ranks.map((r) => (
            <TagBadge
              key={r.id}
              label={r.label}
              from={r.colorFrom}
              to={r.colorTo}
              deg={35}
              className=""
            />
          ))}
        </div>
        {user.bio && (
          <p className="mt-3 whitespace-pre-line text-sm text-foreground/80">
            {user.bio}
          </p>
        )}
        {links.length > 0 && (
          <div className="mt-3 flex gap-2">
            {links.map(({ href, icon: Icon, label }) => (
              <a
                key={label}
                href={`/external-link?external=${encodeURIComponent(href ?? "")}`}
                aria-label={label}
                className="grid size-9 place-items-center rounded-full bg-muted text-muted-foreground transition-colors hover:text-primary"
              >
                <Icon className="size-5" />
              </a>
            ))}
          </div>
        )}
        <div className="mt-4 grid grid-cols-4 gap-2 text-center">
          {stats.map((s) => (
            <div key={s.label} className="rounded-xl bg-muted py-3">
              <div className="text-xl font-bold text-foreground tabular-nums">
                {kFormatter(s.value)}
              </div>
              <div className="text-xs text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
