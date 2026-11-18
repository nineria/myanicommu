import { Settings } from "lucide-react";
import type { Metadata } from "next";
import { PageShell } from "@/components/layout/page-shell";
import { ThemeSetting } from "@/components/theme-setting";
import { Separator } from "@/components/ui/separator";

export const metadata: Metadata = { title: "การตั้งค่า" };

export default function SettingPage() {
  return (
    <PageShell>
      <div className="w-full overflow-hidden rounded-xl border bg-card">
        <div className="flex items-center gap-2 px-4 py-3 font-bold text-foreground">
          <Settings className="size-[18px]" />
          <span className="text-lg">การตั้งค่า</span>
        </div>
        <Separator className="opacity-50" />
        <ThemeSetting />
      </div>
    </PageShell>
  );
}
