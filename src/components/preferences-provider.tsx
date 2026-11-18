"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export type FontSize = "sm" | "md" | "lg";
export type PostLayout = "grid" | "list";

export type Preferences = {
  /** Root text size; every rem-based size scales with it. */
  fontSize: FontSize;
  /** Turns off page transitions and animations regardless of the OS setting. */
  reduceMotion: boolean;
  /** Default layout of every post listing (grid or list). */
  layout: PostLayout;
  /** Show the "you are leaving the site" page before opening outbound links. */
  warnExternalLinks: boolean;
  /** Hide posts tagged as spoilers from listings. */
  hideSpoilers: boolean;
};

export const DEFAULT_PREFERENCES: Preferences = {
  fontSize: "md",
  reduceMotion: false,
  layout: "grid",
  warnExternalLinks: true,
  hideSpoilers: false,
};

const KEY = "preferences";
const LEGACY_LAYOUT_KEY = "post-layout";

type Ctx = {
  prefs: Preferences;
  setPref: <K extends keyof Preferences>(key: K, value: Preferences[K]) => void;
  reset: () => void;
  /** False until localStorage has been read, so UIs can avoid flashing defaults. */
  ready: boolean;
};

const PreferencesContext = createContext<Ctx>({
  prefs: DEFAULT_PREFERENCES,
  setPref: () => {},
  reset: () => {},
  ready: false,
});

export const usePreferences = () => useContext(PreferencesContext);

function sanitize(raw: unknown): Preferences {
  const r = (raw && typeof raw === "object" ? raw : {}) as Record<
    string,
    unknown
  >;
  const d = DEFAULT_PREFERENCES;
  return {
    fontSize:
      r.fontSize === "sm" || r.fontSize === "md" || r.fontSize === "lg"
        ? r.fontSize
        : d.fontSize,
    reduceMotion:
      typeof r.reduceMotion === "boolean" ? r.reduceMotion : d.reduceMotion,
    layout: r.layout === "grid" || r.layout === "list" ? r.layout : d.layout,
    warnExternalLinks:
      typeof r.warnExternalLinks === "boolean"
        ? r.warnExternalLinks
        : d.warnExternalLinks,
    hideSpoilers:
      typeof r.hideSpoilers === "boolean" ? r.hideSpoilers : d.hideSpoilers,
  };
}

function load(): Preferences {
  try {
    const stored = localStorage.getItem(KEY);
    if (stored) return sanitize(JSON.parse(stored));
    // Carry over the grid/list choice saved before preferences existed.
    const legacy = JSON.parse(
      localStorage.getItem(LEGACY_LAYOUT_KEY) ?? "null",
    );
    return sanitize({ layout: legacy });
  } catch {
    return DEFAULT_PREFERENCES;
  }
}

/** Device-level site preferences (stored in localStorage) applied to <html>. */
export function PreferencesProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [prefs, setPrefs] = useState<Preferences>(DEFAULT_PREFERENCES);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setPrefs(load());
    setReady(true);
  }, []);

  // Keep several open tabs in sync.
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === KEY) setPrefs(load());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.fontSize = prefs.fontSize;
    root.dataset.motion = prefs.reduceMotion ? "reduce" : "full";
  }, [prefs.fontSize, prefs.reduceMotion]);

  const persist = (next: Preferences) => {
    try {
      localStorage.setItem(KEY, JSON.stringify(next));
    } catch {}
  };

  const setPref = useCallback<Ctx["setPref"]>((key, value) => {
    setPrefs((prev) => {
      const next = { ...prev, [key]: value };
      persist(next);
      return next;
    });
  }, []);

  const reset = useCallback(() => {
    setPrefs(DEFAULT_PREFERENCES);
    persist(DEFAULT_PREFERENCES);
  }, []);

  const value = useMemo(
    () => ({ prefs, setPref, reset, ready }),
    [prefs, setPref, reset, ready],
  );

  return (
    <PreferencesContext.Provider value={value}>
      {children}
    </PreferencesContext.Provider>
  );
}
