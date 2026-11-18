import { Settings } from "lucide-react";
import type { Metadata } from "next";
import { PageShell } from "@/components/layout/page-shell";
import { ThemeSetting } from "@/components/theme-setting";
import { Separator } from "@/components/ui/separator";

export const metadata: Metadata = { title: "การตั้งค่า" };

export default function SettingPage() {
  return (
    <PageShell>
      <div className="my-2 w-full rounded-lg bg-card pb-2 shadow-sm">
        <div className="flex items-center gap-2 px-4 py-2 font-bold text-foreground">
          <Settings className="size-[18px]" />
          <span className="text-lg">การตั้งค่า</span>
        </div>
        <Separator className="opacity-50" />
        <ThemeSetting />
      </div>
    </PageShell>
  );
}
