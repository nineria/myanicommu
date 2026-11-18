import { CalendarDays, Globe } from "lucide-react";
import { FaFacebook, FaInstagram, FaXTwitter } from "react-icons/fa6";
import { TagBadge } from "@/components/post/tag-badge";
import { EditProfileButton } from "@/components/profile/edit-profile-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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
  createdAt: Date;
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

  return (
    <section className="overflow-hidden rounded-lg bg-card">
      <div
        className="h-28 bg-gradient-to-br from-primary/70 to-opposite/70 bg-cover bg-center sm:h-48"
        style={
          user.banner ? { backgroundImage: `url(${user.banner})` } : undefined
        }
        role="img"
        aria-label={user.banner ? `ภาพปกของ ${user.username}` : undefined}
        aria-hidden={user.banner ? undefined : true}
      />

      <div className="px-4 pb-5 sm:px-6">
        <div className="-mt-12 flex items-end justify-between gap-3 sm:-mt-14">
          <Avatar className="size-24 border-4 border-card shadow-md sm:size-28">
            <AvatarImage src={user.avatar ?? undefined} alt={user.username} />
            <AvatarFallback className="text-3xl">
              {user.username.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          {isOwner && (
            <div className="pb-1">
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
            </div>
          )}
        </div>

        <div className="mt-3 space-y-2">
          <div>
            <h1 className="text-2xl font-bold leading-tight text-foreground">
              {user.username}
            </h1>
            <p className="mt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground">
              <CalendarDays className="size-3.5" aria-hidden />
              เข้าร่วมเมื่อ{" "}
              {new Date(user.createdAt).toLocaleDateString("th-TH", {
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>

          {user.ranks.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {user.ranks.map((r) => (
                <TagBadge
                  key={r.id}
                  label={r.label}
                  from={r.colorFrom}
                  to={r.colorTo}
                  deg={35}
                />
              ))}
            </div>
          )}

          {user.bio && (
            <p className="max-w-prose whitespace-pre-line text-sm text-foreground/80">
              {user.bio}
            </p>
          )}

          {links.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-1">
              {links.map(({ href, icon: Icon, label }) => (
                <a
                  key={label}
                  href={`/external-link?external=${encodeURIComponent(href ?? "")}`}
                  aria-label={label}
                  className="grid size-11 place-items-center rounded-full bg-muted text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary"
                >
                  <Icon className="size-5" />
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
