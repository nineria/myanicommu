"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { useAccent } from "@/components/accent-provider";
import { ACCENT_THEMES } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function ThemeSetting() {
  const { accent, setAccent } = useAccent();
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div className="space-y-6 p-4 text-foreground">
      <div>
        <p className="mb-2 font-semibold">ธีม</p>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {ACCENT_THEMES.map((t) => (
            <button
              key={t.value}
              type="button"
              onClick={() => setAccent(t.value)}
              className={cn(
                "flex items-center gap-2 rounded-xl border p-3 text-sm transition",
                accent === t.value
                  ? "border-primary ring-2 ring-primary"
                  : "hover:border-primary/60",
              )}
            >
              <span
                className="size-5 rounded-full"
                style={{ background: t.color }}
              />
              {t.label}
            </button>
          ))}
        </div>
      </div>
      <div>
        <p className="mb-2 font-semibold">โหมดสี</p>
        <div className="inline-flex rounded-xl border p-1">
          {(
            [
              { value: "dark", label: "มืด", icon: Moon },
              { value: "light", label: "สว่าง", icon: Sun },
            ] as const
          ).map(({ value, label, icon: Icon }) => (
            <button
              key={value}
              type="button"
              onClick={() => setTheme(value)}
              className={cn(
                "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm",
                mounted && resolvedTheme === value
                  ? "bg-primary text-primary-foreground"
                  : "text-foreground/70",
              )}
            >
              <Icon className="size-4" /> {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
