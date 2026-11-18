"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Eye, Pencil, Plus, Trash2, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
  AnnouncementFormDialog,
  type AnnouncementValues,
} from "@/components/announcement-form-dialog";
import { TagBadge } from "@/components/post/tag-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { RANKS, REPORT_REASONS } from "@/lib/constants";
import { useTRPC } from "@/trpc/client";

const card = "rounded-xl border bg-card p-4";

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
          className="rounded-xl border bg-card p-3 text-center"
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
  const [target, setTarget] = useState<string | null>(null);
  const give = useMutation(trpc.user.giveRank.mutationOptions());
  const remove = useMutation(trpc.user.removeRank.mutationOptions());
  const setRole = useMutation(trpc.user.setRole.mutationOptions());
  const refresh = () => qc.invalidateQueries({ queryKey: q.queryKey });
  const targetUser = users?.find((u) => u.id === target);

  return (
    <div className={card}>
      <h3 className="mb-2 text-lg font-semibold text-foreground">จัดการผู้ใช้</h3>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ชื่อผู้ใช้</TableHead>
            <TableHead>อีเมล</TableHead>
            <TableHead>แรงค์</TableHead>
            <TableHead>ผู้ดูแล</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users?.map((u) => (
            <TableRow key={u.id}>
              <TableCell>{u.username}</TableCell>
              <TableCell className="max-w-40 truncate">{u.email}</TableCell>
              <TableCell>
                <div className="flex flex-wrap items-center gap-1">
                  {u.ranks.map((r) => (
                    <TagBadge
                      key={r.id}
                      label={r.label}
                      from={r.colorFrom}
                      to={r.colorTo}
                      deg={35}
                    />
                  ))}
                  <Button
                    size="icon"
                    variant="ghost"
                    className="size-6"
                    onClick={() => setTarget(u.id)}
                    aria-label="เพิ่มแรงค์"
                  >
                    <Plus />
                  </Button>
                </div>
              </TableCell>
              <TableCell>
                <Switch
                  checked={u.role === "ADMIN"}
                  onCheckedChange={async (c) => {
                    try {
                      await setRole.mutateAsync({
                        userId: u.id,
                        role: c ? "ADMIN" : "MEMBER",
                      });
                      refresh();
                    } catch {
                      toast.error("ไม่สามารถเปลี่ยนสิทธิ์ได้");
                    }
                  }}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={!!targetUser} onOpenChange={(o) => !o && setTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>เพิ่มแรงค์ของ {targetUser?.username}!</DialogTitle>
            <DialogDescription>
              แรงค์ของ {targetUser?.username}
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-wrap gap-1">
            {targetUser?.ranks.map((r) => (
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
          <p className="text-sm text-muted-foreground">แรงค์ทั้งหมดที่สามารถเพิ่มได้</p>
          <div className="flex flex-wrap gap-1">
            {RANKS.filter(
              (r) => !targetUser?.ranks.some((x) => x.label === r.label),
            ).map((r) => (
              <button
                key={r.label}
                type="button"
                onClick={async () => {
                  if (!target) return;
                  await give.mutateAsync({ userId: target, ranks: [r] });
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
        </DialogContent>
      </Dialog>
    </div>
  );
}

function AnnouncementControl() {
  const trpc = useTRPC();
  const qc = useQueryClient();
  const q = trpc.announcement.all.queryOptions();
  const { data } = useQuery(q);
  const [form, setForm] = useState<AnnouncementValues | "new" | null>(null);
  const update = useMutation(trpc.announcement.update.mutationOptions());
  const del = useMutation(trpc.announcement.delete.mutationOptions());
  const refresh = () => qc.invalidateQueries({ queryKey: q.queryKey });

  const list = (published: boolean) =>
    data
      ?.filter((a) => a.published === published)
      .map((a) => (
        <div
          key={a.id}
          className="flex items-center justify-between gap-2 rounded-md border p-2"
        >
          <div className="min-w-0">
            <Badge variant="outline" className="mr-2">
              {a.type}
            </Badge>
            <span className="truncate text-sm">{a.title}</span>
          </div>
          <div className="flex shrink-0 items-center gap-1">
            <Switch
              checked={a.published}
              aria-label="เผยแพร่"
              onCheckedChange={async (c) => {
                await update.mutateAsync({
                  id: a.id,
                  type: a.type,
                  title: a.title,
                  content: a.content,
                  published: c,
                });
                refresh();
              }}
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
              onClick={async () => {
                if (!window.confirm("คุณต้องการลบรายการนี้หรือไม่?")) return;
                await del.mutateAsync({ id: a.id });
                refresh();
              }}
            >
              <Trash2 />
            </Button>
          </div>
        </div>
      ));

  return (
    <div className={card}>
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">จัดการประกาศ</h3>
        <Button size="sm" onClick={() => setForm("new")}>
          <Plus /> สร้างประกาศ
        </Button>
      </div>
      <p className="my-2 text-sm text-muted-foreground">ประกาศที่กำลังเปิดใช้</p>
      <div className="space-y-1">{list(true)}</div>
      <p className="my-2 text-sm text-muted-foreground">ประกาศที่ยังไม่เปิดใช้</p>
      <div className="space-y-1">{list(false)}</div>
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
            className="flex items-center justify-between gap-2 rounded-md border p-2"
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
