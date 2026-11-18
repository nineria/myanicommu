"use client";

import { SignInButton, useClerk } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";
import {
  ExternalLink,
  EyeOff,
  LayoutGrid,
  List,
  LogOut,
  Moon,
  Palette,
  RotateCcw,
  ShieldCheck,
  Sun,
  Type,
  UserRound,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useAccent } from "@/components/accent-provider";
import {
  type FontSize,
  type PostLayout,
  usePreferences,
} from "@/components/preferences-provider";
import { EditProfileButton } from "@/components/profile/edit-profile-dialog";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { ACCENT_THEMES } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { useTRPC } from "@/trpc/client";

const SECTIONS = [
  { id: "appearance", label: "การแสดงผล", icon: Palette },
  { id: "reading", label: "การอ่านและฟีด", icon: LayoutGrid },
  { id: "account", label: "บัญชี", icon: UserRound },
] as const;

export function SettingsView() {
  const { reset } = usePreferences();
  const { setTheme } = useTheme();
  const { setAccent } = useAccent();

  const resetAll = () => {
    reset();
    setTheme("dark");
    setAccent("pinky");
    toast.success("คืนค่าการตั้งค่าเริ่มต้นแล้ว");
  };

  return (
    <div className="grid gap-6 md:grid-cols-[13rem_1fr]">
      <nav
        aria-label="หมวดการตั้งค่า"
        className="flex gap-1 overflow-x-auto md:sticky md:top-20 md:flex-col md:self-start"
      >
        {SECTIONS.map(({ id, label, icon: Icon }) => (
          <a
            key={id}
            href={`#${id}`}
            className="flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground transition hover:bg-accent hover:text-foreground"
          >
            <Icon className="size-4" />
            {label}
          </a>
        ))}
      </nav>

      <div className="min-w-0 space-y-6">
        <AppearanceSection />
        <ReadingSection />
        <AccountSection />
        <div className="flex justify-end">
          <Button variant="ghost" size="sm" onClick={resetAll}>
            <RotateCcw /> คืนค่าการตั้งค่าบนอุปกรณ์นี้เป็นค่าเริ่มต้น
          </Button>
        </div>
      </div>
    </div>
  );
}

function Section({
  id,
  title,
  description,
  children,
}: {
  id: string;
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className="scroll-mt-24 rounded-lg bg-card"
    >
      <div className="px-4 pt-4">
        <h2 id={`${id}-title`} className="text-lg font-bold">
          {title}
        </h2>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      <div className="divide-y divide-border/60 px-4 pb-2">{children}</div>
    </section>
  );
}

function Row({
  icon: Icon,
  title,
  description,
  htmlFor,
  children,
  stack,
}: {
  icon?: React.ComponentType<{ className?: string }>;
  title: string;
  description?: string;
  htmlFor?: string;
  children: React.ReactNode;
  /** Put the control under the text instead of beside it. */
  stack?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex gap-3 py-4",
        stack ? "flex-col" : "items-center justify-between",
      )}
    >
      <div className="flex min-w-0 items-start gap-3">
        {Icon && (
          <Icon className="mt-0.5 size-5 shrink-0 text-muted-foreground" />
        )}
        <div className="min-w-0">
          <label htmlFor={htmlFor} className="font-semibold">
            {title}
          </label>
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>
      </div>
      {children}
    </div>
  );
}

function Segmented<T extends string>({
  value,
  onChange,
  options,
  label,
}: {
  value: T;
  onChange: (v: T) => void;
  options: {
    value: T;
    label: string;
    icon?: React.ComponentType<{ className?: string }>;
  }[];
  label: string;
}) {
  return (
    <div
      role="radiogroup"
      aria-label={label}
      className="inline-flex shrink-0 rounded-none border p-1"
    >
      {options.map(({ value: v, label: l, icon: Icon }) => (
        <button
          key={v}
          type="button"
          role="radio"
          aria-checked={value === v}
          onClick={() => onChange(v)}
          className={cn(
            "flex items-center gap-1.5 rounded-none px-3.5 py-1.5 text-sm transition",
            value === v
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          {Icon && <Icon className="size-4" />}
          {l}
        </button>
      ))}
    </div>
  );
}

function AppearanceSection() {
  const { accent, setAccent } = useAccent();
  const { resolvedTheme, setTheme } = useTheme();
  const { prefs, setPref } = usePreferences();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <Section
      id="appearance"
      title="การแสดงผล"
      description="บันทึกไว้ในเบราว์เซอร์ของอุปกรณ์เครื่องนี้"
    >
      <Row icon={Palette} title="สีหลักของเว็บไซต์" stack>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {ACCENT_THEMES.map((t) => (
            <button
              key={t.value}
              type="button"
              aria-pressed={accent === t.value}
              onClick={() => setAccent(t.value)}
              className={cn(
                "flex items-center gap-2 rounded-lg border p-3 text-sm transition",
                accent === t.value
                  ? "border-primary ring-2 ring-primary"
                  : "hover:border-primary/60",
              )}
            >
              <span
                className="size-5 rounded-none"
                style={{ background: t.color }}
              />
              {t.label}
            </button>
          ))}
        </div>
      </Row>
      <Row icon={Moon} title="โหมดสี" description="เลือกพื้นหลังมืดหรือสว่าง">
        <Segmented
          label="โหมดสี"
          value={(mounted ? resolvedTheme : undefined) as "dark" | "light"}
          onChange={setTheme}
          options={[
            { value: "dark", label: "มืด", icon: Moon },
            { value: "light", label: "สว่าง", icon: Sun },
          ]}
        />
      </Row>
      <Row icon={Type} title="ขนาดตัวอักษร" description="ปรับขนาดข้อความทั้งเว็บไซต์">
        <Segmented<FontSize>
          label="ขนาดตัวอักษร"
          value={prefs.fontSize}
          onChange={(v) => setPref("fontSize", v)}
          options={[
            { value: "sm", label: "เล็ก" },
            { value: "md", label: "ปกติ" },
            { value: "lg", label: "ใหญ่" },
          ]}
        />
      </Row>
      <Row
        icon={Zap}
        title="ลดการเคลื่อนไหว"
        description="ปิดแอนิเมชันและการเปลี่ยนหน้าแบบเคลื่อนไหว"
        htmlFor="pref-motion"
      >
        <Switch
          id="pref-motion"
          checked={prefs.reduceMotion}
          onCheckedChange={(c) => setPref("reduceMotion", c)}
        />
      </Row>
    </Section>
  );
}

function ReadingSection() {
  const { prefs, setPref } = usePreferences();
  return (
    <Section
      id="reading"
      title="การอ่านและฟีด"
      description="กำหนดวิธีแสดงโพสต์และการเปิดลิงก์"
    >
      <Row
        icon={LayoutGrid}
        title="รูปแบบรายการโพสต์"
        description="ใช้กับหน้าโพสต์ ข่าวสาร รีวิว Q&A และค้นหา"
      >
        <Segmented<PostLayout>
          label="รูปแบบรายการโพสต์"
          value={prefs.layout}
          onChange={(v) => setPref("layout", v)}
          options={[
            { value: "grid", label: "ตาราง", icon: LayoutGrid },
            { value: "list", label: "รายการ", icon: List },
          ]}
        />
      </Row>
      <Row
        icon={EyeOff}
        title="ซ่อนโพสต์ที่มีสปอยล์"
        description="ไม่แสดงโพสต์ที่ติดแท็ก “สปอย” ในรายการโพสต์"
        htmlFor="pref-spoilers"
      >
        <Switch
          id="pref-spoilers"
          checked={prefs.hideSpoilers}
          onCheckedChange={(c) => setPref("hideSpoilers", c)}
        />
      </Row>
      <Row
        icon={ExternalLink}
        title="เตือนก่อนเปิดลิงก์ภายนอก"
        description="แสดงหน้าแจ้งเตือนก่อนออกจากเว็บไซต์ผ่านลิงก์ในโพสต์และความคิดเห็น"
        htmlFor="pref-external"
      >
        <Switch
          id="pref-external"
          checked={prefs.warnExternalLinks}
          onCheckedChange={(c) => setPref("warnExternalLinks", c)}
        />
      </Row>
    </Section>
  );
}

function AccountSection() {
  const trpc = useTRPC();
  const { signOut, openUserProfile } = useClerk();
  const { data: me, isPending: mePending } = useQuery(
    trpc.user.me.queryOptions(),
  );
  // The server always renders the skeleton (the query is prefetched, not awaited), so wait for mount.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const isPending = !mounted || mePending;
  const { data: profile } = useQuery({
    ...trpc.user.byUsername.queryOptions({ username: me?.username ?? "" }),
    enabled: !!me,
  });

  return (
    <Section
      id="account"
      title="บัญชี"
      description="ข้อมูลโปรไฟล์และความปลอดภัยของบัญชี"
    >
      {isPending ? (
        <div className="space-y-3 py-4">
          <Skeleton className="h-5 w-1/2" />
          <Skeleton className="h-5 w-2/3" />
        </div>
      ) : !me ? (
        <Row
          icon={UserRound}
          title="ยังไม่ได้เข้าสู่ระบบ"
          description="เข้าสู่ระบบเพื่อจัดการโปรไฟล์และบัญชีของคุณ"
        >
          <SignInButton mode="modal">
            <Button>เข้าสู่ระบบ</Button>
          </SignInButton>
        </Row>
      ) : (
        <>
          <Row
            icon={UserRound}
            title={`@${me.username}`}
            description={me.email || undefined}
          >
            <Button variant="secondary" size="sm" asChild>
              <Link href={`/${me.username}`}>ดูโปรไฟล์</Link>
            </Button>
          </Row>
          {profile && (
            <Row
              icon={UserRound}
              title="ข้อมูลส่วนตัว"
              description="ชื่อผู้ใช้ รูปโปรไฟล์ แบนเนอร์ ประวัติย่อ และโซเชียล"
            >
              <EditProfileButton
                profile={{
                  username: profile.username,
                  bio: profile.bio,
                  avatar: profile.avatar,
                  banner: profile.banner,
                  website: profile.website ?? "",
                  facebook: profile.facebook ?? "",
                  twitter: profile.twitter ?? "",
                  instagram: profile.instagram ?? "",
                }}
              />
            </Row>
          )}
          <Row
            icon={ShieldCheck}
            title="อีเมล รหัสผ่าน และบัญชีที่เชื่อมต่อ"
            description="จัดการความปลอดภัยของการเข้าสู่ระบบ"
          >
            <Button
              variant="secondary"
              size="sm"
              onClick={() => openUserProfile()}
            >
              จัดการ
            </Button>
          </Row>
          <Row
            icon={LogOut}
            title="ออกจากระบบ"
            description="การลบบัญชีอยู่ใน “แก้ไขข้อมูลส่วนตัว” ด้านบน"
          >
            <Button
              variant="outline"
              size="sm"
              onClick={() => signOut({ redirectUrl: "/" })}
            >
              ออกจากระบบ
            </Button>
          </Row>
        </>
      )}
    </Section>
  );
}
