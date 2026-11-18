"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ExternalLink,
  Eye,
  Info,
  OctagonAlert,
  Pencil,
  Plus,
  Trash2,
  TriangleAlert,
  X,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import {
  AnnouncementFormDialog,
  type AnnouncementValues,
} from "@/components/announcement-form-dialog";
import { TagBadge } from "@/components/post/tag-badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { RANKS, REPORT_REASONS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { useTRPC } from "@/trpc/client";

const card = "rounded-lg bg-card p-4 shadow-sm";

export function AdminPanel() {
  return (
    <div className="space-y-3">
      <h2 className="mt-4 text-center text-2xl font-bold text-foreground">
        ส่วนของผู้ดูแลระบบ
      </h2>
      <AdminStats />
      <UserManagement />
      <div id="announcementControl">
        <AnnouncementControl />
      </div>
      <Reports />
    </div>
  );
}

function AdminStats() {
  const trpc = useTRPC();
  const { data } = useQuery(trpc.post.adminStats.queryOptions());
  const items = [
    { label: "สมาชิก", value: data?.users },
    { label: "โพสต์", value: data?.posts },
    { label: "ข้อความ", value: data?.comments },
    { label: "ถูกใจ", value: data?.likes },
    { label: "ดาว", value: data?.stars },
  ];
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
      {items.map((i) => (
        <div
          key={i.label}
          className="rounded-lg bg-card p-3 text-center shadow-sm"
        >
          <div className="text-2xl font-bold text-foreground">
            {i.value ?? "-"}
          </div>
          <div className="text-xs text-muted-foreground">{i.label}</div>
        </div>
      ))}
    </div>
  );
}

function UserManagement() {
  const trpc = useTRPC();
  const qc = useQueryClient();
  const q = trpc.user.list.queryOptions();
  const { data: users } = useQuery(q);
  const { data: me } = useQuery(trpc.user.me.queryOptions());
  const [target, setTarget] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);
  const give = useMutation(trpc.user.giveRank.mutationOptions());
  const remove = useMutation(trpc.user.removeRank.mutationOptions());
  const setRole = useMutation(trpc.user.setRole.mutationOptions());
  const del = useMutation(trpc.user.deleteUser.mutationOptions());
  const refresh = () => qc.invalidateQueries({ queryKey: q.queryKey });
  const targetUser = users?.find((u) => u.id === target);
  const isSelf = targetUser?.id === me?.id;

  const needle = search.trim().toLowerCase();
  const shown = users?.filter(
    (u) =>
      !needle ||
      u.username.toLowerCase().includes(needle) ||
      u.email.toLowerCase().includes(needle),
  );

  const close = () => {
    setTarget(null);
    setConfirmDelete(false);
  };

  const changeRole = async (role: "MEMBER" | "ADMIN") => {
    if (!targetUser) return;
    try {
      await setRole.mutateAsync({ userId: targetUser.id, role });
      await refresh();
      toast.success(role === "ADMIN" ? "ตั้งเป็นผู้ดูแลแล้ว" : "ถอดสิทธิ์ผู้ดูแลแล้ว");
    } catch {
      toast.error("ไม่สามารถเปลี่ยนสิทธิ์ได้");
    }
  };

  return (
    <div className={card}>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-lg font-semibold text-foreground">
          จัดการผู้ใช้{" "}
          <span className="text-sm font-normal text-muted-foreground">
            ({shown?.length ?? 0})
          </span>
        </h3>
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="ค้นหาชื่อผู้ใช้หรืออีเมล"
          aria-label="ค้นหาผู้ใช้"
          className="max-w-64"
        />
      </div>

      <ul className="divide-y divide-border">
        {shown?.map((u) => (
          <li key={u.id}>
            <button
              type="button"
              onClick={() => setTarget(u.id)}
              className="-mx-2 flex w-[calc(100%+1rem)] items-center gap-3 rounded-md px-2 py-2.5 text-left transition-colors hover:bg-muted/60"
            >
              <Avatar>
                <AvatarImage src={u.avatar ?? undefined} alt="" />
                <AvatarFallback>
                  {u.username.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="min-w-0 flex-1">
                <span className="flex items-center gap-2">
                  <span className="truncate font-medium text-foreground">
                    {u.username}
                  </span>
                  {u.role === "ADMIN" && <Badge>ผู้ดูแล</Badge>}
                </span>
                <span className="block truncate text-xs text-muted-foreground">
                  {u.email || "ไม่มีอีเมล"} · {u._count.posts} โพสต์ ·{" "}
                  {u._count.comments} ความคิดเห็น
                </span>
              </span>
              <span className="hidden flex-wrap justify-end gap-1 sm:flex">
                {u.ranks.slice(0, 2).map((r) => (
                  <TagBadge
                    key={r.id}
                    label={r.label}
                    from={r.colorFrom}
                    to={r.colorTo}
                    deg={35}
                  />
                ))}
              </span>
            </button>
          </li>
        ))}
        {shown?.length === 0 && (
          <li className="py-6 text-center text-sm text-muted-foreground">
            ไม่พบผู้ใช้
          </li>
        )}
      </ul>

      <Dialog open={!!targetUser} onOpenChange={(o) => !o && close()}>
        <DialogContent className="max-h-[90dvh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>จัดการ {targetUser?.username}</DialogTitle>
            <DialogDescription>
              {targetUser?.email || "ไม่มีอีเมล"}
            </DialogDescription>
          </DialogHeader>

          {targetUser && (
            <div className="space-y-5">
              <Button asChild variant="outline" size="sm">
                <Link href={`/${targetUser.username}`} onClick={close}>
                  <ExternalLink /> ดูโปรไฟล์
                </Link>
              </Button>

              <section className="space-y-2">
                <h4 className="text-sm font-semibold text-foreground">สิทธิ์</h4>
                <div className="flex gap-2">
                  {(["MEMBER", "ADMIN"] as const).map((r) => (
                    <Button
                      key={r}
                      size="sm"
                      variant={targetUser.role === r ? "default" : "outline"}
                      disabled={isSelf || setRole.isPending}
                      aria-pressed={targetUser.role === r}
                      onClick={() => targetUser.role !== r && changeRole(r)}
                    >
                      {r === "ADMIN" ? "ผู้ดูแลระบบ" : "สมาชิก"}
                    </Button>
                  ))}
                </div>
                {isSelf && (
                  <p className="text-xs text-muted-foreground">
                    ไม่สามารถเปลี่ยนสิทธิ์ของตัวเองได้
                  </p>
                )}
              </section>

              <section className="space-y-2">
                <h4 className="text-sm font-semibold text-foreground">
                  แรงค์ของผู้ใช้{" "}
                  <span className="font-normal text-muted-foreground">
                    (กดเพื่อลบ)
                  </span>
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {targetUser.ranks.length === 0 && (
                    <span className="text-xs text-muted-foreground">
                      ยังไม่มีแรงค์
                    </span>
                  )}
                  {targetUser.ranks.map((r) => (
                    <button
                      key={r.id}
                      type="button"
                      title="ลบแรงค์"
                      onClick={async () => {
                        await remove.mutateAsync({ rankId: r.id });
                        refresh();
                      }}
                    >
                      <TagBadge
                        label={`${r.label} ×`}
                        from={r.colorFrom}
                        to={r.colorTo}
                        deg={35}
                      />
                    </button>
                  ))}
                </div>
                <p className="pt-1 text-xs text-muted-foreground">
                  แรงค์ที่สามารถเพิ่มได้
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {RANKS.filter(
                    (r) => !targetUser.ranks.some((x) => x.label === r.label),
                  ).map((r) => (
                    <button
                      key={r.label}
                      type="button"
                      onClick={async () => {
                        await give.mutateAsync({
                          userId: targetUser.id,
                          ranks: [r],
                        });
                        refresh();
                      }}
                    >
                      <TagBadge
                        label={`+ ${r.label}`}
                        from={r.colorFrom}
                        to={r.colorTo}
                        deg={35}
                      />
                    </button>
                  ))}
                </div>
              </section>

              {!isSelf && targetUser.role !== "ADMIN" && (
                <section className="space-y-2 rounded-md border border-destructive/30 p-3">
                  <h4 className="text-sm font-semibold text-destructive">
                    โซนอันตราย
                  </h4>
                  {confirmDelete ? (
                    <div className="space-y-2">
                      <p className="text-xs text-muted-foreground">
                        ลบ {targetUser.username} พร้อมโพสต์และความคิดเห็นทั้งหมด
                        การกระทำนี้ย้อนกลับไม่ได้
                      </p>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="destructive"
                          disabled={del.isPending}
                          onClick={async () => {
                            try {
                              await del.mutateAsync({ userId: targetUser.id });
                              await refresh();
                              toast.success("ลบผู้ใช้แล้ว");
                              close();
                            } catch {
                              toast.error("ไม่สามารถลบผู้ใช้ได้");
                            }
                          }}
                        >
                          ยืนยันการลบ
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setConfirmDelete(false)}
                        >
                          ยกเลิก
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-destructive"
                      onClick={() => setConfirmDelete(true)}
                    >
                      <Trash2 /> ลบผู้ใช้
                    </Button>
                  )}
                </section>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

const ANN_TYPES = {
  SUCCESS: {
    label: "ทั่วไป",
    Icon: Info,
    tone: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
  },
  WARNING: {
    label: "เตือน",
    Icon: TriangleAlert,
    tone: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
  },
  DANGER: {
    label: "สำคัญ",
    Icon: OctagonAlert,
    tone: "bg-red-500/15 text-red-600 dark:text-red-400",
  },
} as const;

function AnnouncementControl() {
  const trpc = useTRPC();
  const qc = useQueryClient();
  const q = trpc.announcement.all.queryOptions();
  const { data } = useQuery(q);
  const [form, setForm] = useState<AnnouncementValues | "new" | null>(null);
  const [tab, setTab] = useState<"live" | "draft">("live");
  const [removing, setRemoving] = useState<string | null>(null);
  const update = useMutation(trpc.announcement.update.mutationOptions());
  const del = useMutation(trpc.announcement.delete.mutationOptions());
  const refresh = () => qc.invalidateQueries({ queryKey: q.queryKey });

  const live = data?.filter((a) => a.published) ?? [];
  const draft = data?.filter((a) => !a.published) ?? [];
  const items = tab === "live" ? live : draft;

  const togglePublish = async (
    a: NonNullable<typeof data>[number],
    c: boolean,
  ) => {
    try {
      await update.mutateAsync({
        id: a.id,
        type: a.type,
        title: a.title,
        content: a.content,
        published: c,
      });
      await refresh();
      toast.success(c ? "เผยแพร่ประกาศแล้ว" : "ซ่อนประกาศแล้ว");
    } catch {
      toast.error("ไม่สามารถเปลี่ยนสถานะได้");
    }
  };

  return (
    <div className={card}>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-lg font-semibold text-foreground">จัดการประกาศ</h3>
        <Button size="sm" onClick={() => setForm("new")}>
          <Plus /> สร้างประกาศ
        </Button>
      </div>

      <div
        role="tablist"
        aria-label="สถานะประกาศ"
        className="mb-3 flex w-fit gap-1 rounded-full bg-muted p-1"
      >
        {(
          [
            ["live", "เปิดใช้", live.length],
            ["draft", "แบบร่าง", draft.length],
          ] as const
        ).map(([k, label, n]) => (
          <button
            key={k}
            type="button"
            role="tab"
            aria-selected={tab === k}
            onClick={() => setTab(k)}
            className={cn(
              "min-h-9 rounded-full px-4 text-xs font-medium text-muted-foreground transition-colors",
              tab === k && "bg-card text-primary shadow-sm",
            )}
          >
            {label} ({n})
          </button>
        ))}
      </div>

      <ul className="space-y-2">
        {items.map((a) => {
          const t = ANN_TYPES[a.type];
          return (
            <li
              key={a.id}
              className="flex items-start gap-3 rounded-lg border border-border p-3"
            >
              <span
                className={cn(
                  "mt-0.5 grid size-9 shrink-0 place-items-center rounded-full",
                  t.tone,
                )}
                title={t.label}
              >
                <t.Icon className="size-5" aria-hidden />
                <span className="sr-only">{t.label}</span>
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-foreground">
                  {a.title}
                </p>
                <p className="text-xs text-muted-foreground">
                  {t.label} · อัปเดต{" "}
                  {new Date(a.updatedAt).toLocaleDateString("th-TH", {
                    dateStyle: "medium",
                  })}
                </p>
                {removing === a.id && (
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <span className="text-xs text-destructive">
                      ลบประกาศนี้ถาวร?
                    </span>
                    <Button
                      size="sm"
                      variant="destructive"
                      disabled={del.isPending}
                      onClick={async () => {
                        try {
                          await del.mutateAsync({ id: a.id });
                          await refresh();
                          toast.success("ลบประกาศแล้ว");
                        } catch {
                          toast.error("ไม่สามารถลบประกาศได้");
                        }
                        setRemoving(null);
                      }}
                    >
                      ลบ
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setRemoving(null)}
                    >
                      ยกเลิก
                    </Button>
                  </div>
                )}
              </div>
              <div className="flex shrink-0 items-center gap-0.5">
                <Switch
                  checked={a.published}
                  aria-label={a.published ? "ซ่อนประกาศ" : "เผยแพร่ประกาศ"}
                  disabled={update.isPending}
                  onCheckedChange={(c) => togglePublish(a, c)}
                />
                <Button
                  size="icon"
                  variant="ghost"
                  aria-label="แก้ไข"
                  onClick={() =>
                    setForm({
                      id: a.id,
                      type: a.type,
                      title: a.title,
                      content: a.content,
                      published: a.published,
                    })
                  }
                >
                  <Pencil />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="text-destructive"
                  aria-label="ลบ"
                  onClick={() => setRemoving(a.id)}
                >
                  <Trash2 />
                </Button>
              </div>
            </li>
          );
        })}
        {items.length === 0 && (
          <li className="rounded-lg border border-dashed border-border py-8 text-center text-sm text-muted-foreground">
            {tab === "live" ? "ยังไม่มีประกาศที่เปิดใช้" : "ไม่มีแบบร่าง"}
          </li>
        )}
      </ul>

      {form && (
        <AnnouncementFormDialog
          open
          onOpenChange={(o) => {
            if (!o) {
              setForm(null);
              refresh();
            }
          }}
          initial={form === "new" ? undefined : form}
        />
      )}
    </div>
  );
}

function Reports() {
  const trpc = useTRPC();
  const qc = useQueryClient();
  const q = trpc.report.list.queryOptions();
  const { data } = useQuery(q);
  const [view, setView] = useState<string | null>(null);
  const resolve = useMutation(trpc.report.resolve.mutationOptions());
  const del = useMutation(trpc.report.delete.mutationOptions());
  const refresh = () => qc.invalidateQueries({ queryKey: q.queryKey });
  const current = data?.find((r) => r.id === view);
  const detail = (current?.detail ?? {}) as Record<string, boolean | string>;

  return (
    <div className={card}>
      <h3 className="mb-2 text-lg font-semibold text-foreground">
        รายงานจากผู้ใช้
      </h3>
      {data && data.length === 0 && (
        <p className="text-center text-sm">ไม่พบรายงานจากผู้ใช้</p>
      )}
      <div className="space-y-1">
        {data?.map((r) => (
          <div
            key={r.id}
            className="flex items-center justify-between gap-2 rounded-lg border p-3"
          >
            <div className="min-w-0 text-sm">
              <span className="font-medium">{r.reporter.username}</span>{" "}
              <span className="text-muted-foreground">รายงาน</span>{" "}
              <a href={r.from} className="text-primary hover:underline">
                {r.title}
              </a>
              {r.resolved && <Badge className="ml-2">แก้ไขแล้ว</Badge>}
            </div>
            <div className="flex shrink-0 gap-1">
              <Button
                size="icon"
                variant="ghost"
                aria-label="รายละเอียด"
                onClick={() => setView(r.id)}
              >
                <Eye />
              </Button>
              {!r.resolved && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={async () => {
                    await resolve.mutateAsync({ id: r.id });
                    refresh();
                  }}
                >
                  แก้ไขแล้ว
                </Button>
              )}
              <Button
                size="icon"
                variant="ghost"
                className="text-destructive"
                aria-label="ลบ"
                onClick={async () => {
                  if (
                    !window.confirm(
                      "คุณต้องการลบรายการนี้หรือไม่? การดำเนินการต่อไปนี้จะไม่สามารถกลับมาแก้ไขได้",
                    )
                  )
                    return;
                  await del.mutateAsync({ id: r.id });
                  refresh();
                }}
              >
                <X />
              </Button>
            </div>
          </div>
        ))}
      </div>
      <Dialog open={!!current} onOpenChange={(o) => !o && setView(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>รายละเอียด</DialogTitle>
            <DialogDescription className="sr-only">
              รายละเอียดรายงาน
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-1 text-sm">
            {REPORT_REASONS.filter((r) => detail[r.key]).map((r) => (
              <p key={r.key}>- {r.label}</p>
            ))}
            {detail.other && <p>- {String(detail.other)}</p>}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
