"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { ACCENT_THEMES } from "@/lib/constants";

type Accent = (typeof ACCENT_THEMES)[number]["value"];
const KEY = "accent";
const Ctx = createContext<{ accent: Accent; setAccent: (a: Accent) => void }>({
  accent: "pinky",
  setAccent: () => {},
});

export const useAccent = () => useContext(Ctx);

/** Named colour themes (red/ocean/pinky/neon); light/dark is handled by next-themes. */
export function AccentProvider({ children }: { children: React.ReactNode }) {
  const [accent, setAccentState] = useState<Accent>("pinky");

  useEffect(() => {
    try {
      const saved = localStorage.getItem(KEY) as Accent | null;
      if (saved && ACCENT_THEMES.some((t) => t.value === saved)) {
        setAccentState(saved);
      }
    } catch {}
  }, []);

  useEffect(() => {
    document.documentElement.dataset.accent = accent;
  }, [accent]);

  const setAccent = useCallback((a: Accent) => {
    setAccentState(a);
    try {
      localStorage.setItem(KEY, a);
    } catch {}
  }, []);

  return <Ctx.Provider value={{ accent, setAccent }}>{children}</Ctx.Provider>;
}
