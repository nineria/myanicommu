import { Settings } from "lucide-react";
import type { Metadata } from "next";
import { PageShell } from "@/components/layout/page-shell";
import { SettingsView } from "@/components/settings/settings-view";

export const metadata: Metadata = { title: "การตั้งค่า" };

export default function SettingPage() {
  return (
    <PageShell className="space-y-4">
      <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight">
        <Settings className="size-6" />
        การตั้งค่า
      </h1>
      <SettingsView />
    </PageShell>
  );
}
